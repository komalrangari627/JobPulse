import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_ROOT || "http://localhost:5012/api/companies";

const companyAPI = {
  // Get all companies
  getAllCompanies: async () => {
    try {
      const res = await axios.get(API_ROOT);
      return res.data.companies; // companies array with Cloudinary logos
    } catch (err) {
      console.error("Error fetching companies:", err);
      throw err;
    }
  },

  // Get a single company by ID
  getCompanyById: async (companyId) => {
    try {
      const res = await axios.get(`${API_ROOT}/${companyId}`);
      return res.data.company;
    } catch (err) {
      console.error(`Error fetching company ${companyId}:`, err);
      throw err;
    }
  },

  // Update a company
  updateCompany: async (companyId, payload, token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.put(`${API_ROOT}/update/${companyId}`, payload, { headers });
      return res.data.company ?? res.data;
    } catch (err) {
      console.error(`Error updating company ${companyId}:`, err);
      throw err;
    }
  },

  // Create a new company
  createCompany: async (payload) => {
    try {
      const res = await axios.post(`${API_ROOT}/register`, payload);
      return res.data.company ?? res.data;
    } catch (err) {
      console.error("Error creating company:", err);
      throw err;
    }
  },
};

export default companyAPI;
