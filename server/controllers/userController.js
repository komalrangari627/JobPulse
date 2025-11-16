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
  port: 587, // STARTTLS
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD, // use App password!
  },
});

// Verify Gmail SMTP connection
transporter.verify((error, success) => {
  if (error) console.error(" SMTP connection failed:", error.message);
  else console.log(" Gmail SMTP connection successful — ready to send OTP emails!");
});

/* OTP GENERATION HELPER */
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
    await redisClient.setEx(`email:${email}`, 300, otp); // store OTP for 5 min

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

/* VERIFY OTP (COMMON) */
async function verifyOtp(email, otpKey, userOtp) {
  try {
    const storedOtp = await redisClient.get(`${otpKey}:${email}`);
    if (!storedOtp) throw new Error("OTP expired or not found!");
    if (storedOtp.trim() !== userOtp.trim()) throw new Error("Invalid OTP!");

    await redisClient.del(`${otpKey}:${email}`);
    console.log(` OTP verified for ${email}`);
    return true;
  } catch (err) {
    console.error(" OTP verification failed:", err.message || err);
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

    if (
      !name ||
      !phone ||
      !email ||
      !street ||
      !city ||
      !state ||
      !country ||
      !pincode ||
      !dob ||
      !password
    )
      throw new Error("Invalid or missing data!");

    const existingUser = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    });
    if (existingUser)
      throw new Error("User already exists, please change email/phone!");

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
      message: `User registered successfully! Please verify your email using the OTP sent to ${email}.`,
    });
  } catch (err) {
    console.error(" Error registering user:", err.message || err);
    res
      .status(400)
      .json({ message: "Unable to register user!", error: err.message || err });
  }
};

/* VERIFY EMAIL OTP */
const handleOTPVerification = async (req, res) => {
    try {
        let { email, userOtp } = req.body;

        let emailExits = await userModel.findOne({ "email.userEmail": email })
        if (!emailExits) throw (`email ${email} is not registred !`)

        let storedOtp = await redisClient.get(`email:${email}`)
        if (!storedOtp) throw ("otp is expried/not found !")

        if (storedOtp != userOtp) throw ("invalid otp !")

        await userModel.updateOne(
            { "email.userEmail": email },
            { $set: { "email.verified": true } }
        );

        redisClient.del(`email:${email}`)

        res.status(202).json({ message: "otp verified successfully please head to login !" })

    } catch (err) {
        console.log("error while verifying the otp : ", err)
        res.status(500).json({ message: "failed to verify user otp please try again later !", err })
    }
}



/* LOGIN USER */
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Email and password are required!");

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) throw new Error("Email not found! Please register first.");

    if (!user.email.verified) {
      const otpResult = await sendOTP(email);
      if (!otpResult.status)
        throw new Error(`Unable to send verification OTP to ${email}`);
      throw new Error(`Email not verified! OTP sent to ${email}.`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(
        " Invalid password. Resetting it to the entered password (development only)..."
      );
      const hashed = await bcrypt.hash(password, 10);
      await userModel.updateOne(
        { "email.userEmail": email },
        { $set: { password: hashed } }
      );
      return res.status(400).json({
        message: `Password was invalid. It has now been reset to '${password}' (development mode). Please login again.`,
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: `Welcome ${user.name}! Login successful.`,
      token,
    });
  } catch (err) {
    console.error(" Login failed:", err.message || err);
    res.status(400).json({
      message: "Unable to login!",
      error: err.message || err,
    });
  }
};

/* PASSWORD RESET REQUEST */
const handleResetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("Email required!");

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) throw new Error("Invalid email! Please register first.");

    const otpResult = await sendOTPForPasswordReset(email);
    if (!otpResult.status) throw new Error(`Unable to send OTP to ${email}`);

    res.status(200).json({
      message: `Password reset OTP sent to ${email}. Valid for 5 minutes.`,
    });
  } catch (err) {
    console.error(" Password reset request failed:", err.message || err);
    res.status(400).json({
      message: "Password reset failed!",
      error: err.message || err,
    });
  }
};

/* VERIFY RESET OTP & UPDATE PASSWORD */
const handleOTPForPasswordReset = async (req, res) => {
  try {
    const { email, userOtp, newPassword } = req.body;
    if (!email || !userOtp || !newPassword)
      throw new Error("Email, OTP, and new password required!");

    const user = await userModel.findOne({ "email.userEmail": email });
    if (!user) throw new Error(`Email ${email} not registered!`);

    await verifyOtp(email, "emailPasswordReset", userOtp);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateOne(
      { "email.userEmail": email },
      { $set: { password: hashedPassword } }
    );

    res
      .status(200)
      .json({ message: "Password reset successful! Please log in with new password." });
  } catch (err) {
    console.error(" OTP verification for password reset failed:", err.message || err);
    res.status(500).json({
      message: "Failed to reset password!",
      error: err.message || err,
    });
  }
};

/* FILE UPLOAD HANDLER */
const handleUserFileUpload = async (req, res) => {
  try {
    if (!req.file) throw new Error("File not found!");

    const fileName = req.file.filename;
    const filePath = req.file.path;
    const uploadDest = req.file.destination;

    await userModel.updateOne(
      { "email.userEmail": req.user.email.userEmail },
      { $push: { documents: fileName } }
    );

    res.status(200).json({
      message: "File uploaded successfully!",
      uploadDest,
      fileName,
      filePath,
    });
  } catch (error) {
    console.error(" Upload error:", error.message || error);
    res.status(500).json({
      message: "Error uploading file!",
      error: error.message || error,
    });
  }
};

const fetchProfile = async (req, res) => {
    try {
        let user = req.user

        let userData = await userModel.findOne({ "email.userEmail": user.email.userEmail })

        if (!userData) throw ("unable to load user profile !")

        res.status(200).json({ message: "got user profile data !", userData })

    } catch (err) {
        console.log("unable to user profile : ", err)
        res.status(401).json({ message: "unable to send user profile data !", err })
    }
}

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
