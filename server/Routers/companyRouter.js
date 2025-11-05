import express from "express";
import { handleUserFileUpload } from "../controllers/userController.js";
import { upload } from "../multerConfig.js";
import { AuthUser } from "../middleware/AuthUser.js";

const router = express.Router();



router.post(
  "/upload-file/:file_type",
  AuthUser,                //  Keep JWT validation
  upload.single("file"),
  handleUserFileUpload
);

export default router;
