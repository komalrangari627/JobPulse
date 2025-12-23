import nodemailer from "nodemailer"; 
import dotenv from "dotenv";
import { redisClient } from "../utils/redisClient.js";
import { userModel } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config({ path: "./config.env" });

/* =========================
   EMAIL TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) console.error("SMTP error:", error.message);
  else console.log("Gmail SMTP ready");
});

/* =========================
   OTP HELPERS
========================= */
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const sendOTP = async (email) => {
  const otp = generateOTP();
  try {
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Email Verification | OTP valid for 5 mins",
      text: `Your OTP is ${otp}`,
    });

    await redisClient.setEx(`email:${email}`, 300, otp);
    return true;
  } catch (err) {
    console.error("OTP send failed:", err.message);
    return false;
  }
};

const sendOTPForPasswordReset = async (email) => {
  const otp = generateOTP();
  try {
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    });

    await redisClient.setEx(`emailPasswordReset:${email}`, 300, otp);
  } catch (err) {
    console.error("Password reset OTP error:", err.message);
  }
};

/* =========================
   TEST ROUTE
========================= */
const test = (req, res) => {
  res.status(200).json({ message: "User route working" });
};

/* =========================
   REGISTER USER
========================= */
const handleUserRegister = async (req, res) => {
  try {
    const {
      name, phone, email, street, city, state,
      country, pincode, dob, password
    } = req.body;

    if (!name || !phone || !email || !street || !city ||
        !state || !country || !pincode || !dob || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or phone",
      });
    }

    // ✅ Hash password properly
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      phone,
      email: { userEmail: email, verified: false },
      address: { street, city, state, country, pincode },
      dob,
      password: hashedPassword,  // store hashed password
    });

    await newUser.save();  // Save properly

    // 🔑 Send OTP (non-blocking)
    sendOTP(email);

    res.status(201).json({
      message: "Registration successful. OTP sent to email.",
      email,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/* =========================
   VERIFY EMAIL OTP
========================= */
const handleOTPVerification = async (req, res) => {
  try {
    const { email, userOtp } = req.body;
    const storedOtp = await redisClient.get(`email:${email}`);

    if (!storedOtp || storedOtp !== userOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await userModel.updateOne({ "email.userEmail": email }, { $set: { "email.verified": true } });
    await redisClient.del(`email:${email}`);

    res.status(200).json({ message: "Email verified successfully. Please login." });
  } catch (err) {
    console.error("OTP verify error:", err.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* =========================
   LOGIN USER
========================= */
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.email.verified)
      return res.status(400).json({ message: "Email not verified. Please verify OTP." });

    // ✅ Compare password properly with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email.userEmail },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};
/* =========================
   PASSWORD RESET REQUEST
========================= */
const handleResetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ "email.userEmail": email });

  if (user) sendOTPForPasswordReset(email);

  res.status(200).json({
    message: "If the email exists, a password reset OTP has been sent.",
  });
};

/* =========================
   VERIFY RESET OTP & RESET PASSWORD
========================= */
const handleOTPForPasswordReset = async (req, res) => {
  try {
    const { email, userOtp, newPassword } = req.body;
    const storedOtp = await redisClient.get(`emailPasswordReset:${email}`);

    if (!storedOtp || storedOtp !== userOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateOne({ "email.userEmail": email }, { $set: { password: hashedPassword } });
    await redisClient.del(`emailPasswordReset:${email}`);

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err.message);
    res.status(500).json({ message: "Password reset failed" });
  }
};

/* =========================
   FILE UPLOAD
========================= */
const handleUserFileUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File missing" });

    const fileType = req.params.file_type;
    let update = {};

    if (fileType === "profile_picture") update = { profile_picture: req.file.filename };
    else if (fileType === "resume") update = { resume: req.file.filename };

    await userModel.updateOne({ "email.userEmail": req.user.email.userEmail }, update);

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};

/* =========================
   FETCH USER PROFILE
========================= */
const fetchProfile = async (req, res) => {
  try {
    const userData = await userModel.findOne({ "email.userEmail": req.user.email.userEmail });
    res.status(200).json({ message: "User profile data fetched!", userData });
  } catch (err) {
    res.status(500).json({ message: "Fetching profile failed" });
  }
};

/* =========================
   EXPORTS
========================= */
export {
  test,
  handleUserRegister,
  handleOTPVerification,
  handleUserLogin,
  handleResetPasswordRequest,
  handleOTPForPasswordReset,
  handleUserFileUpload,
  fetchProfile,
};
