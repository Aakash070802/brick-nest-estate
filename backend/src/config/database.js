import { config } from "./config.js";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.MONGO}${DB_NAME}`,
    );
    console.log(`✅ DB Connected\nHOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`❌ Connection Failed: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
