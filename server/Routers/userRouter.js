// ================= USERROUTER.JS =================

import express from "express";

import {
  test,
  handleUserRegister,
  loginUser,
  handleOTPVerification,
  handleResetPasswordRequest,
  handleOTPForPasswordReset,
  handleUserFileUpload,
  fetchProfile,
} from "../controllers/userController.js";

import { AuthUser } from "../middlewares/AuthUser.js";

import upload from "../config/multerConfig.js";

const router = express.Router();

/* =========================================
   TEST ROUTE
========================================= */

router.get("/test", test);

/* =========================================
   USER REGISTER
   New Register Form:
   - fullname
   - email
   - password
========================================= */

router.post(
  "/register",
  handleUserRegister
);

/* =========================================
   OTP VERIFICATION
========================================= */

router.post(
  "/verify-otp",
  handleOTPVerification
);

/* =========================================
   USER LOGIN
   New Login Form:
   - only email
========================================= */

router.post(
  "/login",
  loginUser
);

/* =========================================
   PASSWORD RESET
========================================= */

router.post(
  "/password-reset-request",
  handleResetPasswordRequest
);

router.post(
  "/verify-reset-password",
  handleOTPForPasswordReset
);

/* =========================================
   FILE UPLOAD
========================================= */

router.post(
  "/upload-file/:file_type",

  AuthUser,

  upload.single("file"),

  handleUserFileUpload
);

/* =========================================
   FETCH PROFILE
========================================= */

router.get(
  "/profile",

  AuthUser,

  fetchProfile
);

export default router;