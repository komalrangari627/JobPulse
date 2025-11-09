import express from "express";
import {
  createJob,
  handleJobAction,
  handleJobApplication,
  getJobData,
} from "../controllers/jobController.js";
import { AuthUser } from "../middlewares/AuthUser.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";

const jobRouter = express.Router();

/* JOB ROUTES */

// Create a new job (Company only)
jobRouter.post("/add-job", AuthCompany, createJob);

// Perform job actions (delete / close)
jobRouter.post("/job-action/:action/:jobId", AuthCompany, handleJobAction);

// Apply for a job (User only)
jobRouter.post("/apply-for-job/:jobId", AuthUser, handleJobApplication);

// Get all jobs (public)
jobRouter.get("/jobsdata", getJobData);

export default jobRouter;
