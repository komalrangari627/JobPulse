import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * Universal Multer config — works for users & companies.
 * Creates folders like uploads/users/resume or uploads/companies/logo dynamically.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = req.params.file_type || "default";
    const baseFolder = req.baseUrl.includes("company")
      ? "uploads/companies"
      : "uploads/users";

    const uploadPath = path.join(baseFolder, fileType);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

export const upload = multer({ storage });
