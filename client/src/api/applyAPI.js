import axios from "axios";

/* ================= BASE CONFIG ================= */
const API = axios.create({
  baseURL: "http://localhost:5012/api",
});

/* ================= APPLY APIs ================= */

/**
 * 🔹 Send Offline Internship Email
 * @param {string} companyId
 * @param {string} jobId
 * @param {string} userEmail
 * @param {string} userName
 */
export const sendOfflineInternshipEmail = async (companyId, jobId) => {
  if (!companyId || !jobId) {
    throw new Error("Company ID and Job ID are required");
  }

  const { data } = await API.post("/apply/offline-email", {
    companyId,
    jobId,
  });

  return data;
};


