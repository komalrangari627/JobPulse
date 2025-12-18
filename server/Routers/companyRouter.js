import jwt from "jsonwebtoken";
import express from "express";
import { companyModel } from "../models/companySchema.js";
import upload from "../config/multerConfig.js";

import {
  test,
  registerCompany,
  verifyCompanyOtp,
  loginCompany,
  updateCompany,
  deleteCompany,
  handleCompanyFileUpload,
  handleCompanyPasswordResetRequest,
  handleCompanyOTPForPasswordReset,
  addCompanyLogo
} from "../controllers/companyController.js";

import { AuthUser } from "../middlewares/AuthUser.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";
import { companies } from "../database/companiesData.js"; // Cloudinary logos already in data

const router = express.Router();

// Test route
router.get("/test", test);

// Company authentication
router.post("/register", upload.single("companyLogo"), registerCompany);
router.post("/verify-otp", verifyCompanyOtp);
router.post("/company-login", loginCompany);
router.put("/update/:id", upload.single("companyLogo"), updateCompany);
router.delete("/delete/:id", deleteCompany);

// Password reset routes
router.post("/password-reset-request", handleCompanyPasswordResetRequest);
router.post("/verify-reset-password-request", handleCompanyOTPForPasswordReset);

// File upload route
router.post("/upload-file/:file_type", AuthCompany, upload.single("file"), handleCompanyFileUpload);

// Upload logo to Cloudinary
router.post("/upload-logo/:companyId", AuthCompany, upload.single("file"), addCompanyLogo);

// Login by company ID
router.post("/login-by-id/:id", async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const token = jwt.sign(
      { id: company._id, role: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ success: true, token, company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Get all companies
router.get("/api/companies", (req, res) => {
  try {
    res.status(200).json({
      message: "Companies fetched successfully!",
      companies
    });
  } catch (error) {
    res.status(500).json({ message: "Fetching companies failed!", error: error.message });
  }
});

// API: Get single company by ID
router.get("/api/companies/:id", (req, res) => {
  try {
    const company = companies.find(c => c.id == req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: "Fetching company failed!", error: error.message });
  }
});

export default router;
