import express from "express";
import { jobs } from "../database/jobsdata.js"; // Cloudinary logos already in data
import {
  createJob,
  handleJobAction,
  handleJobApplication,
  getAllJobs,
  getJobById
} from "../controllers/jobController.js";

import { AuthUser } from "../middlewares/AuthUser.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";

const jobRouter = express.Router();

/* REST JOB ROUTES */

// Get ALL jobs → /api/jobs
jobRouter.get("/", getAllJobs);

// Get ONE job → /api/jobs/:jobId
jobRouter.get("/:jobId", getJobById);

// Apply to a job → /api/jobs/:jobId/apply
jobRouter.post("/:jobId/apply", AuthUser, handleJobApplication);

// Create job → /api/jobs
jobRouter.post("/", AuthCompany, createJob);

// Job actions (delete/close) → /api/jobs/:action/:jobId
jobRouter.post("/:action/:jobId", AuthCompany, handleJobAction);

export default jobRouter;
