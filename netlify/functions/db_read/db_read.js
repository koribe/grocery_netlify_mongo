const { ObjectId } = require("mongodb");

const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "Gyakorlas";
const COLLECTION_NAME = "grocery";

let cachedDb = null;

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};

//Reading data from database
const queryDatabase = async (db) => {
  const grocery = await db.collection(COLLECTION_NAME).find({}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(grocery),
  };
};

//Creating new document in collection
const pushToDatabase = async (db, data) => {
  if (data) {
    await db.collection(COLLECTION_NAME).insertOne(data);
    return { statusCode: 201 };
  } else {
    return { statusCode: 422 };
  }
};

//Edit document
const editDatabase = async (db, data) => {
  if (data) {
    const oid = ObjectId(data._id);
    const item = data.item;
    await db
      .collection(COLLECTION_NAME)
      .updateOne({ _id: oid }, { $set: { item: item } });
    return { statusCode: 204 };
  } else {
    return { statusCode: 404 };
  }
};

//Deleting document from collection
const delFromDatabase = async (db, data) => {
  if (data) {
    //if http request's body exist and the body have an _id property with "all" string value, then delete all document from collection
    if (data._id === "all") {
      await db.collection(COLLECTION_NAME).deleteMany({});
      return { statusCode: 204 };
    }
    //if _id is not "all", then delete the first document from the collection with _id the same as http request's body _id property
    const oid = ObjectId(data._id);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: oid });
    return { statusCode: 204 };
  } else {
    return { statusCode: 404 };
  }
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);
  switch (event.httpMethod) {
    case "GET":
      return queryDatabase(db);
    case "POST":
      return pushToDatabase(db, JSON.parse(event.body));
    case "PATCH":
      return editDatabase(db, JSON.parse(event.body));
    case "DELETE":
      return delFromDatabase(db, JSON.parse(event.body));
    default:
      return { statusCode: 400 };
  }
};
