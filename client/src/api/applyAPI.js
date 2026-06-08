import API from "../api/axios";

export const sendOfflineInternshipEmail = async (companyId, jobId) => {
  if (!companyId || !jobId) {
    throw new Error("Company ID and Job ID are required");
  }

  const res = await API.post("/apply/offline-email", {
    companyId,
    jobId,
  });

  return res.data;
};