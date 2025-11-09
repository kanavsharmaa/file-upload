import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

export let gfs: GridFSBucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    const db = conn.connection.db;
    
    if (!db) throw new Error("Database connection not found.");

    gfs = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });
    
    console.log("MongoDB Connection & GridFS Initialized.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error("❌ Unknown error occurred while connecting to MongoDB");
    }
    process.exit(1);
  }
};

export { connectDB, MONGO_URI };
