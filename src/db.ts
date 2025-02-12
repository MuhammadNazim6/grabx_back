import mongoose from 'mongoose'
import * as dotenv from 'dotenv';

dotenv.config();
export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {});
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database: " + error);
  }
}; 
  
