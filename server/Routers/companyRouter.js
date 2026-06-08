import express from "express";
import {
  getAllCompanies,
  getCompanyById,
} from "../controllers/companyController.js";

const router = express.Router();

/* ================= COMPANY ROUTES ================= */

/* GET ALL COMPANIES */
router.get("/", getAllCompanies);

/* GET COMPANY BY ID */
router.get("/:id", getCompanyById);

export default router;