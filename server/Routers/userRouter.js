import express from "express";
import {
    test,
    handleUserRegister,
    handleOTPVerification,
    handleUserLogin,
    handleResetPasswordRequest,
 handleOTPForPasswordReset
} from "../controllers/userController.js";

const router = express.Router();

router.get("/test", test);
router.post("/register", handleUserRegister);
router.post("/verify-otp", handleOTPVerification);
router.post("/user-login", handleUserLogin)
router.post("/password-reset-request", handleResetPasswordRequest)
router.post("/verify-reset-password-request", handleOTPForPasswordReset)
export default router;
