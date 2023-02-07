import { MongoClient } from "mongodb";

const DB_NAME = process.env.MONGODB_DATABASE;
const PASSWORD = process.env.MONGODB_PASSWORD;

let cachedDb = null;

export async function dbConnect(username) {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;
  const uri = `mongodb+srv://${username}:${PASSWORD}@gyakorlas.pzxshps.mongodb.net/?retryWrites=true&w=majority`;
  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
}
