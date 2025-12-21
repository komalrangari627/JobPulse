import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./job-page.scss";

const JobPage = () => {
  const { jobId } = useParams();
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
      <h1>{job.title}</h1>
      <p className="company">{job.companyName}</p>

      <div className="details">
        <span>{job.location}</span>
        <span>{job.experience}</span>
        <span>{job.salary}</span>
      </div>

      <article>{job.description}</article>

      <button className="apply-btn">Apply Now</button>
    </section>
  );
};

export default JobPage;
