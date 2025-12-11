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

// Load environment variables
dotenv.config({ path: "./config.env" });

// Initialize express app
const app = express();

// ===== Middleware =====
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== Connect to MongoDB =====
conn();

// ===== DB check route =====
app.get("/api/dbcheck", (req, res) => {
  const status = mongoose.connection.readyState;
  res.json({
    message: status === 1 ? " Database connected successfully!" : " Database not connected!",
    status,
  });
});

// ===== Default root route =====
app.get("/", (req, res) => {
  res.json({ message: "Welcome to JobPulse API " });
});

// ===== Core Routers =====
app.use("/api/users", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/jobs", jobRoute);

/* COMPANY CRUD (Direct MongoDB Operations) */

//  CREATE COMPANY
app.post("/api/companies", async (req, res) => {
  try {
    const newCompany = await companyModel.create(req.body);
    res.status(201).json({
      message: " Company created successfully in MongoDB!",
      company: newCompany,
    });
  } catch (err) {
    res.status(500).json({
      message: " Unable to create company!",
      error: err.message,
    });
  }
});

//  READ ALL COMPANIES
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await companyModel.find().populate("createdJobs");
    res.status(200).json({
      message: " Companies fetched directly from MongoDB!",
      total: companies.length,
      companies,
    });
  } catch (err) {
    res.status(500).json({
      message: " Fetching companies failed!",
      error: err.message,
    });
  }
});
// server: GET /api/companies/:id
app.get("/api/companies/:id", async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id).populate({
      path: "createdJobs",
      select: "title jobRequirements.location jobRequirements.offeredSalary"
    });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ company });
  } catch (err) {
    res.status(500).json({ message: "Error fetching company", error: err.message });
  }
});

//  UPDATE COMPANY
app.put("/api/companies/:id", async (req, res) => {
  try {
    const updated = await companyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ message: " Company not found!" });
    res.json({ message: " Company updated successfully!", company: updated });
  } catch (err) {
    res.status(500).json({
      message: " Unable to update company!",
      error: err.message,
    });
  }
});

//  DELETE COMPANY
app.delete("/api/companies/:id", async (req, res) => {
  try {
    const deleted = await companyModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: " Company not found!" });
    res.json({ message: " Company deleted successfully!", company: deleted });
  } catch (err) {
    res.status(500).json({
      message: " Unable to delete company!",
      error: err.message,
    });
  }
});

/*  JOB CRUD (Direct MongoDB Operations + Link with Company) */

//  CREATE JOB
app.post("/api/jobsdata", async (req, res) => {
  try {
    const { title, jobRequirements, companyId } = req.body;
    if (!companyId) throw new Error("Company ID is required to create a job!");

    const company = await companyModel.findById(companyId);
    if (!company) throw new Error("Invalid company ID!");

    // Create job and link it
    const newJob = await jobModel.create({
      title,
      jobCreatedBy: company._id,
      jobRequirements,
    });

    // Push job reference to company
    company.createdJobs.push(newJob._id);
    await company.save();

    res.status(201).json({
      message: ` Job '${title}' created and linked with ${company.companyDetails.name}!`,
      job: newJob,
    });
  } catch (err) {
    res.status(500).json({
      message: " Unable to create job!",
      error: err.message,
    });
  }
});

//  READ ALL JOBS
app.get("/api/jobsdata", async (req, res) => {
  try {
    const jobs = await jobModel.find().populate("jobCreatedBy", "companyDetails.name companyDetails.industry");
    res.status(200).json({
      message: " Jobs fetched directly from MongoDB!",
      total: jobs.length,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      message: " Fetching jobs failed!",
      error: err.message,
    });
  }
});

//  UPDATE JOB
app.put("/api/jobsdata/:id", async (req, res) => {
  try {
    const updatedJob = await jobModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob)
      return res.status(404).json({ message: " Job not found!" });
    res.json({ message: " Job updated successfully!", job: updatedJob });
  } catch (err) {
    res.status(500).json({
      message: " Unable to update job!",
      error: err.message,
    });
  }
});

//  DELETE JOB
app.delete("/api/jobsdata/:id", async (req, res) => {
  try {
    const deletedJob = await jobModel.findByIdAndDelete(req.params.id);
    if (!deletedJob)
      return res.status(404).json({ message: " Job not found!" });

    // Remove job from company reference
    await companyModel.updateOne(
      { createdJobs: deletedJob._id },
      { $pull: { createdJobs: deletedJob._id } }
    );

    res.json({
      message: ` Job '${deletedJob.title}' deleted successfully from MongoDB!`,
    });
  } catch (err) {
    res.status(500).json({
      message: " Unable to delete job!",
      error: err.message,
    });
  }
});

/*  404 HANDLER */
app.use((req, res) => {
  res.status(404).json({ message: " content/route not found!" });
});

// ===== Start server =====
const port = process.env.PORT || 5012;
app.listen(port, () => console.log(` Server running on port ${port}`));
