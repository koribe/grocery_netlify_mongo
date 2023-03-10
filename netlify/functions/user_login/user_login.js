import { userDbConnect } from "../utils/userDbConnect.js";
import { httpResponse } from "../utils/httpResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transformToApiError } from "../utils/transformToApiError.js";
import { LoginMissingInputs } from "../utils/errors/LoginMissingInputs.js";
import { LoginNoUser } from "../utils/errors/LoginNoUser.js";
import { LoginPwdIncorrect } from "../utils/errors/LoginPwdIncorrect.js";

const USER_COLLECTION = process.env.USER_COLLECTION;
const JWT_SECRET = process.env.JWT_SECRET;

const queryUser = async (db, username) => {
  const user = await db.collection(USER_COLLECTION).findOne({ name: username });
  if (!user) {
    throw new LoginNoUser("Username doesn't exists!");
  }
  return user;
};

export async function handler(event, context) {
  try {
    const db = await userDbConnect();
    const requestBody = JSON.parse(event.body);
    //Checks if login request contains username and password
    if (!(requestBody.username && requestBody.password)) {
      throw new LoginMissingInputs("Missing login inputs!");
    }
    //Get the user from collection
    const user = await queryUser(db, requestBody.username);

    //Compare the request password's hash with the stored hash
    const pwdIsCorrect = await bcrypt.compare(
      requestBody.password,
      user.password
    );
    if (!pwdIsCorrect) {
      throw new LoginPwdIncorrect("Password is incorrect!");
    }
    //If everything is fine,we send back the jwt to the client
    const token = jwt.sign(
      { username: user.name, user_id: user._id },
      JWT_SECRET
    );
    return httpResponse(200, { token: token });
  } catch (error) {
    return transformToApiError(error);
  }
}
