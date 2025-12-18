import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { companyModel } from "../models/companySchema.js";
import { jobModel } from "../models/jobSchema.js";

dotenv.config();

/* CLOUDINARY CONFIG */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* MULTER CONFIG */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* SCRIPT 1: renameLogos() – Rename 50 logos & move to folder */

export const renameLogos = () => {
  const sourceFolder = "./logos-source/";
  const targetFolder = "./uploads/company-logos/";

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  const files = fs.readdirSync(sourceFolder);

  files.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) return;

    const companyId = index + 1;
    const newName = `company${companyId}${ext}`;

    fs.renameSync(
      path.join(sourceFolder, file),
      path.join(targetFolder, newName)
    );

    console.log(`Renamed: ${file} → ${newName}`);
  });

  console.log("✔ All logos renamed & moved");
};

/*  SCRIPT 2: uploadAllLogosToCloudinary() */

export const uploadAllLogosToCloudinary = async () => {
  const folder = "./uploads/company-logos/";
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const companyId = Number(file.replace(/[^0-9]/g, ""));
    const filePath = path.join(folder, file);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUDINARY_FOLDER || "jobpulse/company-logos",
      use_filename: true,
      unique_filename: false,
    });

    await Company.updateOne(
      { id: companyId },
      { $set: { logo: result.secure_url }}
    );

    console.log(`✔ Uploaded company ${companyId} → ${result.secure_url}`);
  }

  console.log("✔ All company logos uploaded & database updated");
};

/* SCRIPT 3: updateAllJobLogos() */

export const updateAllJobLogos = async () => {
  const companies = await Company.find({});

  for (const c of companies) {
    await Job.updateMany(
      { companyId: c.id },
      { $set: { logo: c.logo }}
    );

    console.log(`✔ Updated all jobs for company ${c.id}`);
  }

  console.log("✔ All job logos updated");
};

export default upload;
