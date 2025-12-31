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
    await sendMail({
      to: userEmail,
      subject: `Offline Internship Details – ${company.name}`,
      html: `
        <h2>${company.name}</h2>

        <p>Hi <b>${userName}</b>,</p>
        <p>You have successfully applied for:</p>

        <p><b>Internship:</b> ${jobTitle}</p>

        <hr/>

        <p><b>Office Address:</b><br/>
          ${offline.streetAddress}, ${offline.city}, ${offline.state} - ${offline.pincode}
        </p>

        ${
          offline.googleMapLink
            ? `<p><b>Google Map:</b>
               <a href="${offline.googleMapLink}" target="_blank">View Location</a>
               </p>`
            : ""
        }

        <p><b>Visit Date:</b> ${offline.visitDate}</p>
        <p><b>Visit Time:</b> ${offline.visitTime}</p>

        <p><b>Syllabus:</b><br/>${offline.syllabus}</p>
        <p><b>Instructions:</b><br/>${offline.instructions}</p>

        <br/>
        <p>Best of luck! 🍀</p>
        <p>— <b>JobPulse Team</b></p>
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
