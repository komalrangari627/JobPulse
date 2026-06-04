import nodemailer from "nodemailer";

const sendEmail = async ({
  to,
  subject,
  html,
  companyName = "JobPulse",
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"${companyName}" <${process.env.USER_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

export default sendEmail;