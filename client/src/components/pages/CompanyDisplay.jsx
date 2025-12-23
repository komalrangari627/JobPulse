import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../sections/styles/display-job.scss";

const CompanyDisplay = () => {
  const { companyId } = useParams();
  const navigate = useNavigate(); // MUST be inside component

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5012/api/companies/company-detail/${companyId}`
        );

        setCompany(res.data.company || res.data || null);
      } catch (err) {
        setError("Unable to load company details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [companyId]);

  /* ================= HANDLERS ================= */

  const handleBack = () => {
    navigate(-1);
  };

  /* ================= UI STATES ================= */

  if (loading)
    return <div className="display-job loading">Loading...</div>;

  if (error)
    return <div className="display-job error">{error}</div>;

  if (!company)
    return <div className="display-job error">Company not found</div>;

  /* ================= UI ================= */

  return (
    <section className="display-job">
      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="logo">
            <img
              src={company.logo}
              alt={company.companyName}
            />
          </div>
          <div className="title-block">
            <h1>{company.companyDetails?.name || company.companyName}</h1>
            <span className="location">
              {company.companyDetails?.location || company.location}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="job-meta">
          <span className="badge">
            {company.companyDetails?.industry || "IT Services"}
          </span>
          <span className="badge">
            {company.companyDetails?.size || "50–200 Employees"}
          </span>
          <span className="badge">
            {company.companyDetails?.type || "Product Based"}
          </span>
        </div>

        {/* Description */}
        <div className="job-description">
          <h3>About Company</h3>
          <p>{company.companyDetails?.about}</p>

          <h3>What We Offer</h3>
          <p>{company.companyDetails?.offers}</p>

          <h3>Interview Process</h3>
          <p>{company.companyDetails?.interviewProcess}</p>

          <h3>Resume Expectations</h3>
          <p>{company.companyDetails?.resumeTips}</p>

          <h3>Crack Syllabus</h3>
          <p>{company.companyDetails?.crackSyllabus}</p>
        </div>

        {/* Buttons */}
        <div className="action-buttons">
          <button className="company-btn" onClick={handleBack}>
            Back to Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default CompanyDisplay;
