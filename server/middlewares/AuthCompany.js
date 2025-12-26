import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { companyModel } from "../models/companySchema.js";

dotenv.config({ path: "./config.env" });

const AuthCompany = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header missing. Please login first." });
    }

    // Accept both "Bearer <token>" and "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ FIXED EMAIL QUERY
    const company = await companyModel.findOne({
      "email.value": decoded.email,
    });

    if (!company) {
      return res
        .status(401)
        .json({ message: "Invalid token. Company not found." });
    }

    if (!company.email.verified) {
      return res.status(401).json({
        message:
          "Company email not verified. Please verify before continuing.",
      });
    }

    req.company = company;
    next();
  } catch (err) {
    console.error("Company auth failed:", err.message || err);

    return res.status(401).json({
      message: "Authentication failed. Please log in again.",
    });
  }
};

export { AuthCompany };
