import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_ROOT || "http://localhost:5012/api/jobs";

/* AXIOS INSTANCE */
const api = axios.create({
  baseURL: API_ROOT,
  timeout: 10000,
});

/* GET ALL JOBS */
export const getAllJobs = async (options = {}) => {
  const { signal } = options;
  try {
    const res = await api.get("/", { signal });
    // Ensure jobs array exists even if API response is malformed
    return Array.isArray(res.data?.jobs) ? res.data.jobs : [];
  } catch (err) {
    if (err.name !== "CanceledError" && err.name !== "AbortError") {
      console.error("Error fetching jobs:", err);
    }
    return [];
  }
};

/* GET JOB BY ID */
export const getJobById = async (jobId, options = {}) => {
  const { signal } = options;
  if (!jobId) throw new Error("Job ID is required");
  try {
    const res = await api.get(`/${jobId}`, { signal });
    return res.data?.job || null;
  } catch (err) {
    console.error(`Error fetching job ${jobId}:`, err);
    return null;
  }
};

/* APPLY FOR JOB */
export const applyForJob = async (jobId, token) => {
  if (!jobId || !token) throw new Error("Job ID and token are required");
  try {
    const res = await api.post(
      `/${jobId}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Error applying for job ${jobId}:`, err);
    throw err;
  }
};

/* CREATE JOB */
export const createJob = async (data, token) => {
  if (!token) throw new Error("Token is required");
  try {
    const res = await api.post("/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating job:", err);
    throw err;
  }
};

/* GENERIC JOB ACTION */
export const jobAction = async (action, jobId, token) => {
  if (!action || !jobId || !token) throw new Error("Action, Job ID, and token are required");
  try {
    const res = await api.post(
      `/${action}/${jobId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Error performing ${action} on job ${jobId}:`, err);
    throw err;
  }
};

/* DEFAULT EXPORT */
const jobAPI = {
  getAllJobs,
  getJobById,
  applyForJob,
  createJob,
  jobAction,
};

export default jobAPI;
