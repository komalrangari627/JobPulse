import { jobModel } from "../models/jobSchema.js";
import { redisClient } from "../utils/redisClient.js";
import { companyModel } from "../models/companySchema.js";
import  sendEmail  from "../utils/mailer.js";                 // ✅ mail sender
import { getJobEmailTemplate } from "../utils/jobEmailTemplates.js";

/**
 * POST /api/apply/offline-email
 * No auth required
 */
export const sendOfflineInternshipEmail = async (req, res) => {
  try {
    const { companyId, jobId, userEmail, userName } = req.body;

    // ✅ Required fields (same as before)
    if (!companyId || !userEmail || !userName) {
      return res
        .status(400)
        .json({ message: "Company ID, user email, and name are required" });
    }

    // ✅ Get company
    const company = await companyModel.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // ✅ Optional: get job (if jobId is provided)
    let jobTitle = "Offline Internship";
    if (jobId) {
      const job = await jobModel.findById(jobId);
      if (job?.title) {
        jobTitle = job.title;
      }
    }

    // ✅ Offline internship data
    const offline = company.offlineInternship;
    if (!offline || !offline.streetAddress) {
      return res
        .status(400)
        .json({ message: "Offline internship details not available" });
    }

    /* ✅ Prevent duplicate email (Redis) */
    const redisKey = `offline-mail:${userEmail}:${companyId}`;
    const alreadySent = await redisClient.get(redisKey);

    if (alreadySent) {
      return res
        .status(400)
        .json({ message: "Offline internship email already sent" });
    }

    /* ✅ Send REAL email to USER */
    await sendEmail({
  to: userEmail,
  from: `"${company.name}" <${company.email}>`,
  subject: `Application Received - ${company.name}`,
  html: `
    <h2>${company.name}</h2>

    <p>Dear ${userName},</p>

    <p>Thank you for applying for the <b>${jobTitle}</b> position.</p>

    <h3>Company Information</h3>
    <ul>
      <li><b>Company:</b> ${company.name}</li>
      <li><b>Email:</b> ${company.email}</li>
      <li><b>Address:</b> ${offline.streetAddress}</li>
      <li><b>City:</b> ${offline.city}</li>
      <li><b>State:</b> ${offline.state}</li>
    </ul>

    ${
      offline.googleMapLink
        ? `<p><a href="${offline.googleMapLink}">View Company Location</a></p>`
        : ""
    }

    <p>Your application has been received successfully.</p>

    <p>Our HR team will contact you shortly.</p>

    <br/>
    <p>Regards,</p>
    <p><b>${company.name}</b></p>
    <p>${company.email}</p>
  `,
});

    /* ✅ Mark as sent in Redis (24 hours) */
    await redisClient.setEx(redisKey, 86400, "sent");

    return res.status(200).json({
      message: "Offline internship details sent to your email",
    });
  } catch (err) {
    console.error("Offline email error:", err);
    res.status(500).json({ message: "Email sending failed" });
  }
};
