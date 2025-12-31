export const getJobEmailTemplate = ({
  userName,
  jobTitle,       // optional, can be null
  jobType,        // "Internship" / "Full-time"
  mode,           // "online" / "offline"
  companyName,
  location,
  visitDate,
  syllabus,
}) => {
  // ================= OFFLINE INTERNSHIP =================
  if (jobType === "Internship" && mode === "offline") {
    return {
      subject: `Offline Internship Details | ${companyName}`,
      html: `
        <h2>Hi ${userName},</h2>

        <p>Congratulations 🎉</p>
        <p>You have successfully applied for the <b>${jobTitle || "internship"}</b> at <b>${companyName}</b>.</p>

        <h3>🏢 Company Details</h3>
        <ul>
          <li><b>Company:</b> ${companyName}</li>
          <li><b>Location:</b> ${location}</li>
          <li><b>Visit Date:</b> ${visitDate}</li>
        </ul>

        <h3>📘 Syllabus</h3>
        <p>${syllabus}</p>

        <p>Please carry your resume and arrive 15 minutes early.</p>

        <br/>
        <p>Best regards,<br/>Internship Team</p>
      `,
    };
  }

  // ================= ONLINE INTERNSHIP =================
  if (jobType === "Internship" && mode === "online") {
    return {
      subject: `Online Internship Application | ${companyName}`,
      html: `
        <h2>Hello ${userName},</h2>

        <p>Your application for <b>${jobTitle || "internship"}</b> has been received.</p>

        <p>📅 Interview timing will be shared within <b>24 hours</b>.</p>

        <p>Please ensure:</p>
        <ul>
          <li>Stable internet connection</li>
          <li>Resume uploaded</li>
          <li>Camera & mic working</li>
        </ul>

        <p>Good luck! 🚀</p>
      `,
    };
  }

  // ================= FULL-TIME JOB =================
  if (jobType === "Full-time") {
    return {
      subject: `Job Application Received | ${companyName}`,
      html: `
        <h2>Dear ${userName},</h2>

        <p>Thank you for applying for <b>${jobTitle || "the position"}</b> at ${companyName}.</p>

        <p>Our HR team will review your profile and contact you if shortlisted.</p>

        <p>Regards,<br/>${companyName} HR Team</p>
      `,
    };
  }

  // ================= DEFAULT =================
  return {
    subject: `Application Received`,
    html: `<p>Your application has been received successfully.</p>`,
  };
};
