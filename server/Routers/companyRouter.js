import express from "express";
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
  addCompanyLogo,
  getCompanyById,
  getAllCompanies,
  getCompanyDetail
} from "../controllers/companyController.js";

import { AuthCompany } from "../middlewares/AuthCompany.js";
import upload from "../config/multerConfig.js";
import mongoose from "mongoose";
import { companyModel } from "../models/companySchema.js";

const companiesRouter = express.Router();

/* ================= TEST ================= */
companiesRouter.get("/test", test);

/* ================= PUBLIC ROUTES ================= */

/**
 * ✅ Company + Job detail (PUBLIC)
 * MUST be above "/:id"
 */
// companyRouter.js
companiesRouter.get("/company-detail/:companyId", getCompanyDetail);

/**
 * ✅ Public Mongo fetch (USED BY FRONTEND)
 */
companiesRouter.get("/mongo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Company ID" });
    }

    const company = await companyModel.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching company detail",
      error: err.message,
    });
  }
});

/**
 * ✅ Get all companies (PUBLIC)
 */
companiesRouter.get("/", getAllCompanies);

/**
 * ✅ Get company by ID (PUBLIC)
 * MUST be LAST public route
 */
companiesRouter.get("/:id", getCompanyById);

/* ================= AUTH ROUTES ================= */

companiesRouter.post(
  "/register",
  upload.single("companyLogo"),
  registerCompany
);

companiesRouter.post("/verify-otp", verifyCompanyOtp);
companiesRouter.post("/company-login", loginCompany);

/* ================= PROTECTED ROUTES ================= */

companiesRouter.put(
  "/update/:id",
  AuthCompany,
  upload.single("companyLogo"),
  updateCompany
);

companiesRouter.delete(
  "/delete/:id",
  AuthCompany,
  deleteCompany
);

/* ================= PASSWORD RESET ================= */

companiesRouter.post(
  "/password-reset-request",
  handleCompanyPasswordResetRequest
);

companiesRouter.post(
  "/verify-reset-password-request",
  handleCompanyOTPForPasswordReset
);

/* ================= FILE UPLOAD ================= */

companiesRouter.post(
  "/upload-file/:file_type",
  AuthCompany,
  upload.single("file"),
  handleCompanyFileUpload
);

companiesRouter.post(
  "/upload-logo/:companyId",
  AuthCompany,
  upload.single("file"),
  addCompanyLogo
);

export default companiesRouter;
