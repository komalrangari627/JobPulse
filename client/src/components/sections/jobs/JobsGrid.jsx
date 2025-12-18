import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jobAPI from "../../../api/jobAPI";
import companyAPI from "../../../api/companyAPI";
import "../styles/job-grid.scss";

const JobsGrid = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch all jobs
    const fetchJobs = async () => {
      try {
        const data = await jobAPI.getAllJobs();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    // Fetch all companies
    const fetchCompanies = async () => {
      try {
        const data = await companyAPI.getAllCompanies();
        setCompanies(data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchJobs();
    fetchCompanies();
  }, []);

  // Find company by ID
  const getCompany = (companyId) => companies.find((c) => c.id === companyId);

  return (
    <div className="jobs-grid">
      {jobs.map((job) => {
        const company = getCompany(job.companyId);
        return (
          <div
            key={job.id}
            className="job-card"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            <img
              src={company?.logo || job.logo}
              alt={job.title}
              className="job-logo"
            />
            <div className="job-info">
              <h3>{job.title}</h3>
              <p>{company?.name}</p>
              <p>{job.location}</p>
              <p>{job.salary}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobsGrid;
