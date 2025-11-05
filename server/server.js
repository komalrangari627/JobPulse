import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import conn from "./database/conn.js";
import userRoute from "./Routers/userRouter.js";

// Load environment variables
dotenv.config({ path: "./config.env" });

// Initialize express app
const app = express();

// ===== Middleware =====
const corsOptions = {
origin: "*",  // your React dev URL
methods: "*",
};
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// ===== Connect to MongoDB =====
conn();

// ===== Database check route =====
app.get("/api/dbcheck", (req, res) => {
  const status = mongoose.connection.readyState; // 1 = connected
  if (status === 1) {
    res.json({ message: " Database connected" });
  } else {
    res.json({ message: " Database not connected", status });
  }
});

// ===== Default root route =====
app.get("/", (req, res) => {
  res.json({ message: "Welcome to JobPulse API" });
});

// ===== User routes =====
app.use("/api/users", userRoute);

// ===== 404 handler (Express 5-safe) =====
app.use((req, res) => {
  res.status(404).json({ message: "content/route not found !" });
});

// ===== Start server =====
const port = process.env.PORT || 5012;
app.listen(port, () => console.log(` Server running on port ${port}`));
