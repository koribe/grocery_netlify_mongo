import { dbConnect } from "../utils/db_connect.js";
import { httpResponse } from "../utils/httpResponse.js";
import { MongoServerError } from "mongodb";
import { errors } from "../../../errors.mjs";

//Reading data from database
const queryDatabase = async (db, username) => {
  const grocery = await db.collection(username).find({}).toArray();

  return grocery;
};

export async function handler(event, context) {
  try {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
    context.callbackWaitsForEmptyEventLoop = false;
    const requestBody = JSON.parse(event.body);
    const db = await dbConnect(requestBody.username);
    const groceries = await queryDatabase(db, requestBody.username);
    return httpResponse(200, groceries);
  } catch (error) {
    console.error("Something went wrong(Ki_ez_te):", error);
    if (error instanceof MongoServerError && error.code === 8000) {
      return httpResponse(401, {
        code: errors.INVALID_DATABASE_USERNAME,
        error: "Invalid MongoDB username",
      });
    }
    return httpResponse(500, {
      code: errors.UNKNOWN_ERROR,
      error: "An error occurred. Please try again!",
    });
  }
}
