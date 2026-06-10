import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/job-grid.scss";

const JobsGrid = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await axios.get(
          "https://jobpulse-server.up.railway.app/api/jobs"
        );

        const companiesRes = await axios.get(
          "https://jobpulse-server.up.railway.app/api/companies"
        );

        setJobs(jobsRes.data.jobs || []);
        setCompanies(companiesRes.data.companies || []);
      } catch (err) {
        console.error("Error fetching jobs or companies:", err);
      }
    };

    fetchData();
  }, []);

  /* ================= FIND COMPANY ================= */
  const getCompany = (jobCompany) => {
    return companies.find(
      (c) => c._id === jobCompany || c.name === jobCompany
    );
  };

  return (
    <div className="jobs-grid">
      {jobs.map((job) => {
        const company = getCompany(job.company);

        if (!company) return null;

        return (
          <div
            key={job._id}
            className="job-card"
            onClick={() => navigate(`/job/${job._id}`)}
          >
            <img src={company.logo} alt={company.name} />

            <div className="job-info">
              <h3>{job.title}</h3>
              <p>{company.name}</p>
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