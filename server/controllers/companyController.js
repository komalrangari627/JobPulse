import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redisClient } from "../utils/redisClient.js";
import { companyModel } from "../models/companySchema.js";

dotenv.config({ path: "./config.env" });

/* EMAIL TRANSPORTER */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) console.error("SMTP Error:", err.message);
  else console.log(" Company SMTP Ready");
});

/* UTILITIES */
const generateOTP = () => Math.floor(Math.random() * 9000 + 1000).toString();

async function sendOTP(email, type = "company") {
  try {
    const otp = generateOTP();
    const subject =
      type === "reset"
        ? "Company Password Reset OTP (valid for 5 minutes)"
        : "Company Registration OTP (valid for 5 minutes)";
    const key = type === "reset" ? "companyPasswordReset" : "company";

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject,
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    await redisClient.setEx(`${key}:${email}`, 300, otp);
    console.log(` OTP ${otp} sent to ${email}`);
    return { status: true, otp };
  } catch (err) {
    console.error(" Error sending OTP:", err);
    return { status: false, message: err.message };
  }
}

/* CONTROLLERS */

// TEST ROUTE
export const test = (req, res) => {
  res.status(200).json({ message: "Welcome to company test route!" });
};
//  Register Company
export const registerCompany = async (req, res) => {
  try {
    const { companyDetails, contact_person, email, phone, password } = req.body;

    if (!companyDetails || !contact_person || !email || !phone || !password)
      throw "Incomplete data!";

    const existing = await companyModel.findOne({
      $or: [{ "email.userEmail": email.userEmail }, { phone }],
    });
    if (existing) throw "Company already exists!";

    const otpResult = await sendOTP(email.userEmail, "register");
    if (!otpResult.status) throw "Failed to send OTP!";

    if (req.file) req.body.companyLogo = req.file.path;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = new companyModel({
      ...req.body,
      password: hashedPassword,
    });
    await company.save();
    res.status(201).json({
      message: `Company registered successfully! OTP sent to ${email.userEmail}`,
    });
  } catch (err) {
    res.status(400).json({
      message: "Unable to register company!",
      error: err.message || err,
    });
  }
};

//  Verify Registration OTP
export const verifyCompanyOtp = async (req, res) => {
  try {
    const { email, userOtp } = req.body;
    if (!email || !userOtp) throw "Email and OTP are required!";

    const storedOtp = await redisClient.get(`company:${email}`);

    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP expired! Please request a new one.",
      });
    }

    if (storedOtp !== userOtp) {
      return res.status(400).json({
        message: "Invalid OTP! Please check and try again.",
      });
    }

    await companyModel.updateOne(
      { "email.userEmail": email },
      { $set: { "email.verified": true } }
    );

    await redisClient.del(`company:${email}`);

    res.status(200).json({
      message: "Company email verified successfully!",
    });
  } catch (err) {
    res.status(400).json({
      message: "OTP verification failed!",
      error: err.message || err,
    });
  }
};


//  Login Company
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  const company = await Company.findOne({ email });
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  const isMatch = await bcrypt.compare(password, company.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: company._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    success: true,
    token,
    company: {
      id: company._id,
      name: company.name,
      email: company.email,
      logo: company.logo
    }
  });
};

//  Update Company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.file) req.body.companyLogo = req.file.path;

    const updated = await companyModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw "Company not found!";
    res.status(200).json({
      message: "Company updated successfully!",
      company: updated,
    });
  } catch (err) {
    res.status(400).json({
      message: "Update failed!",
      error: err.message || err,
    });
  }
};

//  Delete Company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await companyModel.findByIdAndDelete(id);
    if (!deleted) throw "Company not found!";
    res.status(200).json({ message: "Company deleted successfully!" });
  } catch (err) {
    res.status(400).json({
      message: "Delete failed!",
      error: err.message || err,
    });
  }
};

//  Upload Logo or Document
export const handleCompanyFileUpload = async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded!");
    await companyModel.updateOne(
      { "email.userEmail": req.user.email },
      { $set: { companyLogo: req.file.path } }
    );
    res.status(200).json({
      message: "Logo uploaded successfully!",
      file: req.file.filename,
      path: req.file.path,
    });
  } catch (err) {
    res.status(500).json({
      message: "File upload failed!",
      error: err.message || err,
    });
  }
};
// UPLOAD COMPANY LOGO
export const addCompanyLogo = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No logo uploaded!" });
    }

    // Cloudinary automatically returns a full URL
    const logoUrl = req.file.path;

    const updated = await companyModel.findByIdAndUpdate(
      companyId,
      { "companyDetails.logo": logoUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: "Logo uploaded to Cloudinary!",
      logo: logoUrl,
      company: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Cloudinary upload failed",
      error: err.message
    });
  }
};

/* PASSWORD RESET FLOW (OTP) */

// Step 1: Request Password Reset OTP
export const handleCompanyPasswordResetRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const company = await companyModel.findOne({ "email.userEmail": email });
    if (!company) throw "Invalid email!";

    const otpResult = await sendOTP(email, "reset");
    if (!otpResult.status) throw "Failed to send OTP!";

    res.status(200).json({
      message: `Password reset OTP sent to ${email}. Valid for 5 minutes.`,
    });
  } catch (err) {
    res.status(400).json({
      message: "Password reset request failed!",
      error: err.message || err,
    });
  }
};

// Step 2: Verify OTP & Update Password
export const handleCompanyOTPForPasswordReset = async (req, res) => {
  try {
    const { email, userOtp, newPassword } = req.body;
    if (!email || !userOtp || !newPassword)
      throw "Email, OTP, and new password are required!";

    const storedOtp = await redisClient.get(`companyPasswordReset:${email}`);

    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP expired! Please request a new password reset OTP.",
      });
    }

    if (storedOtp !== userOtp) {
      return res.status(400).json({
        message: "Invalid OTP! Please try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await companyModel.updateOne(
      { "email.userEmail": email },
      { $set: { password: hashedPassword } }
    );

    await redisClient.del(`companyPasswordReset:${email}`);

    res.status(200).json({
      message: "Password reset successful! Please log in with your new password.",
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to reset password!",
      error: err.message || err,
    });
  }
};
