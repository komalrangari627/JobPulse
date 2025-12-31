import express from "express";
import { sendOfflineInternshipEmail } from "../controllers/applyController.js";

const applyRoute = express.Router();

applyRoute.post("/offline-email", sendOfflineInternshipEmail);

export default applyRoute;
