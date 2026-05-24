import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DB_NAME } from "../constant.js";

const startInMemoryMongo = async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  console.log(`\nUsing in-memory MongoDB at ${process.env.MONGODB_URI}`);
  return mongod;
};

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      await startInMemoryMongo();
    }
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\nMongodb connected !! DB HOST :${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.warn("Local MongoDB connection failed, falling back to in-memory MongoDB:", error.message);
    await startInMemoryMongo();
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\nIn-memory MongoDB connected !! DB HOST :${connectionInstance.connection.host}`);
    return connectionInstance;
  }
};
