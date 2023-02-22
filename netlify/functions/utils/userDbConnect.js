import { MongoClient } from "mongodb";

const DB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.USER_DATABASE;

let cachedUserDb = null;

export async function userDbConnect() {
  if (cachedUserDb) return cachedUserDb;
  const client = await MongoClient.connect(DB_URI, {
    useUnifiedTopology: true,
  });

  cachedUserDb = client.db(DB_NAME);

  return cachedUserDb;
}
