import { MongoClient, ServerApiVersion, ObjectId, Db } from 'mongodb';

import * as dotenv from 'dotenv';
import { USERS_TABLE } from '../constants';
import { UserData } from '../types';

dotenv.config();

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
// db entitity
let db: Db;

/**
 * Open db connection
 */
export const connectDB = async (): Promise<Db> => {
  if (!client) {

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    })

    try {
      await client.connect();
      db = client.db(process.env.DB_NAME);
    } catch (error) {
      console.error('DB init error', error);
    }
  }

  return db;
};

/**
 * Close db connection
 */
export const disconnectDB = async () => {
  if (client) {
    await client.close();
    client = undefined!; // Make the client undefined after closing the connection
  }
};

/**
 * Add new user id, store it in db and return
 */
export const addUser = async (): Promise<string> => {
  try {
    const result = await db.collection(USERS_TABLE).insertOne({});
    return result.insertedId.toHexString();
  } catch (error) {
    console.error('Error on try to add user, ', error);
    return '';
  }
};

/**
 * Set additional user data in db
 */
export const updateUserData = async (id: string, userData: Partial<UserData>): Promise<boolean> => {
  try {
    const result = await db.collection(USERS_TABLE).updateOne({ _id: new ObjectId(id) }, { $set: {...userData} });
    return result.acknowledged;
  } catch (error) {
    console.error('Error on try to update user, ', error);
    return false;
  }
};

/**
 * Return user data by id
 */
export const getUser = async (id: string): Promise<UserData | null> => {
  try {
    const user = await db.collection(USERS_TABLE).findOne({ _id: new ObjectId(id) }) as UserData | null;
    return user;
  } catch (error) {
    console.error('Error on try to get user, ', error);
    return null;
  }
};