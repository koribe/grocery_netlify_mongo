import { MongoServerError } from "mongodb";
import { userDbConnect } from "../utils/userDbConnect.js";
import { httpResponse } from "../utils/httpResponse.js";
import { errors } from "../../../errors.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const USER_COLLECTION = process.env.USER_COLLECTION;
const JWT_SECRET = process.env.JWT_SECRET;

const queryDatabase = async (db, username) => {
  const user = await db.collection(USER_COLLECTION).findOne({ name: username });
  if (!user) {
    throw { code: errors.USER_NAME_AUTH_FAIL };
  }
  return user;
};

export async function handler(event, context) {
  try {
    const db = await userDbConnect();
    const requestBody = JSON.parse(event.body);
    //Checks if login request contains username and password
    if (!(requestBody.username && requestBody.password)) {
      throw { code: errors.MISSING_AUTH_INPUTS };
    }
    //Get the user from collection
    const user = await queryDatabase(db, requestBody.username);

    //Compare the request password's hash with the stored hash
    const pwdIsCorrect = await bcrypt.compare(
      requestBody.password,
      user.password
    );
    if (!pwdIsCorrect) {
      throw { code: errors.USER_PWD_AUTH_FAIL };
    }
    //If everything is fine,we send back the jwt to the client
    const token = jwt.sign({ user_id: user._id }, JWT_SECRET);
    return httpResponse(200, { token: token });
  } catch (error) {
    console.error("Something went wrong (user_validation):", error);
    if (error instanceof MongoServerError && error.code === 8000) {
      return httpResponse(401, {
        code: errors.DB_AUTH_FAIL,
        error:
          "Database authentication failed(Invalid DB username, password or cluster)",
      });
    }
    if (error.code === errors.USER_NAME_AUTH_FAIL) {
      return httpResponse(401, {
        code: errors.USER_NAME_AUTH_FAIL,
        error: "Username doesn't exist!",
      });
    }
    if (error.code === errors.USER_PWD_AUTH_FAIL) {
      return httpResponse(401, {
        code: errors.USER_PWD_AUTH_FAIL,
        error: "Password is incorrect!",
      });
    }
    if (error.code === errors.MISSING_AUTH_INPUTS) {
      return httpResponse(401, {
        code: errors.MISSING_AUTH_INPUTS,
        error: "Missing authentication inputs!",
      });
    }
    return httpResponse(500, {
      code: errors.UNKNOWN_ERROR,
      error: "An error occurred. Please try again!",
    });
  }
}
