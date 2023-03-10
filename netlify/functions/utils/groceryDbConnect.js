import { MongoClient } from "mongodb";

const DB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.GROCERY_DATABASE;

let cachedDb = null;

export async function groceryDbConnect() {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(DB_URI, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
}
