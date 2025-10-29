import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {userModel} from "../models/userSchema.js";

dotenv.config({ path: "./config.env" });

// === Transporter setup for Gmail ===
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // 465 for SSL
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

// === Test Route ===
let test = (req, res) => {
  res.status(200).json({ message: "Welcome to user test route!" });
};

// === Register User ===
let handleUserRegister = async (req, res) => {
  try {
    let { name, phone, email, address, dob, qualifications, password } = req.body;

    // Validate Input
    if (!name || !phone || !email || !address || !dob || !qualifications || !password) {
      throw new Error("Invalid or missing data!");
    }

    //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email!" });
    }

    //  Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create User Object
    const newUser = new User({
      name,
      phone,
      email,
      address,
      dob,
      qualifications,
      password: hashedPassword,
    });

    //  Save User to DB
    await newUser.save();

    //  Optional: Send Welcome Email
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Welcome to Our Platform 🎉",
      html: `<h3>Hi ${name},</h3><p>Thank you for registering with us!</p>`,
    });

    //  Send Response
    res.status(201).json({
      message: "User registered successfully!",
      user: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Error while registering user:", err.message);
    res.status(400).json({ message: "Unable to register user!", error: err.message });
  }
};

export { test, handleUserRegister };
