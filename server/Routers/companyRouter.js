import express from "express";
import {
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
import { AuthUniversal } from "../middlewares/AuthUniversal.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.post("/register", upload.single("companyLogo"), registerCompany);
router.post("/verify-otp", verifyCompanyOtp);
router.post("/company-login", loginCompany);
router.put("/update/:id", upload.single("companyLogo"), updateCompany);
router.delete("/delete/:id", deleteCompany);

//  Password Reset Routes
router.post("/password-reset-request", handleCompanyPasswordResetRequest);
router.post("/verify-reset-password-request", handleCompanyOTPForPasswordReset);

// Works for both users & companies
router.post(
  "/upload-file/:file_type",
  AuthUniversal,
  upload.single("file"),
  handleCompanyFileUpload
);

export default router;
