import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobPage = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsRes, companiesRes, infoRes] = await Promise.all([
          axios.get("/jobs.json"),
          axios.get("/companies.json"),
          axios.get("/jobCompanyInfo.json"),
        ]);

        const jobs = Array.isArray(jobsRes.data)
          ? jobsRes.data
          : jobsRes.data.jobs || [];

        const companies = Array.isArray(companiesRes.data)
          ? companiesRes.data
          : companiesRes.data.companies || [];

        const infos = Array.isArray(infoRes.data)
          ? infoRes.data
          : infoRes.data.jobCompanyInfo || [];

        const foundJob = jobs.find(j => j._id?.$oid === id);
        setJob(foundJob || null);

        const foundCompany = companies.find(
          c => c.companyName === foundJob?.company
        );
        setCompany(foundCompany || null);

        const foundInfo = infos.find(
          i => i.jobId?.$oid === id
        );
        setExtraInfo(foundInfo || null);

      } catch (err) {
        console.error("JobPage load error:", err);
      }
    };

    loadData();
  }, [id]);

  if (!job) return <div>Loading...</div>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>

      {company && (
        <>
          <h3>Company</h3>
          <p>{company.companyName}</p>
        </>
      )}

      {extraInfo && (
        <>
          <h3>Highlights</h3>
          <ul>
            {extraInfo.jobHighlights?.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default JobPage;
