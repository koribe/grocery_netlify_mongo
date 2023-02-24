import { MongoServerError } from "mongodb";
import { userDbConnect } from "../utils/userDbConnect.js";
import { httpResponse } from "../utils/httpResponse.js";
import { errors } from "../../../errors.mjs";
import bcrypt from "bcrypt";

const USER_COLLECTION = process.env.USER_COLLECTION;
const REGISTRATION_KEY = process.env.REGISTRATION_KEY;

const createUser = async (db, username, password) => {
  //Checks if the username is already taken!
  const user = await db.collection(USER_COLLECTION).findOne({ name: username });
  if (user) {
    throw { code: errors.USER_REG_EXISTS };
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hash = await bcrypt.hash(password, salt);

    await db.collection(USER_COLLECTION).insertOne({
      name: username,
      password: hash,
    });
  } catch (error) {
    throw { code: errors.PWD_HASH_ERROR, error: error };
  }
  /*bcrypt.genSalt(10, function (saltError, salt) {
    if (saltError) {
      throw { code: errors.PWD_SALT_ERROR, error: saltError };
    } else {
      bcrypt.hash(password, salt, function (hashError, hash) {
        if (hashError) {
          throw { code: errors.PWD_HASH_ERROR, error: hashError };
        }

        db.collection(USER_COLLECTION).insertOne({
          name: username,
          password: hash,
        });
      });
    }
  });*/
};

export async function handler(event, context) {
  try {
    const db = await userDbConnect();
    const requestBody = JSON.parse(event.body);
    //Checks if login request contains username and password
    if (!(requestBody.username && requestBody.password && requestBody.regkey)) {
      throw { code: errors.MISSING_REG_INPUTS };
    }
    if (requestBody.regkey !== REGISTRATION_KEY) {
      throw { code: errors.INVALID_REGKEY };
    }
    //Get the user from collection
    await createUser(db, requestBody.username, requestBody.password);

    return httpResponse(201, "Successful registration");
  } catch (error) {
    console.error("Something went wrong (user_validation):", error);
    if (error instanceof MongoServerError && error.code === 8000) {
      return httpResponse(401, {
        code: errors.DB_AUTH_FAIL,
        error:
          "Database authentication failed(Invalid DB username, password or cluster)",
      });
    }
    if (error.code === errors.MISSING_REG_INPUTS) {
      return httpResponse(401, {
        code: errors.MISSING_REG_INPUTS,
        error: "Missing registration inputs!",
      });
    }
    if (error.code === errors.INVALID_REGKEY) {
      return httpResponse(401, {
        code: errors.INVALID_REGKEY,
        error: "Invalid registration key!",
      });
    }
    if (error.code === errors.USER_REG_EXISTS) {
      return httpResponse(401, {
        code: errors.USER_REG_EXISTS,
        error: "Username already taken!",
      });
    }
    if (error.code === errors.PWD_SALT_ERROR) {
      return httpResponse(401, {
        code: errors.PWD_SALT_ERROR,
        error: error,
      });
    }
    if (error.code === errors.PWD_HASH_ERROR) {
      return httpResponse(401, {
        code: errors.PWD_HASH_ERROR,
        error: error,
      });
    }
    return httpResponse(500, {
      code: errors.UNKNOWN_ERROR,
      error: "An error occurred. Please try again!",
    });
  }
}
