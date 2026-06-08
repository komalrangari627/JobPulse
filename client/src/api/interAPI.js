import API from "../api/axios";

export const getInterviewByJobId = async (jobId) => {
  const res = await API.get(`/interview/${jobId}`);
  return res.data;
};

export const submitInterviewResult = async (payload) => {
  const res = await API.post("/interview/submit", payload);
  return res.data;
};

export const getAIQuestions = async (topic = "interview") => {
  const res = await API.get(`/questions?topic=${topic}`);
  return res.data;
};

export default API;