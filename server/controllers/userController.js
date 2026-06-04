import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { redisClient } from "../utils/redisClient.js";
import { userModel } from "../models/userSchema.js";

dotenv.config({ path: "./config.env" });

/* =============================================
   EMAIL TRANSPORTER
============================================= */

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

  if (error) {
    console.log("SMTP Error:", error.message);
  } else {
    console.log("Gmail SMTP Ready");
  }
});

/* =============================================
   OTP GENERATOR
============================================= */

const generateOTP = () => {

  return Math.floor(
    1000 + Math.random() * 9000
  ).toString();
};

/* =============================================
   SEND OTP EMAIL
============================================= */

const sendOTP = async (email) => {

  const otp = generateOTP();

  try {

    await transporter.sendMail({
      from: process.env.USER_EMAIL,

      to: email,

      subject: "Email Verification OTP",

      html: `
        <div style="font-family:sans-serif;">
          <h2>Email Verification</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>
            OTP valid for 5 minutes.
          </p>
        </div>
      `,
    });

    // SAVE OTP IN REDIS

    await redisClient.setEx(
      `email:${email}`,
      300,
      otp
    );

    return true;

  } catch (err) {

    console.log(
      "OTP Send Error:",
      err.message
    );

    return false;
  }
};

/* =============================================
   TEST ROUTE
============================================= */

const test = (req, res) => {

  res.status(200).json({
    message: "User Route Working",
  });
};

/* =============================================
   REGISTER USER
============================================= */

const handleUserRegister = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // VALIDATION

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    // CHECK USER

    const existingUser =
      await userModel.findOne({
        "email.userEmail": email,
      });

    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER

    const newUser = new userModel({

      name,

      email: {
        userEmail: email,
        verified: false,
      },

      password: hashedPassword,
    });

    await newUser.save();

    // SEND OTP

    await sendOTP(email);

    res.status(201).json({

      message:
        "Registration successful. OTP sent to email.",

      email,
    });

  } catch (err) {

    console.log(
      "Register Error:",
      err.message
    );

    res.status(500).json({
      message:
        "Registration failed",
    });
  }
};

/* =============================================
   VERIFY OTP
============================================= */

const handleOTPVerification = async (
  req,
  res
) => {

  try {

    const {
      email,
      userOtp,
    } = req.body;

    const storedOtp =
      await redisClient.get(
        `email:${email}`
      );

    if (
      !storedOtp ||
      storedOtp !== userOtp
    ) {

      return res.status(400).json({
        message:
          "Invalid or expired OTP",
      });
    }

    // VERIFY EMAIL

    await userModel.updateOne(
      {
        "email.userEmail": email,
      },

      {
        $set: {
          "email.verified": true,
        },
      }
    );

    // DELETE OTP

    await redisClient.del(
      `email:${email}`
    );

    res.status(200).json({
      message:
        "Email verified successfully",
    });

  } catch (err) {

    console.log(
      "OTP Verification Error:",
      err.message
    );

    res.status(500).json({
      message:
        "OTP verification failed",
    });
  }
};

/* =============================================
   LOGIN USER
============================================= */

const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // VALIDATION

    if (!email || !password) {

      return res.status(400).json({
        message:
          "Email and password required",
      });
    }

    // FIND USER

    const user =
      await userModel.findOne({
        "email.userEmail": email,
      });

    if (!user) {

      return res.status(400).json({
        message: "User not found",
      });
    }

    // VERIFY PASSWORD

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {

      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    // EMAIL VERIFIED CHECK

    if (!user.email.verified) {

      return res.status(400).json({
        message:
          "Please verify email first",
      });
    }

    // CREATE TOKEN

    const token = jwt.sign(
      {
        id: user._id,
      },

      process.env.JWT_SECRET_KEY,

      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({

      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email:
          user.email.userEmail,
      },
    });

  } catch (err) {

    console.log(
      "Login Error:",
      err.message
    );

    res.status(500).json({
      message: "Login failed",
    });
  }
};

/* =============================================
   RESET PASSWORD REQUEST
============================================= */

const handleResetPasswordRequest =
  async (req, res) => {

    try {

      const { email } = req.body;

      if (!email) {

        return res.status(400).json({
          message:
            "Email is required",
        });
      }

      const user =
        await userModel.findOne({
          "email.userEmail": email,
        });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });
      }

      // SEND OTP

      await sendOTP(email);

      res.status(200).json({
        message:
          "Password reset OTP sent successfully",
      });

    } catch (err) {

      console.log(
        "Reset Password Error:",
        err.message
      );

      res.status(500).json({
        message:
          "Password reset request failed",
      });
    }
  };

/* =============================================
   VERIFY RESET PASSWORD OTP
============================================= */

const handleOTPForPasswordReset =
  async (req, res) => {

    try {

      const {
        email,
        userOtp,
        newPassword,
      } = req.body;

      const storedOtp =
        await redisClient.get(
          `email:${email}`
        );

      if (
        !storedOtp ||
        storedOtp !== userOtp
      ) {

        return res.status(400).json({
          message:
            "Invalid or expired OTP",
        });
      }

      // HASH PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      // UPDATE PASSWORD

      await userModel.updateOne(
        {
          "email.userEmail":
            email,
        },

        {
          $set: {
            password:
              hashedPassword,
          },
        }
      );

      // DELETE OTP

      await redisClient.del(
        `email:${email}`
      );

      res.status(200).json({
        message:
          "Password updated successfully",
      });

    } catch (err) {

      console.log(
        "Reset OTP Error:",
        err.message
      );

      res.status(500).json({
        message:
          "Password reset failed",
      });
    }
  };

/* =============================================
   USER FILE UPLOAD
============================================= */

const handleUserFileUpload =
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message:
            "No file uploaded",
        });
      }

      res.status(200).json({

        message:
          "File uploaded successfully",

        file: req.file.filename,
      });

    } catch (err) {

      console.log(
        "File Upload Error:",
        err.message
      );

      res.status(500).json({
        message:
          "File upload failed",
      });
    }
  };

/* =============================================
   FETCH PROFILE
============================================= */

const fetchProfile = async (
  req,
  res
) => {

  try {

    const user =
      await userModel.findById(
        req.user.id
      );

    res.status(200).json({

      message:
        "Profile fetched successfully",

      user,
    });

  } catch (err) {

    console.log(
      "Profile Error:",
      err.message
    );

    res.status(500).json({
      message:
        "Fetching profile failed",
    });
  }
};

/* =============================================
   EXPORTS
============================================= */

export {

  test,

  handleUserRegister,

  handleOTPVerification,

  loginUser,

  fetchProfile,

  handleResetPasswordRequest,

  handleOTPForPasswordReset,

  handleUserFileUpload,
};

