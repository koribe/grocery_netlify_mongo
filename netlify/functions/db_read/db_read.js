import { dbConnect } from "../utils/dbConnect.js";
import { httpResponse } from "../utils/httpResponse.js";
import { MongoServerError, ObjectId } from "mongodb";
import { errors } from "../../../errors.mjs";
import jwt from "jsonwebtoken";

const GROCERY_COLLECTION = process.env.GROCERY_COLLECTION;
const JWT_SECRET = process.env.JWT_SECRET;

//Reading data from database
const queryDocuments = async (db, user_id) => {
  const grocery = await db
    .collection(GROCERY_COLLECTION)
    .find({ user_id: user_id })
    .toArray();

  return grocery;
};

//Creating new document in collection
const pushToDatabase = async (db, user_id, item) => {
  if (!item) throw { code: errors.EMPTY_REQUEST_BODY };

  //Checks if the user already have the item on his list
  const groceryExists = await db
    .collection(GROCERY_COLLECTION)
    .findOne({ item: item, user_id: user_id });
  if (groceryExists) throw { code: errors.ITEM_EXISTS };

  await db
    .collection(GROCERY_COLLECTION)
    .insertOne({ item: item, user_id: user_id });
};

//Edit document
const editDatabase = async (db, user_id, item_id, item) => {
  if (!(user_id && item_id && item)) throw { code: errors.EMPTY_REQUEST_BODY };
  //Checks if the user already have the item on his list
  const groceryExists = await db
    .collection(GROCERY_COLLECTION)
    .findOne({ item: item, user_id: user_id });
  if (groceryExists) throw { code: errors.ITEM_EXISTS };

  const oid = ObjectId(item_id);
  await db
    .collection(GROCERY_COLLECTION)
    .updateOne({ _id: oid, user_id: user_id }, { $set: { item: item } });
};

//Deleting document from collection
const delFromDatabase = async (db, user_id, item_id) => {
  if (!(user_id && item_id)) throw { code: errors.EMPTY_REQUEST_BODY };

  if (item_id === "all") {
    await db.collection(GROCERY_COLLECTION).deleteMany({ user_id: user_id });
  } else {
    //if _id is not "all", then delete the first document from the collection with _id the same as http request's body _id property
    const oid = ObjectId(item_id);
    await db
      .collection(GROCERY_COLLECTION)
      .deleteOne({ _id: oid, user_id: user_id });
  }
};

export async function handler(event, context) {
  try {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
    context.callbackWaitsForEmptyEventLoop = false;

    //
    if (!event.headers.authorization.startsWith("Bearer ")) {
      throw { code: errors.BAD_AUTH_HEADER };
    }
    const token = event.headers.authorization.split(" ")[1];
    const tokenPayload = jwt.verify(token, JWT_SECRET);
    if (!tokenPayload) {
      throw { code: errors.INVALID_JWT };
    }
    const db = await dbConnect();

    //READ
    switch (event.httpMethod) {
      case "GET":
        const groceries = await queryDocuments(db, tokenPayload.user_id);
        return httpResponse(200, groceries);

      //CREATE
      case "POST":
        const postBody = JSON.parse(event.body);
        await pushToDatabase(
          db,
          tokenPayload.user_id,
          postBody.item.toLowerCase()
        );
        return httpResponse(201, "New list item created!");

      //EDIT
      case "PATCH":
        const patchBody = JSON.parse(event.body);
        await editDatabase(
          db,
          tokenPayload.user_id,
          patchBody._id,
          patchBody.item.toLowerCase()
        );
        return httpResponse(204, "");

      //DELETE
      case "DELETE":
        const deleteBody = JSON.parse(event.body);
        await delFromDatabase(db, tokenPayload.user_id, deleteBody._id);
        return httpResponse(204, "");

      default:
        return httpResponse(400, {
          code: errors.BAD_HTTP_REQUEST,
          error: "Invalid HTTP request!",
        });
    }
  } catch (error) {
    console.error("Something went wrong (db_read):", error);
    if (error instanceof MongoServerError && error.code === 8000) {
      return httpResponse(401, {
        code: errors.DB_AUTH_FAIL,
        error:
          "Database authentication failed(Invalid DB username, password or cluster)",
      });
    }
    if (error.code === errors.BAD_AUTH_HEADER) {
      return httpResponse(401, {
        code: errors.BAD_AUTH_HEADER,
        error: "Invalid authorization header!",
      });
    }
    if (error.code === errors.INVALID_JWT) {
      return httpResponse(401, {
        code: errors.INVALID_JWT,
        error: "Invalid JSON WebToken!",
      });
    }
    if (error.code === errors.EMPTY_REQUEST_BODY) {
      return httpResponse(500, {
        code: errors.EMPTY_REQUEST_BODY,
        error: "Empty request body!",
      });
    }
    if (error.code === errors.ITEM_EXISTS) {
      return httpResponse(409, {
        code: errors.ITEM_EXISTS,
        error: "Item is already on list!",
      });
    }
    return httpResponse(500, {
      code: errors.UNKNOWN_ERROR,
      error: "An error occurred. Please try again!",
    });
  }
}
