import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_ROOT || "http://localhost:5012/api/jobs";

// Individual functions
export const getAllJobs = async () => {
  try {
    const res = await axios.get(API_ROOT);
    return res.data.jobs;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    throw err;
  }
};

export const getJobById = async (jobId) => {
  try {
    const res = await axios.get(`${API_ROOT}/${jobId}`);
    return res.data.job;
  } catch (err) {
    console.error(`Error fetching job ${jobId}:`, err);
    throw err;
  }
};

export const applyForJob = async (jobId, token) => {
  try {
    const res = await axios.post(
      `${API_ROOT}/${jobId}/apply`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error(`Error applying for job ${jobId}:`, err);
    throw err;
  }
};

export const createJob = async (data, token) => {
  try {
    const res = await axios.post(API_ROOT, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating job:", err);
    throw err;
  }
};

export const jobAction = async (action, jobId, token) => {
  try {
    const res = await axios.post(
      `${API_ROOT}/${action}/${jobId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error(`Error performing action ${action} on job ${jobId}:`, err);
    throw err;
  }
};

// Optional: keep default export for backward compatibility
const jobAPI = { getAllJobs, getJobById, applyForJob, createJob, jobAction };
export default jobAPI;
