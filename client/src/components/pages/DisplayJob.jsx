import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../sections/styles/display-job.scss";

const API_BASE = "https://jobpulse-server.up.railway.app/api";

const DisplayJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/jobs/${jobId}`);

        const jobData = res?.data?.job;

        setJob(jobData || null);

        // FIX: company comes from populated job object
        setCompany(jobData?.company || null);
      } catch (err) {
        console.log("Job detail error:", err);
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const handleViewCompany = () => {
    const companyId = company?._id || job?.company?._id;
    if (!companyId) return;
    navigate(`/company/${companyId}`);
  };

  /* ================= UI STATES ================= */

  if (loading) return <div className="display-job loading">Loading...</div>;
  if (error) return <div className="display-job error">{error}</div>;
  if (!job) return <div className="display-job error">Job not found</div>;

  return (
    <section className="display-job">
      <div className="card">

        {/* HEADER */}
        <div className="header">
          <div className="logo">
            <img
              src={job?.company?.logo || "/default-logo.png"}
              alt={job.title}
            />
          </div>

          <div className="title-block">
            <h1>{job.title}</h1>
            <span className="location">
              {job?.location || "Remote"}
            </span>
          </div>
        </div>

        {/* META */}
        <div className="job-meta">
          <span className="badge">{job.jobType || "Full Time"}</span>
          <span className="badge">{job.experience || "Fresher"}</span>
          <span className="badge">{job.salary || "Not Disclosed"}</span>
        </div>

        {/* DESCRIPTION */}
        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>

          {job.extendedDescription && (
            <>
              <h3>More Details</h3>
              <p>{job.extendedDescription}</p>
            </>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">

          <button
            className="apply-btn"
            onClick={() => navigate(`/apply/${job._id}`)}
          >
            Apply Now
          </button>

          {job?.company?._id && (
            <button
              className="view-company-btn"
              onClick={handleViewCompany}
            >
              View Company
            </button>
          )}
        </div>

        {/* COMPANY INFO */}
        {job?.company && (
          <div className="company-box">
            <h3>{job.company.name}</h3>
            <p>{job.company.about || "No company info available"}</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default DisplayJob;