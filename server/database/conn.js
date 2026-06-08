import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const conn = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("MONGO_URI =", uri); // 👈 DEBUG (IMPORTANT)

    if (!uri || !uri.startsWith("mongodb")) {
      throw new Error("Invalid MongoDB URI in env file");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

export default conn;