import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/company-page.scss";

const CompanyPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/companies/${companyId}`
      );
      setCompany(res.data);
    };

    fetchCompany();
  }, [companyId]);

  if (!company) return <p>Loading...</p>;

  return (
    <section className="company-page">
      <div className="header">
          <div className="logo">
            <img src={job.logo} alt={job.title} />
          </div>
      <div className="company-description">
          <h3>comapany.Description</h3>
          <p>{company.description}</p>

          <h3>More Details</h3>
          <p>{company.extendedDescription}</p>
        </div>
        </div>

      <div className="info-box">
        <h3>What We Offer</h3>
        <p>{company.offers}</p>
      </div>

      <div className="info-box">
        <h3>Internship Details</h3>
        <p>{company.internshipDetails}</p>
      </div>

      <div className="info-box">
        <h3>Interview & Preparation</h3>
        <p>{company.interviewProcess}</p>
        <p><strong>Resume Wants:</strong> {company.resumeTips}</p>
        <p><strong>Crack Syllabus:</strong> {company.crackSyllabus}</p>
      </div>
    </section>
  );
};

export default CompanyPage;
