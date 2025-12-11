import express from "express";
import {
  createJob,
  handleJobAction,
  handleJobApplication,
  getJobData,
  getSingleJob
} from "../controllers/jobController.js";

import { AuthUser } from "../middlewares/AuthUser.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";

const jobRouter = express.Router();

/* CLEAN REST JOB ROUTES */

// Get ALL jobs  → /api/jobs
jobRouter.get("/", getJobData);

// Get ONE job  → /api/jobs/:jobId
jobRouter.get("/:jobId", getSingleJob);

// Apply to a job  → /api/jobs/:jobId/apply
jobRouter.post("/:jobId/apply", AuthUser, handleJobApplication);

// Create job  → /api/jobs
jobRouter.post("/", AuthCompany, createJob);

// Job actions (delete/close)  → /api/jobs/:action/:jobId
jobRouter.post("/:action/:jobId", AuthCompany, handleJobAction);

export default jobRouter;
