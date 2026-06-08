import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";

/* ================= ROUTER ================= */
const router = express.Router();

/* ================= AUTH ROUTES ================= */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* ================= PROFILE ROUTE ================= */
router.get("/profile", getUserProfile);

/* ================= EXPORT ================= */
export default router;