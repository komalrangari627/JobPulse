import React, { createContext, useContext, useEffect, useState } from "react";
import jobAPI from "../api/jobAPI";

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);        // will always be an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await jobAPI.getAllJobs();
        const jobsArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
          ? data.jobs
          : [];

        if (mounted) setJobs(jobsArray);
      } catch (err) {
        console.error("JobProvider fetch error:", err);
        if (mounted) {
          setError(err);
          setJobs([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const data = await jobAPI.getAllJobs();
      const jobsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
        ? data.jobs
        : [];
      setJobs(jobsArray);
    } catch (err) {
      console.error("refreshJobs error:", err);
      setJobs([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, loading, error, refreshJobs }}>
      {children}
    </JobContext.Provider>
  );
};
