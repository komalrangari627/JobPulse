import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import conn from "./database/conn.js";

// Routers
import userRoute from "./Routers/userRouter.js";
import companyRoute from "./Routers/companyRouter.js";
import jobRoute from "./Routers/jobRouter.js";

// Models
import { companyModel } from "./models/companySchema.js";
import { jobModel } from "./models/jobSchema.js";

// Load env
dotenv.config({ path: "./config.env" });

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= DB CONNECT ================= */
conn();

/* ================= HEALTH CHECK ================= */
app.get("/api/dbcheck", (req, res) => {
  const status = mongoose.connection.readyState;
  res.json({
    message: status === 1 ? "Database connected successfully!" : "Database not connected!",
    status
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

/* ======================================================
   DIRECT MONGODB APIs (ISOLATED PATHS - SAFE)
====================================================== */

/* ===== COMPANY CRUD (Mongo Only) ===== */

// CREATE
app.post("/api/mongo/companies", async (req, res) => {
  try {
    const company = await companyModel.create(req.body);
    res.status(201).json({ message: "Company created!", company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ALL
app.get("/api/mongo/companies", async (req, res) => {
  try {
    const companies = await companyModel.find().populate("createdJobs");
    res.json({ total: companies.length, companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ONE
app.get("/api/mongo/companies/:id", async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id).populate({
      path: "createdJobs",
      select: "title jobRequirements.location jobRequirements.offeredSalary"
    });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
app.put("/api/mongo/companies/:id", async (req, res) => {
  try {
    const updated = await companyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Company not found" });
    res.json({ company: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
app.delete("/api/mongo/companies/:id", async (req, res) => {
  try {
    const deleted = await companyModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted", company: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== JOB CRUD (Mongo Only) ===== */

app.post("/api/mongo/jobs", async (req, res) => {
  try {
    const { title, jobRequirements, companyId } = req.body;

    const company = await companyModel.findById(companyId);
    if (!company) throw new Error("Invalid company ID");

    const job = await jobModel.create({
      title,
      jobCreatedBy: company._id,
      jobRequirements
    });

    company.createdJobs.push(job._id);
    await company.save();

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/mongo/jobs", async (req, res) => {
  try {
    const jobs = await jobModel.find().populate(
      "jobCreatedBy",
      "companyDetails.name companyDetails.industry companyDetails.about logo"
    );
    res.json({ total: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/mongo/jobs/:id", async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id).populate(
      "jobCreatedBy",
      "companyDetails.name companyDetails.industry companyDetails.about logo"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/mongo/jobs/:id", async (req, res) => {
  try {
    const job = await jobModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/mongo/jobs/:id", async (req, res) => {
  try {
    const job = await jobModel.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await companyModel.updateOne(
      { createdJobs: job._id },
      { $pull: { createdJobs: job._id } }
    );

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== JOB DETAIL FOR FRONTEND (DisplayJob / JobPage) ===== */
app.get("/api/jobs/job-detail/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await jobModel.findById(jobId).populate(
      "jobCreatedBy",
      "companyDetails.name companyDetails.industry companyDetails.about logo"
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({
      job,
      company: job.jobCreatedBy
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching job detail", error: err.message });
  }
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= START ================= */
const port = process.env.PORT || 5012;
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
