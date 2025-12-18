import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import jobAPI from "../api/jobAPI";

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);        // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeJobs = (data) => {
    // Check if data is a direct array or nested in common keys
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.jobs)) return data.jobs; 
    if (Array.isArray(data?.allJobs)) return data.allJobs; // Check for alternate keys
    return [];
  };

  const loadJobs = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobAPI.getAllJobs({ signal });
      setJobs(normalizeJobs(data));
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("JobProvider fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load jobs");
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller.signal);

    return () => controller.abort();
  }, [loadJobs]);

  const refreshJobs = useCallback(async () => {
    await loadJobs();
  }, [loadJobs]);

  return (
    <JobContext.Provider value={{ jobs, loading, error, refreshJobs }}>
      {children}
    </JobContext.Provider>
  );
};
