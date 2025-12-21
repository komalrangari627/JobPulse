import axios from "axios";

/* ===============================
   BASE URLS
================================ */
const API_ROOT =
  import.meta.env.VITE_API_ROOT || "http://localhost:5012/api/jobs";

const legacyBaseUrl =
  import.meta.env.VITE_BASE_API_URL + "/job";

/* ===============================
   AXIOS INSTANCE (NEW API)
================================ */
const api = axios.create({
  baseURL: API_ROOT,
  timeout: 10000,
});

/* ===============================
   LEGACY STRUCTURE (ADDED)
================================ */

/* FETCH ALL JOBS ( /job/all ) */
export const fetchAllJobs = async () => {
  try {
    const result = await axios({
      method: "GET",
      url: `${legacyBaseUrl}/all`,
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* ===============================
   CURRENT STRUCTURE (UNCHANGED)
================================ */

/* GET ALL JOBS */
export const getAllJobs = async () => {
  try {
    const res = await api.get("/");
    return res.data?.jobs || [];
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    return [];
  }
};

/* GET JOB BY ID */
export const getJobById = async (jobId) => {
  try {
    const res = await api.get(`/${jobId}`);
    return res.data?.job ?? null;
  } catch (err) {
    console.error(`Error fetching job ${jobId}:`, err.message);
    return null;
  }
};

/* GET JOB DETAIL */
export const getJobDetail = async (jobId) => {
  try {
    const res = await api.get(`/job-detail/${jobId}`);
    return res.data?.jobDetail ?? null;
  } catch (err) {
    console.error(`Error fetching job detail ${jobId}:`, err.message);
    return null;
  }
};

/* APPLY FOR JOB */
export const applyForJob = async (jobId, token) => {
  if (!jobId || !token)
    throw new Error("Job ID and token are required");

  try {
    const res = await api.post(
      `/${jobId}/apply`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Error applying for job ${jobId}:`, err.message);
    throw err;
  }
};

/* CREATE JOB */
export const createJob = async (data, token) => {
  if (!token) throw new Error("Token is required");

  try {
    const res = await api.post("/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating job:", err.message);
    throw err;
  }
};

/* GENERIC JOB ACTION */
export const jobAction = async (action, jobId, token) => {
  if (!action || !jobId || !token)
    throw new Error("Action, Job ID, and token are required");

  try {
    const res = await api.post(
      `/${action}/${jobId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      `Error performing ${action} on job ${jobId}:`,
      err.message
    );
    throw err;
  }
};

/* ===============================
   DEFAULT EXPORT
================================ */
const jobAPI = {
  fetchAllJobs,
  getAllJobs,
  getJobById,
  getJobDetail,
  applyForJob,
  createJob,
  jobAction,
};

export default jobAPI;