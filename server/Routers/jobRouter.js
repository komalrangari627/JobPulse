import express from "express";
import {
  createJob,
  handleJobAction,
  handleJobApplication,
  getAllJobs,
  getJobById,
  getJobDetailWithCompany
} from "../controllers/jobController.js";

import { AuthUser } from "../middlewares/AuthUser.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";

const jobRouter = express.Router();

/* ================= JOB DETAIL FOR FRONTEND ================= */
jobRouter.get("/job-detail/:jobId", getJobDetailWithCompany);

/* ================= JOB ROUTES ================= */

// Get ALL jobs → /api/jobs
jobRouter.get("/", getAllJobs);

// Get ONE job → /api/jobs/:jobId
jobRouter.get("/:jobId", getJobById);

// Apply to a job → /api/jobs/:jobId/apply
jobRouter.post("/:jobId/apply", AuthUser, handleJobApplication);

// Job actions (delete/close) → /api/jobs/:action/:jobId
jobRouter.post("/:action/:jobId", AuthCompany, handleJobAction);

// Create job → /api/jobs
jobRouter.post("/", AuthCompany, createJob);

jobRouter.get("/company/:companyId", async (req, res) => {
  const jobs = await Job.find({ companyId: req.params.companyId });
  res.json(jobs);
});

export default jobRouter;
