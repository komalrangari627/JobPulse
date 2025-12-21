import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../sections/styles/display-job.scss";

const DisplayJob = () => {
  const { jobId } = useParams();

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

        const res = await axios.get(
          `http://localhost:5012/api/jobs/job-detail/${jobId}`
        );

        // ✅ Works for both Mongo & static responses
        setJob(res.data.job || null);
        setCompany(res.data.company || null);

      } catch (err) {
        console.error("Job fetch error:", err);
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  /* ================= UI STATES ================= */

  if (loading) {
    return <div className="display-job loading">Loading job details...</div>;
  }

  if (error) {
    return <div className="display-job error">{error}</div>;
  }

  if (!job) {
    return <div className="display-job error">Job not found.</div>;
  }

  /* ================= MAIN UI ================= */

  return (
    <section className="display-job">
      {/* Job Header */}
      <div className="job-header">
        <h1>{job.title}</h1>
        <span className="location">
          {job.jobRequirements?.location || job.location}
        </span>
      </div>

      {/* Job Meta */}
      <div className="job-meta">
        <span>
          💼 {job.jobType || "Full Time"}
        </span>
        <span>
          ⏳ {job.jobRequirements?.experience || job.experience}
        </span>
        <span>
          💰 {job.jobRequirements?.offeredSalary || job.salary}
        </span>
      </div>

      {/* Job Description */}
      <div className="job-description">
        <h3>Job Description</h3>
        <p>{job.description}</p>
      </div>

      {/* Company Info */}
      {company && (
        <div className="company-box">
          <h3>{company.companyDetails?.name || company.companyName}</h3>
          <p>{company.companyDetails?.about}</p>

          {company.companyDetails?.industry && (
            <span className="industry">
              Industry: {company.companyDetails.industry}
            </span>
          )}
        </div>
      )}
    </section>
  );
};

export default DisplayJob;
