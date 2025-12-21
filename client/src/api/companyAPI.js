import axios from "axios";

/* ✅ DEFINE API_ROOT */
const API_ROOT =
  import.meta.env.VITE_API_ROOT || "http://localhost:5012/api/companies";

/* GET ALL COMPANIES */
export const getAllCompanies = async () => {
  try {
    const res = await axios.get(API_ROOT);
    return res.data?.companies || [];
  } catch (err) {
    console.error("Error fetching companies:", err.message);
    return [];
  }
};

/* GET COMPANY BY ID */
export const getCompanyById = async (companyId) => {
  try {
    const res = await axios.get(`${API_ROOT}/${companyId}`);
    return res.data?.company ?? null;
  } catch (err) {
    console.error(`Error fetching company ${companyId}:`, err.message);
    return null;
  }
};

/* UPDATE COMPANY */
export const updateCompany = async (companyId, payload, token) => {
  try {
    const res = await axios.put(`${API_ROOT}/${companyId}`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data?.company ?? res.data;
  } catch (err) {
    console.error(`Error updating company ${companyId}:`, err.message);
    throw err;
  }
};

/* CREATE COMPANY */
export const createCompany = async (payload) => {
  try {
    const res = await axios.post(API_ROOT, payload);
    return res.data?.company ?? res.data;
  } catch (err) {
    console.error("Error creating company:", err.message);
    throw err;
  }
};

/* ✅ DEFAULT EXPORT */
const companyAPI = {
  getAllCompanies,
  getCompanyById,
  updateCompany,
  createCompany,
};

export default companyAPI;
