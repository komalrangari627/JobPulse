import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DisplayJob = () => {
  const { id } = useParams();

  const [jobData, setJobData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [jobsRes, companiesRes, infoRes] = await Promise.all([
          axios.get("/jobs.json"),
          axios.get("/companies.json"),
          axios.get("/jobCompanyInfo.json"),
        ]);

        //  unwrap arrays safely
        const jobs = Array.isArray(jobsRes.data)
          ? jobsRes.data
          : jobsRes.data.jobs || [];

        const companies = Array.isArray(companiesRes.data)
          ? companiesRes.data
          : companiesRes.data.companies || [];

        const infos = Array.isArray(infoRes.data)
          ? infoRes.data
          : infoRes.data.jobCompanyInfo || [];

        // 1️ Job
        const job = jobs.find(j => j._id?.$oid === id);
        setJobData(job || null);

        // 2️ Company
        const company = companies.find(
          c => c.companyName === job?.company
        );
        setCompanyData(company || null);

        // 3️ Extra info
        const info = infos.find(
          i => i.jobId?.$oid === id
        );
        setExtraInfo(info || null);

      } catch (err) {
        console.error("Data load error:", err);
      }
    };

    fetchAllData();
  }, [id]);

  if (!jobData) return <div>Loading job...</div>;

  return (
    <div className="job-card">
      <h2>{jobData.title}</h2>
      <p>{jobData.description}</p>
      <p><strong>Location:</strong> {jobData.location}</p>
      <p><strong>Salary:</strong> {jobData.salary}</p>

      {companyData && (
        <div>
          <h3>Company</h3>
          <p>{companyData.companyName}</p>
          <p>{companyData.website}</p>
        </div>
      )}

      {extraInfo && (
        <div>
          <h3>Role Details</h3>
          <p><strong>Experience:</strong> {extraInfo.experience}</p>

          <h4>Tech Stack</h4>
          {extraInfo.techStack?.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayJob;
