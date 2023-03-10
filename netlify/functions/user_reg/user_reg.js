import { userDbConnect } from "../utils/userDbConnect.js";
import { httpResponse } from "../utils/httpResponse.js";
import bcrypt from "bcrypt";
import { RegUserExists } from "../utils/errors/RegUserExists.js";
import { RegMissingInputs } from "../utils/errors/RegMissingInputs.js";
import { RegInvalidRegkey } from "../utils/errors/RegInvalidRegkey.js";

const USER_COLLECTION = process.env.USER_COLLECTION;
const REGISTRATION_KEY = process.env.REGISTRATION_KEY;

const createUser = async (db, username, password) => {
  //Checks if the username is already taken!
  const user = await db.collection(USER_COLLECTION).findOne({ name: username });
  if (user) throw new RegUserExists("User already exists!");

  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash password
  const hash = await bcrypt.hash(password, salt);

  await db.collection(USER_COLLECTION).insertOne({
    name: username,
    password: hash,
  });
};

export async function handler(event, context) {
  try {
    const db = await userDbConnect();
    const requestBody = JSON.parse(event.body);

    validateRequestBody(requestBody);

    //Get the user from collection
    await createUser(db, requestBody.username, requestBody.password);

    return httpResponse(201, "Successful registration");
  } catch (error) {
    return transformToApiError(error);
  }
}

function validateRequestBody(requestBody) {
  //Checks if login request doesn't contains username,password or regkey
  if (!(requestBody.username && requestBody.password && requestBody.regkey)) {
    throw new RegMissingInputs("Missing registration data!");
  }
  //Checks if regkey is equal as env varible
  if (requestBody.regkey !== REGISTRATION_KEY) {
    throw new RegInvalidRegkey("Invalid Regkey!");
  }
}
