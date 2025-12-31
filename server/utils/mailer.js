import nodemailer from "nodemailer";

 const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,        // sender
        pass: process.env.USER_EMAIL_PASSWORD // app password
      }
    });

    const info = await transporter.sendMail({
      from: `"JobPulse" <${process.env.USER_EMAIL}>`,
      to, // receiver (USER)
      subject,
      html
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

export default sendEmail;