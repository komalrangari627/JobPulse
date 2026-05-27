import axios from "axios";

/**
 * Axios instance
 */
const API = axios.create({
  baseURL: "http://localhost:5012/api",
  withCredentials: true, // important if auth/cookies are used
});

/**
 * 🔹 Get interview by jobId
 * GET /api/interview/:jobId
 */
export const getInterviewByJobId = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error("JobId is required to fetch interview");
    }

    const res = await API.get(`/interview/${jobId}`);
    return res.data;
  } catch (error) {
    console.error(
      "❌ Interview API Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * 🔹 Submit interview result (future use)
 * POST /api/interview/submit
 */
export const submitInterviewResult = async (payload) => {
  try {
    const res = await API.post("/interview/submit", payload);
    return res.data;
  } catch (error) {
    console.error(
      "❌ Submit Interview Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
/**
 * 🔹 Get AI generated questions
 * GET /api/questions
 */
export const getAIQuestions = async (topic = "interview") => {
  try {
    const res = await API.get(`/questions?topic=${topic}`);
    return res.data;
  } catch (error) {
    console.error(
      "❌ AI Question Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export default API;
