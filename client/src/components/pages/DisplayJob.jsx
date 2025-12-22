import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../sections/styles/display-job.scss";

const DisplayJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate(); //  MUST be inside component

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5012/api/jobs/job-detail/${jobId}`
        );

        setJob(res.data.job || null);
        setCompany(res.data.company || null);
      } catch (err) {
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  /* ================= HANDLERS ================= */

  const handleApply = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      alert(
        "Please login first.\nIf you are not registered, please register and login."
      );
      navigate("/user-login-register");
      return;
    }

    alert("Application submitted successfully!");
  };

  const handleViewCompany = () => {
    if (!company?._id) return;
    navigate(`/company/${company._id}`);
  };

  /* ================= UI STATES ================= */

  if (loading) return <div className="display-job loading">Loading...</div>;
  if (error) return <div className="display-job error">{error}</div>;
  if (!job) return <div className="display-job error">Job not found</div>;

  /* ================= UI ================= */

  return (
    <section className="display-job">
      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="logo">
            <img src={job.logo} alt={job.title} />
          </div>
          <div className="title-block">
            <h1>{job.title}</h1>
            <span className="location">
              {job.jobRequirements?.location || job.location}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="job-meta">
          <span className="badge"> {job.jobType || "Full Time"}</span>
          <span className="badge">
             {job.jobRequirements?.experience || job.experience}
          </span>
          <span className="badge">
             {job.jobRequirements?.offeredSalary || job.salary}
          </span>
        </div>

        {/* Description */}
        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>

          <h3>More Details</h3>
          <p>{job.extendedDescription}</p>
        </div>

        {/* Buttons */}
        <div className="action-buttons">
          <button className="apply-btn" onClick={handleApply}>
            Apply Now
          </button>

          {company && (
            <button className="company-btn" onClick={handleViewCompany}>
              View Company
            </button>
          )}
        </div>

        {/* Company Info */}
        {company && (
          <div className="company-box">
            <h3>{company.companyDetails?.name || company.companyName}</h3>
            <p>{company.companyDetails?.about}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayJob;
