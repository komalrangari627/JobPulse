import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyForJob } from "../../api/jobAPI";
import { useUser } from "../../context/userContext.jsx";
import "../sections/styles/display-job.scss";

const JobDisplay = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser() || {};

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getJobById(jobId);
        const jobObj = data?.job ?? data ?? null;
        if (mounted) setJob(jobObj);
      } catch (err) {
        console.error("Error fetching job:", err);
        if (mounted) setJob(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [jobId]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token && !user?.logedIn) {
      alert("Please login to apply");
      navigate("/user-login-register");
      return;
    }

    try {
      await applyForJob(jobId, token);
      alert("Applied successfully");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Already applied or error occurred");
    }
  };

  if (loading)
    return <p className="text-center mt-4">Loading job details...</p>;
  if (!job) return <p className="text-center mt-4">Job not found</p>;

  const company = job.jobCreatedBy;

  return (
    <div id="display-job-page">
      <div className="container">
        <div className="job-card">

          {/* HEADER */}
          <div className="company-header">
            <div className="logo">
              {company?.companyDetails?.logo && (
                <img
                  src={company.companyDetails.logo}
                  alt="logo"
                  className="h-16 w-auto object-contain"
                />
              )}
            </div>

            <div className="company-info">
              <h2>{job.title || job.jobTitle}</h2>
              <p className="company-name">
                {company?.companyDetails?.name || job.companyName || "Company"}
              </p>

              <div className="meta-tags">
                <span className="tag">
                  {job.jobRequirements?.location || job.location || "Remote"}
                </span>
                <span className="tag">
                  {job.jobRequirements?.type || "Full-time"}
                </span>
                <span className="tag">
                  {job.jobRequirements?.offeredSalary
                    ? "₹" + job.jobRequirements.offeredSalary
                    : "Salary: —"}
                </span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="section">
            <h3>Job Description</h3>
            <p>
              {job.jobRequirements?.description ?? job.description ?? "No description available."}
            </p>
          </div>

          {/* DETAILS */}
          <div className="section">
            <h3>Job Details</h3>
            <ul className="details-list">
              <li>
                <strong>Experience:</strong>{" "}
                {job.jobRequirements?.exprience || job.experience || "Not specified"}
              </li>
              <li>
                <strong>Job Type:</strong> {job.jobRequirements?.type || "—"}
              </li>
              <li>
                <strong>Location:</strong> {job.jobRequirements?.location || "—"}
              </li>
              <li>
                <strong>Salary:</strong>{" "}
                {job.jobRequirements?.offeredSalary
                  ? "₹" + job.jobRequirements.offeredSalary
                  : "—"}
              </li>
            </ul>
          </div>

          {/* ACTION BUTTONS */}
          <div className="button-group">
            <button onClick={handleApply} className="apply-btn">
              Apply Now
            </button>

            <button
              onClick={() =>
                navigate(`/company/${company?._id || job.companyId || ""}`)
              }
              className="view-company-btn"
            >
              View Company
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDisplay;
