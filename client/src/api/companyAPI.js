import API from "../api/axios";

/* GET ALL COMPANIES */
export const getAllCompanies = async () => {
  const res = await API.get("/companies");
  return res.data?.companies || [];
};

/* GET COMPANY BY ID */
export const getCompanyById = async (id) => {
  const res = await API.get(`/companies/${id}`);
  return res.data?.company || null;
};

/* CREATE COMPANY */
export const createCompany = async (data) => {
  const res = await API.post("/companies", data);
  return res.data;
};

/* UPDATE COMPANY */
export const updateCompany = async (id, data, token) => {
  const res = await API.put(`/companies/${id}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data;
};