import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/job-page.scss";

const JobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();   // ✅ REQUIRED
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/jobs/${jobId}`
        );
        setJob(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job) return <div className="job-page-loading">Loading...</div>;

  return (
    <section className="job-page">
      <div className="card-page">
        <h1>{job.title}</h1>
        <p className="company">{job.companyName}</p>

        <div className="details">
          <span>{job.location}</span>
          <span>{job.experience}</span>
          <span>{job.salary}</span>
        </div>

        <article>{job.description}</article>

        {/* ✅ BUTTONS MUST BE HERE */}
        <div className="job-actions">
        <button
      className="apply-btn"
      onClick={() => navigate(`/apply/${job._id}`)}
    >
      Apply Now
    </button>

          {/* ✅ View Company button */}
          <div className="job-actions">
          {job.companyId && (
            <button
              className="view-company-btn"
              onClick={() => navigate(`/company/${job.companyId}`)}
            >
              View Company
            </button>
          )}
        </div>
      </div>
      </div>
    </section>
  );
};

export default JobPage;
