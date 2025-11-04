import express from "express";
import {
    test,
    handleUserRegister,
    handleOTPVerification,
    handleUserLogin,
    handleResetPasswordRequest,
    handleOTPForPasswordReset,
    handleUserFileUplaod
} from "../controllers/userController.js";
import { AuthUser } from "../middlewares/AuthUser.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get("/test", test);
router.post("/register", handleUserRegister);
router.post("/verify-otp", handleOTPVerification);
router.post("/user-login", handleUserLogin);
router.post("/password-reset-request", handleResetPasswordRequest);
router.post("/verify-reset-password-request", handleOTPForPasswordReset);
// to upload resume/profie/docs we need to verfiy the user

router.post("/upload-file/:file_type", AuthUser, upload.single("file"), handleUserFileUplaod);

export default router;
