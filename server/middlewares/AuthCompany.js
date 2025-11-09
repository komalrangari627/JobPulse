import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { companyModel } from "../models/companySchema.js";

dotenv.config({ path: "./config.env" });

 const AuthCompany = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw "Authorization header missing! Please login first.";

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const company = await companyModel.findOne({
      "email.userEmail": decoded.email,
    });

    if (!company) throw "Invalid token! Company not found.";

    if (!company.email.verified)
      throw "Company email not verified! Please verify before continuing.";

    req.company = company;
    next();
  } catch (err) {
    console.error("companyAuth failed:", err);
    res.status(401).json({
      message: "Authentication failed! Please log in again.",
      error: err.message || err,
    });
  }
};

export{AuthCompany};