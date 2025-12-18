import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { redisClient } from "../utils/redisClient.js";
import { userModel } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config({ path: "./config.env" });

/* GMAIL TRANSPORTER SETUP */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) console.error("SMTP connection failed:", error.message);
  else console.log("Gmail SMTP connection successful — ready to send OTP emails!");
});

/* OTP GENERATION HELPER */
function generateRandomNumber() {
  return Math.floor(Math.random() * 9000 + 1000).toString();
}

/* SEND OTP (EMAIL VERIFICATION) */
async function sendOTP(email) {
  try {
    const otp = generateRandomNumber();
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Email Verification | OTP valid for 5 mins!",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    await redisClient.setEx(`email:${email}`, 300, otp);
    console.log(`OTP ${otp} sent to ${email}`);
    return { message: "OTP sent successfully!", status: true, otp };
  } catch (err) {
    console.error("Error sending OTP:", err.message || err);
    return { message: "Unable to send OTP!", status: false };
  }
}

/* SEND OTP (PASSWORD RESET) */
async function sendOTPForPasswordReset(email) {
  try {
    const otp = generateRandomNumber();
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset Request | OTP valid for 5 mins!",
      text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
    });

    await redisClient.setEx(`emailPasswordReset:${email}`, 300, otp);
    console.log(`Password reset OTP ${otp} sent to ${email}`);
    return { message: "OTP sent successfully!", status: true };
  } catch (err) {
    console.error("Error sending password reset OTP:", err.message || err);
    return { message: "Unable to send password reset OTP!", status: false };
  }
}

/* VERIFY OTP (COMMON) */
async function verifyOtp(email, otpKey, userOtp) {
  try {
    const storedOtp = await redisClient.get(`${otpKey}:${email}`);
    if (!storedOtp) throw new Error("OTP expired or not found!");
    if (storedOtp.trim() !== userOtp.trim()) throw new Error("Invalid OTP!");

    await redisClient.del(`${otpKey}:${email}`);
    console.log(`OTP verified for ${email}`);
    return true;
  } catch (err) {
    console.error("OTP verification failed:", err.message || err);
    throw err;
  }
}

/* TEST ROUTE */
const test = (req, res) => {
  res.status(200).json({ message: "Welcome to user test route!" });
};

/* REGISTER USER */
const handleUserRegister = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      street,
      city,
      state,
      country,
      pincode,
      dob,
      password,
    } = req.body;

    if (!name || !phone || !email || !street || !city || !state || !country || !pincode || !dob || !password) {
      throw new Error("Invalid or missing data!");
    }

    const existingUser = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    });
    if (existingUser) throw new Error("User already exists, please change email/phone!");

    const otpResult = await sendOTP(email);
    if (!otpResult.status) throw new Error(`Unable to send OTP to ${email}`);

    const address = { street, city, state, country, pincode };
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      phone,
      email: { userEmail: email, verified: false },
      address,
      dob,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(202).json({ 
      message: `User registered successfully! OTP sent to ${email}` 
    });
  } catch (err) {
    console.error("Error registering user:", err.message || err);
    res.status(400).json({ message: "Unable to register user!", error: err.message || err });
  }
};

/* VERIFY EMAIL OTP */
const handleOTPVerification = async (req, res) => {
  try {
    const { email, userOtp } = req.body;

    const storedOtp = await redisClient.get(`email:${email}`);
    if (!storedOtp || storedOtp !== userOtp) throw new Error("Invalid OTP!");

    await userModel.updateOne(
      { "email.userEmail": email },
      { $set: { "email.verified": true } }
    );

    await redisClient.del(`email:${email}`);

    res.status(202).json({ message: "OTP verified successfully! Please login." });
  } catch (err) {
    console.error("Error verifying OTP:", err.message || err);
    res.status(400).json({ message: "Invalid OTP!" });
  }
};

/* LOGIN USER */
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email and password are required!");

    const user = await userModel.findOne({ "email.userEmail": email });

    if (!user || !user.email.verified) {
      throw new Error("Invalid credentials!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials!");

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    res.status(200).json({
      message: `Welcome ${user.name}! Login successful.`,
      token,
    });
  } catch (err) {
    console.error("Login failed:", err.message || err);
    res.status(400).json({ message: "Invalid credentials!" });
  }
};

/* PASSWORD RESET REQUEST */
const handleResetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("Email required!");

    const user = await userModel.findOne({ "email.userEmail": email });

    if (user) await sendOTPForPasswordReset(email);

    res.status(200).json({
      message: "If the email exists, a password reset OTP has been sent. Valid for 5 minutes.",
    });
  } catch (err) {
    console.error("Password reset request failed:", err.message || err);
    res.status(400).json({ message: "Password reset failed!", error: err.message || err });
  }
};

/* VERIFY RESET OTP & UPDATE PASSWORD */
const handleOTPForPasswordReset = async (req, res) => {
  try {
    const { email, userOtp, newPassword } = req.body;
    if (!email || !userOtp || !newPassword) throw new Error("Email, OTP, and new password required!");

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) throw new Error("Invalid OTP or email!");

    await verifyOtp(email, "emailPasswordReset", userOtp);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateOne({ "email.userEmail": email }, { $set: { password: hashedPassword } });

    res.status(200).json({ message: "Password reset successful! Please log in with new password." });
  } catch (err) {
    console.error("OTP verification for password reset failed:", err.message || err);
    res.status(400).json({ message: "Failed to reset password!", error: err.message || err });
  }
};

/* FILE UPLOAD HANDLER */
const handleUserFileUpload = async (req, res) => {
  try {
    if (!req.file) throw new Error("File not found!");

    const fileName = req.file.filename;
    const fileType = req.params.file_type;

    let updateQuery = {};
    if (fileType === "profile_picture") updateQuery = { profile_picture: fileName };
    else if (fileType === "resume") updateQuery = { resume: fileName };
    else updateQuery = { $push: { documents: fileName } };

    await userModel.updateOne(
      { "email.userEmail": req.user?.email?.userEmail },
      updateQuery
    );

    res.status(200).json({ message: `${fileType} uploaded successfully!`, fileName, fileType });
  } catch (err) {
    console.error("Upload error:", err.message || err);
    res.status(500).json({ message: "Error uploading file!", error: err.message || err });
  }
};

/* FETCH USER PROFILE */
const fetchProfile = async (req, res) => {
  try {
    const user = req.user;
    const userData = await userModel.findOne({ "email.userEmail": user?.email?.userEmail });
    if (!userData) throw new Error("Unable to load user profile!");

    res.status(200).json({ message: "User profile data fetched!", userData });
  } catch (err) {
    console.error("Unable to fetch user profile:", err.message || err);
    res.status(401).json({ message: "Unable to send user profile data!", error: err.message || err });
  }
};

/* EXPORT ALL */
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
