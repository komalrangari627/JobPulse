import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { getAllJobs } from "../api/jobAPI";

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= NORMALIZE DATA ================= */
  const normalizeJobs = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.jobs)) return data.jobs;
    if (Array.isArray(data?.allJobs)) return data.allJobs;
    return [];
  };

  /* ================= LOAD JOBS ================= */
  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllJobs(); // ✅ FIXED (no jobAPI)
      setJobs(normalizeJobs(data));
    } catch (err) {
      console.error("JobProvider fetch error:", err);
      setError(err?.message || "Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  /* ================= REFRESH ================= */
  const refreshJobs = useCallback(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <JobContext.Provider value={{ jobs, loading, error, refreshJobs }}>
      {children}
    </JobContext.Provider>
  );
};