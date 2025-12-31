import express from "express";
import { getInterviewByJobId } from "../controllers/interviewController.js";

const interviewRoute = express.Router();


interviewRoute.get("/:jobId", getInterviewByJobId);

export default interviewRoute;
