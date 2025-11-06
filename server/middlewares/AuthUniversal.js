import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userSchema.js";
import { companyModel } from "../models/companySchema.js";

dotenv.config({ path: "./config.env" });

/**
 * Universal Auth Middleware — works for both users and companies.
 * - Verifies JWT token
 * - Detects whether it's a user or company based on email match
 * - Attaches `req.userType` and respective object (`req.user` or `req.company`)
 */
const AuthUniversal = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw "Authorization token missing! Please log in first.";

    // Token may be sent as: "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check user type by email
    let user = await userModel.findOne({ "email.userEmail": decoded.email });
    let company = null;

    if (!user) {
      company = await companyModel.findOne({
        "email.userEmail": decoded.email,
      });
    }

    if (user) {
      if (!user.email.verified)
        throw "User email not verified! Please verify to continue.";
      req.userType = "user";
      req.user = user;
    } else if (company) {
      if (!company.email.verified)
        throw "Company email not verified! Please verify to continue.";
      req.userType = "company";
      req.company = company;
    } else {
      throw "Invalid token — user/company not found!";
    }

    next();
  } catch (err) {
    console.error(" AuthUniversal failed:", err);
    res.status(401).json({
      message: "Authentication failed! Please log in again.",
      error: err.message || err,
    });
  }
};

export { AuthUniversal };
