import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jobAPI from "../../../api/jobAPI";
import companyAPI from "../../../api/companyAPI";
import "../styles/job-page.scss";

const JobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (!jobId) {
      navigate("/");
      return;
    }

    const fetchJob = async () => {
      try {
        const jobData = await jobAPI.getJobById(jobId);
        setJob(jobData);

        if (jobData?.companyId) {
          const companyData = await companyAPI.getCompanyById(jobData.companyId);
          setCompany(companyData);
        }
      } catch (err) {
        console.error("Error fetching job or company:", err);
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  if (!job) return <h1>Job not found</h1>;

  return (
    <div className="job-page">
      <div className="job-header">
        <img
          src={company?.logo || job.logo}
          alt={job.title}
          className="job-page-logo"
        />
        <h1>{job.title}</h1>
        <h2>{company?.name}</h2>
      </div>
      <div className="job-details">
        <p><strong>Category:</strong> {job.category}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Experience:</strong> {job.experience}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Description:</strong> {job.description}</p>
      </div>
    </div>
  );
};

export default JobPage;
