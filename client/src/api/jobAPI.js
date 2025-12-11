import axios from "axios";

const API_URL = "http://localhost:5012/api/jobs";

export const getAllJobs = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    throw err;
  }
};

export const getJobById = async (jobId) => {
  try {
    const res = await axios.get(`${API_URL}/${jobId}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching job ${jobId}:`, err);
    throw err;
  }
};

export const applyForJob = async (jobId, token) => {
  try {
    const res = await axios.post(
      `${API_URL}/${jobId}/apply`,
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
    const res = await axios.post(API_URL, data, {
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
      `${API_URL}/${action}/${jobId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error(`Error performing action ${action} on job ${jobId}:`, err);
    throw err;
  }
};

const jobAPI = {
  getAllJobs,
  getJobById,
  applyForJob,
  createJob,
  jobAction,
};

export default jobAPI;
