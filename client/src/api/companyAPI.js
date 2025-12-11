import axios from "axios";

// for Vite:
const API_ROOT = import.meta.env.VITE_API_ROOT || "http://localhost:5012";

const companyAPI = {
  getCompanyById: async (companyId) => {
    const res = await axios.get(`${API_ROOT}/api/companies/${companyId}`);
    return res.data.company ?? res.data;
  },

  getAllCompanies: async () => {
    const res = await axios.get(`${API_ROOT}/api/companies`);
    return res.data.companies ?? res.data;
  },

  updateCompany: async (companyId, payload, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.put(`${API_ROOT}/api/companies/${companyId}`, payload, { headers });
    return res.data.company ?? res.data;
  },

  createCompany: async (payload) => {
    const res = await axios.post(`${API_ROOT}/api/companies`, payload);
    return res.data.company ?? res.data;
  },
};

export default companyAPI;
