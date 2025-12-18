import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../../api/jobAPI";
import "../sections/styles/company-public.scss";

const CompanyPublic = () => {
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const company = companies.find(c => c._id === companyId);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId, { signal: controller.signal });
        setJob(data);
      } catch (err) {
        console.error("Job load failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();

    return () => controller.abort();
  }, [jobId]);

  if (!company) return <p className="error">Company not found</p>;
  if (loading) return <p className="loading">Loading...</p>;
  if (!job) return <p className="error">Job not found</p>;

  return (
    <section className="company-public">
      {/* COMPANY HEADER */}
      <header className="company-header">
        <img src={company.logo} alt={company.name} />
        <div>
          <h1>{company.name}</h1>
          <p className="industry">{company.industry}</p>
          <p className="location">{company.location}</p>
        </div>
      </header>

      {/* COMPANY INFO */}
      <div className="company-info">
        <h2>About Company</h2>
        <p>{company.description}</p>

        <div className="stats">
          <span><b>Founded:</b> {company.founded}</span>
          <span><b>Employees:</b> {company.employees}</span>
        </div>
      </div>

      {/* JOB DETAIL */}
      <div className="job-detail">
        <h2>{job.title}</h2>

        <ul className="job-meta">
          <li><b>Experience:</b> {job.experience}</li>
          <li><b>Salary:</b> {job.salary}</li>
          <li><b>Location:</b> {job.location}</li>
          <li><b>Type:</b> {job.jobType}</li>
        </ul>

        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        <button className="apply-btn">Apply Now</button>
      </div>
    </section>
  );
};

export default CompanyPublic;
