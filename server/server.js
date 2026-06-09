import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import conn from "./database/conn.js";

import userRoute from "./Routers/userRouter.js";
import companyRoute from "./Routers/companyRouter.js";
import jobRoute from "./Routers/jobRouter.js";
import applyRoute from "./Routers/applyRouter.js";
import interviewRoute from "./Routers/interviewRoutes.js";
import aiRoute from "./Routers/aiRouter.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://job-pulse-tau.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* DB CONNECT ONLY ONCE */
conn();

/* ROUTES */
app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/companies", companyRoute);
app.use("/api/apply", applyRoute);
app.use("/api/interview", interviewRoute);
app.use("/api", aiRoute);

app.get("/", (req, res) => {
  res.json({ message: "JobPulse API Running 🚀" });
});

const PORT = process.env.PORT || 5012;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});