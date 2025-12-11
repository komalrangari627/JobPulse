import React, { createContext, useContext, useEffect, useState } from "react";
import companyAPI from "../api/companyAPI";

const CompanyContext = createContext();

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [companyError, setCompanyError] = useState(null);

  const loadCompany = async (companyId) => {
    setLoadingCompany(true);
    setCompanyError(null);
    try {
      const data = await companyAPI.getCompanyById(companyId);
      setCompany(data);
    } catch (err) {
      setCompany(null);
      setCompanyError(err);
      console.error("loadCompany error:", err);
    } finally {
      setLoadingCompany(false);
    }
  };

  return (
    <CompanyContext.Provider value={{ company, loadingCompany, companyError, loadCompany, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
