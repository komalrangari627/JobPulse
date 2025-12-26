import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userSchema.js";

dotenv.config();

const AuthUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token not found" });
    }

    // Accept both: "Bearer <token>" or "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ FIXED EMAIL QUERY
    const user = await userModel.findOne({ "email.value": decoded.email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.email.verified) {
      return res.status(401).json({
        message: "Email not verified, please verify your email",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth failed:", err.message);
    return res.status(401).json({
      message: "Authentication failed, please login again",
    });
  }
};

export { AuthUser };
