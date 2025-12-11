import React from "react";
import "../styles/job-grid.scss";
import { useJobs } from "../../../context/jobContext";
import { useNavigate } from "react-router-dom";
import jobAPI from "../../../api/jobAPI";
import { useUser } from "../../../context/userContext.jsx"; 

const JobsGrid = () => {
  const navigate = useNavigate();
  const { jobs = [], loading, error, refreshJobs } = useJobs() || {};
  const { user } = useUser() || {}; 

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to apply");
      navigate("/user-login-register");
      return;
    }

    try {
      await jobAPI.applyForJob(jobId, token);
      alert("Applied successfully");
      if (refreshJobs) refreshJobs();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Already applied or error occurred");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading jobs...</p>;
  if (error) return <p className="text-center mt-4">Error loading jobs</p>;
  if (!Array.isArray(jobs) || jobs.length === 0)
    return <p className="text-center mt-4">No jobs available</p>;

  return (
    <div id="job-grid">
      <div className="content-container">
        <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id || job.id} className="job card p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">{job.title || job.jobTitle || "Untitled"}</h3>
                <p className="text-sm mb-1">
                  <strong>Company:</strong>{" "}
                  {job.jobCreatedBy?.companyDetails?.name ||
                    job.companyName ||
                    "Unknown Company"}
                </p>
                <p className="text-sm mb-1">
                  <strong>Location:</strong>{" "}
                  {job.jobRequirements?.location || job.location || "Remote"}
                </p>
                <p className="text-sm mb-2">
                  <strong>Salary:</strong>{" "}
                  {job.jobRequirements?.offeredSalary ?? job.salary ?? "Not specified"}
                </p>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  className="btn btn-primary flex-1"
                  onClick={() => navigate(`/job/${job._id || job.id}`)}
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsGrid;
