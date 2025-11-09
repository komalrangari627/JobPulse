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
} from "../controllers/companyController.js";

import { AuthUser } from "../middlewares/AuthUser.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get("/test", test);
router.post("/register", upload.single("companyLogo"), registerCompany);
router.post("/verify-otp", verifyCompanyOtp);
router.post("/company-login", loginCompany);
router.put("/update/:id", upload.single("companyLogo"), updateCompany);
router.delete("/delete/:id", deleteCompany);

//  Password Reset Routes
router.post("/password-reset-request", handleCompanyPasswordResetRequest);
router.post("/verify-reset-password-request", handleCompanyOTPForPasswordReset);

// GET ALL COMPANIES DATA
router.get("/api/companies", (req, res) => {
  try {
    res.status(200).json({
      message: " Companies fetched successfully!",
      data: companies
    });
  } catch (error) {
    res.status(500).json({
      message: " Fetching companies failed!",
      error: error.message
    });
  }
});

// Works for both users & companies
router.post( "/upload-file/:file_type", AuthCompany, upload.single("file"), handleCompanyFileUpload);

export default router;
