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

/* REST JOB ROUTES */

// ✅ SPECIAL ROUTES FIRST
jobRouter.get("/job-detail/:jobId", getJobDetailWithCompany);

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

export default jobRouter;
