import { groceryDbConnect } from "../utils/groceryDbConnect.js";
import { httpResponse } from "../utils/httpResponse.js";
import { ObjectId } from "mongodb";
import { transformToApiError } from "../utils/transformToApiError.js";
import jwt from "jsonwebtoken";
import { GroceryInvalidAuthHeader } from "../utils/errors/GroceryInvalidAuthHeader.js";
import { GroceryInvalidJwt } from "../utils/errors/GroceryInvalidJwt.js";
import { GroceryMissingRequest } from "../utils/errors/GroceryMissingRequest.js";
import { GroceryItemExists } from "../utils/errors/GroceryItemExists.js";
import { GroceryInvalidHttpRequest } from "../utils/errors/GroceryInvalidHttpRequest.js";
import { GroceryListExceed } from "../utils/errors/GroceryListExceed.js";
import { GroceryCharExceed } from "../utils/errors/GroceryCharExceed.js";

const JWT_SECRET = process.env.JWT_SECRET;

//Reading data from database
const queryDocuments = async (db, username, user_id) => {
  const grocery = await db
    .collection(username)
    .find({ user_id: user_id })
    .toArray();

  return grocery;
};

//Creating new document in collection
const pushToDatabase = async (db, username, user_id, item) => {
  if (!item) throw new GroceryMissingRequest("Missing request data!");

  if (item.length > 30) throw new GroceryCharExceed("Max. 30 characters!");

  const groceryExceed = await queryDocuments(db, username, user_id);
  if (groceryExceed.length >= 50) throw new GroceryListExceed("Max. 50 item!");

  //Checks if the user already have the item on his list
  const groceryExists = await db
    .collection(username)
    .findOne({ item: item, user_id: user_id });
  if (groceryExists) throw new GroceryItemExists("Item is already on list!");

  await db.collection(username).insertOne({ item: item, user_id: user_id });
};

//Edit document
const editDatabase = async (db, username, user_id, item_id, item) => {
  if (!(username && user_id && item_id && item))
    throw new GroceryMissingRequest("Missing request data!");

  if (item.length > 30) throw new GroceryCharExceed("Max. 30 characters!");

  //Checks if the user already have the item on his list
  const groceryExists = await db
    .collection(username)
    .findOne({ item: item, user_id: user_id });
  if (groceryExists) throw new GroceryItemExists("Item is already on list!");

  const oid = ObjectId(item_id);
  await db
    .collection(username)
    .updateOne({ _id: oid, user_id: user_id }, { $set: { item: item } });
};

//Delete document from collection
const delFromDatabase = async (db, username, user_id, item_id) => {
  if (!(username && user_id && item_id))
    throw new GroceryMissingRequest("Missing request data!");

  if (item_id === "all") {
    await db.collection(username).deleteMany({ user_id: user_id });
  } else {
    //if _id is not "all", then delete the first document from the collection with _id the same as http request's body _id property
    const oid = ObjectId(item_id);
    await db.collection(username).deleteOne({ _id: oid, user_id: user_id });
  }
};

export async function handler(event, context) {
  try {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
    context.callbackWaitsForEmptyEventLoop = false;

    //Checks if authentication header format is valid
    if (!event.headers.authorization.startsWith("Bearer "))
      throw new GroceryInvalidAuthHeader("Invalid authentication header!");
    const token = event.headers.authorization.split(" ")[1];
    const tokenPayload = jwt.verify(token, JWT_SECRET);
    if (!tokenPayload) {
      throw new GroceryInvalidJwt("Invalid JSON WebToken!");
    }
    const db = await groceryDbConnect();

    switch (event.httpMethod) {
      //READ
      case "GET":
        const groceries = await queryDocuments(
          db,
          tokenPayload.username,
          tokenPayload.user_id
        );
        return httpResponse(200, groceries);

      //CREATE
      case "POST":
        const postBody = JSON.parse(event.body);

        await pushToDatabase(
          db,
          tokenPayload.username,
          tokenPayload.user_id,
          postBody.item.toLowerCase()
        );
        return httpResponse(201, "New list item created!");

      //EDIT
      case "PATCH":
        const patchBody = JSON.parse(event.body);
        await editDatabase(
          db,
          tokenPayload.username,
          tokenPayload.user_id,
          patchBody._id,
          patchBody.item.toLowerCase()
        );
        return httpResponse(204, "");

      //DELETE
      case "DELETE":
        const deleteBody = JSON.parse(event.body);
        await delFromDatabase(
          db,
          tokenPayload.username,
          tokenPayload.user_id,
          deleteBody._id
        );
        return httpResponse(204, "");

      default:
        throw new GroceryInvalidHttpRequest("Invalid HTTP request!");
    }
  } catch (error) {
    return transformToApiError(error);
  }
}
