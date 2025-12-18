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
    const fetchJobsAndCompanies = async () => {
      try {
        const jobsData = await jobAPI.getAllJobs();
        const companiesData = await companyAPI.getAllCompanies();

        setCompanies(companiesData);
        setJobs(jobsData); 
      } catch (err) {
        console.error("Error fetching jobs or companies:", err);
      }
    };

    fetchJobsAndCompanies();
  }, []);

  const getCompany = (jobCompanyName) =>
    companies.find((c) => c.name === jobCompanyName);

  return (
    <div className="jobs-grid">
      {jobs.map((job) => {
        const company = getCompany(job.company);

        if (!company) return null;

        return (
          <div
            key={job._id?.$oid || job._id} 
            className="job-card"
            onClick={() =>
              navigate(`/job/${job._id?.$oid || job._id}`)
            }
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
