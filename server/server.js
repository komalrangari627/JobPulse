import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import conn from "./database/conn.js";

// Routers
import userRoute from "./Routers/userRouter.js";
import companyRoute from "./Routers/companyRouter.js";
import jobRoute from "./Routers/jobRouter.js";
import applyRoute from "./Routers/applyRouter.js";
import interviewRoute from "./Routers/interviewRoutes.js";

// Models
import { companyModel } from "./models/companySchema.js";
import { jobModel } from "./models/jobSchema.js";

import aiRoute from "./Routers/aiRouter.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

// ✅ FIXED CORS (IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= DB CONNECT ================= */
conn();

/* ================= HEALTH CHECK ================= */
app.get("/api/dbcheck", (req, res) => {
  const status = mongoose.connection.readyState;
  res.json({
    message:
      status === 1
        ? "Database connected successfully!"
        : "Database not connected!",
    status,
  });
});

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to JobPulse API" });
});

/* ================= CORE ROUTERS ================= */
app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/companies", companyRoute);
app.use("/api/apply", applyRoute);
app.use("/api/interview", interviewRoute);
app.use("/api", aiRoute);

/* ================= REDIRECT FOR BACKWARD COMPATIBILITY ================= */
app.get("/api/users/mongo/companies/:id", (req, res) => {
  const { id } = req.params;
  res.redirect(307, `/api/mongo/companies/${id}`);
});

/* ================= COMPANY ROUTES ================= */
app.get("/api/users/companies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Company ID" });

    const company = await companyModel.findById(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.json({ company });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching company detail",
      error: err.message,
    });
  }
});

/* ===== COMPANY CRUD (Mongo Only) ===== */
app.post("/api/mongo/companies", async (req, res) => {
  try {
    const company = await companyModel.create(req.body);
    res.status(201).json({ message: "Company created!", company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/mongo/companies", async (req, res) => {
  try {
    const companies = await companyModel.find().populate("createdJobs");
    res.json({ total: companies.length, companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/mongo/companies/:id", async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id).populate({
      path: "createdJobs",
      select: "title jobRequirements.location jobRequirements.offeredSalary",
    });
    if (!company)
      return res.status(404).json({ message: "Company not found" });
    res.json({ company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== JOB ROUTES (UNCHANGED) ===== */
// (your job CRUD + job-detail routes remain exactly the same)

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= START SERVER ================= */
const port = process.env.PORT || 5012;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
