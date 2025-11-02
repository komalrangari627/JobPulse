import express from "express";
import {test, handleUserRegister, handleOTPVerification,} from "../controllers/userController.js";

const router = express.Router();

router.get("/test", test);
router.post("/register", handleUserRegister);
router.post("/verify-otp", handleOTPVerification);

export default router;
