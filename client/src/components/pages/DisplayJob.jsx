import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyForJob } from "../../api/jobAPI";
import { useUser } from "../../context/userContext.jsx";

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

  if (loading) return <p className="text-center mt-4">Loading job details...</p>;
  if (!job) return <p className="text-center mt-4">Job not found</p>;

  return (
    <div className="job-view p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{job.title || job.jobTitle}</h2>
      <h3 className="text-lg mb-1">
        {job.jobCreatedBy?.companyDetails?.name || job.companyName || "Company"}
      </h3>

      <p>
        <strong>Location:</strong>{" "}
        {job.jobRequirements?.location || job.location || "Remote"}
      </p>

      <p>
        <strong>Salary:</strong>{" "}
        {job.jobRequirements?.offeredSalary ?? job.salary ?? "Not specified"}
      </p>

      <p>
        <strong>Type:</strong> {job.jobRequirements?.type ?? "—"}
      </p>

      <p>
        <strong>Experience:</strong> {job.jobRequirements?.exprience ?? job.experience ?? "—"}
      </p>

      <h4 className="mt-4 font-semibold">Description</h4>
      <p>{job.jobRequirements?.description ?? job.description}</p>

      <div className="mt-6 flex gap-3">
        <button onClick={handleApply} className="btn btn-primary">
          Apply Now
        </button>

        <button
          onClick={() =>
            navigate(`/company/${job.jobCreatedBy?._id || job.companyId || ""}`)
          }
          className="btn btn-ghost"
        >
          View Company
        </button>
      </div>
    </div>
  );
};

export default JobDisplay;
