import API from "../api/axios";

/* ================= GET JOBS ================= */
export const getAllJobs = async () => {
  const res = await API.get("/jobs");
  return res.data?.jobs || [];
};

/* ================= GET JOB BY ID ================= */
export const getJobById = async (id) => {
  const res = await API.get(`/jobs/${id}`);
  return res.data?.job || null;
};

/* ================= CREATE JOB ================= */
export const createJob = async (data) => {
  const res = await API.post("/jobs", data);
  return res.data;
};