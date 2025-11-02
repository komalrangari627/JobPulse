import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { redisClient } from "../utils/redisClient.js";
import { userModel } from "../models/userSchema.js";
import bcrypt from "bcrypt";

dotenv.config({ path: "./config.env" });

// ================== EMAIL TRANSPORTER ==================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

// ================== OTP GENERATION ==================
function generateRandomNumber() {
  return Math.floor(Math.random() * 9000 + 1000).toString();
}

// ================== SEND OTP ==================
export async function sendOTP(email) {
  try {
    const otp = generateRandomNumber();

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Your OTP to verify email address | Valid for 5 mins!",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    // store OTP in Redis for 5 mins
    await redisClient.setEx(`email:${email}`, 300, otp.toString());

    console.log(` OTP ${otp} sent to ${email}`);
    return { message: "OTP sent successfully!", status: true };
  } catch (err) {
    console.error(" Error sending OTP:", err);
    return { message: "Failed to send OTP!", status: false };
  }
}

// ================== VERIFY OTP ==================
export async function verifyOtp(email, otp) {
  try {
    const storedOtp = await redisClient.get(`email:${email}`);

    if (!storedOtp) return { status: false, message: "OTP expired or not found!" };
    if (storedOtp !== otp.toString()) return { status: false, message: "Invalid OTP!" };

    // delete OTP once verified
    await redisClient.del(`email:${email}`);
    console.log(` OTP verified for ${email}`);

    return { status: true, message: "OTP verified successfully!" };
  } catch (err) {
    console.error(" Error verifying OTP:", err);
    return { status: false, message: "Unable to verify OTP!" };
  }
}

// ================== TEST ROUTE ==================
export const test = (req, res) => {
  res.status(200).json({ message: "Welcome to user test route!" });
};

// ================== USER REGISTER ==================
export const handleUserRegister = async (req, res) => {
  try {
    const { name, phone, email, address, dob, qualifications, password } = req.body;

    if (!name || !phone || !email || !address || !dob || !qualifications || !password) {
      throw "Invalid/Missing data!";
    }

    // check if user exists
    const existingUser = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    });
    if (existingUser) throw "User already exists, please change email/phone and try again!";

    // send OTP
    const otpResult = await sendOTP(email);
    if (!otpResult.status) throw `Unable to send OTP to ${email}`;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new userModel({
      name,
      phone,
      email: { userEmail: email, verified: false },
      address,
      dob,
      qualifications,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(202).json({
      message: `User registered successfully! Please verify your email using the OTP sent to ${email}.`,
    });
  } catch (err) {
    console.error(" Error while registering user:", err);
    res.status(400).json({ message: "Unable to register user!", error: err });
  }
};

// ================== OTP VERIFICATION ==================
export const handleOTPVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required!" });
    }

    const result = await verifyOtp(email, otp);
    if (!result.status) {
      return res.status(400).json({ message: result.message });
    }

    // update user email verification status
    const updatedUser = await userModel.updateOne(
      { "email.userEmail": email },
      { $set: { "email.verified": true } }
    );

    if (updatedUser.modifiedCount === 0)
      throw "Failed to update verification status!";

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(" Error verifying OTP:", err);
    res.status(500).json({ message: "Failed to verify user OTP!", error: err });
  }
};
