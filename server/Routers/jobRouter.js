import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
} from "../controllers/jobController.js";

const router = express.Router();

/* ================= JOB ROUTES ================= */

/* Create a new job */
router.post("/create", createJob);

/* Get all jobs */
router.get("/", getAllJobs);

/* Get single job by ID */
router.get("/:id", getJobById);

/* ================= EXPORT ================= */
export default router;