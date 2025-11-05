import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { redisClient } from "../utils/redisClient.js";
import { userModel } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config({ path: "./config.env" });

/* EMAIL TRANSPORTER (Gmail SMTP with Debugging) */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,             // use 587 for STARTTLS
  secure: false,         // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD, // App password only!
  },
});

// Verify Gmail SMTP connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error(" SMTP connection failed:", error.message);
  } else {
    console.log(" Gmail SMTP connection successful — ready to send OTP emails!");
  }
});

/* OTP GENERATION */
function generateRandomNumber() {
  return Math.floor(Math.random() * 9000 + 1000).toString();
}

/* SEND OTP (EMAIL VERIFICATION) */
async function sendOTP(email) {
  try {
    const otp = generateRandomNumber();
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Email Verification | OTP valid for 5 mins!",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    await redisClient.setEx(`email:${email}`, 300, otp);

console.log(` OTP ${otp} sent to ${email}`);
return { message: "OTP sent successfully!", status: true, otp };
  } catch (err) {
    console.error(" Error sending OTP:", err.message || err);
    return { message: "Unable to send OTP!", status: false };
  }
}

/* SEND OTP (PASSWORD RESET) */
async function sendOTPForPasswordReset(email) {
  try {
    const otp = generateRandomNumber();
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset Request | OTP valid for 5 mins!",
      text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    await redisClient.setEx(`emailPasswordReset:${email}`, 300, otp);

    console.log(` Password reset OTP ${otp} sent to ${email}`);
    return { message: "OTP sent successfully!", status: true };
  } catch (err) {

    console.error(" Error sending password reset OTP:", err.message || err);
    return { message: "Unable to send password reset OTP!", status: false };
  }
}

/* VERIFY OTP (COMMON FUNCTION) */
async function verifyOtp(email, otpKey, userOtp) {
  try {
    const storedOtp = await redisClient.get(`${otpKey}:${email}`);
    if (!storedOtp) throw "OTP expired or not found!";
    if (storedOtp.trim() !== userOtp.trim()) throw "Invalid OTP!";

    await redisClient.del(`${otpKey}:${email}`);
    console.log(` OTP verified for ${email}`);
    return true;
  } catch (err) {
    console.error(" OTP verification failed:", err);
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
    const { name, phone, email, address, dob, qualifications, password } = req.body;

    if (!name || !phone || !email || !address || !dob || !qualifications || !password)
      throw "Invalid/missing data!";

    const existingUser = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    });
    if (existingUser) throw "User already exists, please change email/phone!";

    const otpResult = await sendOTP(email);
    if (!otpResult.status) throw `Unable to send OTP to ${email}`;

    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.error(" Error registering user:", err.message || err);
    res.status(400).json({ message: "Unable to register user!", error: err.message || err });
  }
};

/* VERIFY EMAIL OTP */
const handleOTPVerification = async (req, res) => {
  try {
    const { email, userOtp } = req.body;
    if (!email || !userOtp) throw "Email and OTP required!";

    await verifyOtp(email, "email", userOtp);

    const updateUser = await userModel.updateOne(
      { "email.userEmail": email },
      { $set: { "email.verified": true } }
    );

    if (updateUser.modifiedCount === 0)
      throw "Failed to update verification status!";

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(" Error verifying OTP:", err);
    res.status(500).json({ message: "Failed to verify OTP!", error: err.message || err });

  }
};

/* LOGIN USER (with DEV fallback auto-reset password = user input) */
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw "Email and password are required!";

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) throw "Email not found! Please register first.";

    if (!user.email.verified) {
      const otpResult = await sendOTP(email);
      if (!otpResult.status)
        throw `Unable to send verification OTP to ${email}`;
      throw `Email not verified! OTP sent to ${email}.`;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      //  DEV-ONLY START 
      console.warn(" Invalid password. Resetting it to the entered password (development only)...");

      const hashed = await bcrypt.hash(password, 10);

      await userModel.updateOne(
        { "email.userEmail": email },
        { $set: { password: hashed } }
      );

      return res.status(400).json({
        message: `Password was invalid. It has now been reset to '${password}' (development mode). Please try login again.`,
      });
      //  DEV-ONLY END 
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    res.status(200).json({
      message: `Welcome ${user.name}! Login successful.`,
      token,
    });
  } catch (err) {
    console.error(" Login failed:", err);
    res.status(400).json({ message: "Unable to login!", error: err.message || err });
  }
};

/* PASSWORD RESET REQUEST */
const handleResetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw "Email required!";

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) throw "Invalid email! Please register first.";

    const otpResult = await sendOTPForPasswordReset(email);
    if (!otpResult.status) throw `Unable to send OTP to ${email}`;

    res.status(200).json({
      message: `Password reset OTP sent to ${email}. Valid for 5 minutes.`,
    });
  } catch (err) {
    console.error(" Password reset request failed:", err);
    res.status(400).json({ message: "Password reset failed!", error: err.message || err });
  }
};

/*  VERIFY RESET OTP & UPDATE PASSWORD */
const handleOTPForPasswordReset = async (req, res) => {
  try {
    const { email, userOtp, newPassword } = req.body;
    if (!email || !userOtp || !newPassword)
      throw "Incomplete data! Email, OTP, and new password required.";

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) throw `Email ${email} not registered!`;

    await verifyOtp(email, "emailPasswordReset", userOtp);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateOne(
      { "email.userEmail": email },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({
      message: "Password reset successful! Please log in with your new password.",
    });
  } catch (err) {
    console.error(" OTP verification for password reset failed:", err);
    res.status(500).json({
      message: "Failed to reset password! Please try again later.",
      error: err.message || err,
    });
  }
};
const handleUserFileUpload = async (req, res) => {
    try {

        if (!req.file) throw new Error("File not found!");
    const fileName = req.file.filename;
    const filePath = req.file.path;
    const uploadDest = req.file.destination;

        // update user document with file name

        await userModel.updateOne({ "email.userEmail": req.user.email.userEmail }, { $push: { "documents": fileName } })

         res.status(200).json({
      message: "File uploaded successfully!",
      uploadDest,
      fileName,
      filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Error uploading file!",
      error: error.message || error,
    });
  }
}
/*  EXPORT ALL */
export {
  test,
  handleUserRegister,
  handleOTPVerification,
  handleUserLogin,
  handleResetPasswordRequest,
  handleOTPForPasswordReset,
  handleUserFileUpload
};
