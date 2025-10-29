import express from "express";
import { test, handleUserRegister } from "../controllers/userController.js";

const router = express.Router();

// simple test route
router.get("/test", test);

// user registration route
router.post("/register", handleUserRegister);

export default router;
