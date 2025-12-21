import express from "express";
import { 
    test, 
    handleUserRegister, 
    handleOTPVerification, 
    handleUserLogin, 
    handleResetPasswordRequest, 
    handleOTPForPasswordReset, 
    handleUserFileUpload, 
    fetchProfile 
} from "../controllers/userController.js";
import { AuthUser } from "../middlewares/AuthUser.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Test route
router.get("/test", test);

// User registration & OTP verification
router.post("/register", handleUserRegister);
router.post("/verify-otp", handleOTPVerification);

// User login
router.post("/user-login", handleUserLogin);

// Password reset flow
router.post("/password-reset-request", handleResetPasswordRequest);
router.post("/verify-reset-password-request", handleOTPForPasswordReset);

// File uploads (protected)
router.post(
  "/upload-file/:file_type",
  AuthUser,
  upload.single("file"),
  handleUserFileUpload
);

// Fetch authenticated user profile
router.get("/fetch-user-profile", AuthUser, fetchProfile);

export default router;
