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

import { AuthCompany } from "../middlewares/AuthCompany.js";
import { companies } from "../database/companiesData.js"; // static data

const router = express.Router();

/* ================= TEST ================= */
router.get("/test", test);

/* ================= PUBLIC COMPANY APIs ================= */

// ✅ Get all companies (PUBLIC)
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      message: "Companies fetched successfully!",
      companies
    });
  } catch (error) {
    res.status(500).json({
      message: "Fetching companies failed!",
      error: error.message
    });
  }
});

// ✅ Get single company by ID (PUBLIC)
router.get("/:id", (req, res) => {
  try {
    const company = companies.find(c => c.id == req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({
      message: "Fetching company failed!",
      error: error.message
    });
  }
});

/* ================= AUTH & ACCOUNT ================= */

router.post("/register", upload.single("companyLogo"), registerCompany);
router.post("/verify-otp", verifyCompanyOtp);
router.post("/company-login", loginCompany);

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

/* ================= UPDATE / DELETE ================= */

router.put("/update/:id", AuthCompany, upload.single("companyLogo"), updateCompany);
router.delete("/delete/:id", AuthCompany, deleteCompany);

/* ================= PASSWORD RESET ================= */

router.post("/password-reset-request", handleCompanyPasswordResetRequest);
router.post("/verify-reset-password-request", handleCompanyOTPForPasswordReset);

/* ================= FILE UPLOAD ================= */

router.post(
  "/upload-file/:file_type",
  AuthCompany,
  upload.single("file"),
  handleCompanyFileUpload
);

// Upload logo to Cloudinary
router.post(
  "/upload-logo/:companyId",
  AuthCompany,
  upload.single("file"),
  addCompanyLogo
);

export default router;
