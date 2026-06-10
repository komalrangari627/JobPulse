import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../api/axios";
import "../styles/company-page.scss";

const CompanyPage = () => {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH SINGLE COMPANY ================= */
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get(`/companies/${companyId}`);

        setCompany(data?.company || null);
      } catch (err) {
        console.error("Company fetch error:", err);

        setError(
          err?.response?.data?.message ||
          "Unable to load company details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompany();
  }, [companyId]);

  /* ================= LOADING ================= */
  if (loading) {
    return <div className="company-page loading">Loading...</div>;
  }

  /* ================= ERROR ================= */
  if (error) {
    return <div className="company-page error">{error}</div>;
  }

  /* ================= NOT FOUND ================= */
  if (!company) {
    return <div className="company-page error">Company not found</div>;
  }

  /* ================= UI ================= */
  return (
    <section className="company-page">
      <div className="company-card">

        <div className="header">
          {company.logo && (
            <img
              src={company.logo}
              alt={company.name}
              className="company-logo"
            />
          )}

          <div className="company-header-info">
            <h1>{company.name}</h1>

            <div className="badges">
              {company.industry && <span>{company.industry}</span>}
              {company.location && <span>{company.location}</span>}
              {company.founded && <span>Founded {company.founded}</span>}
              {company.employees && (
                <span>{company.employees} Employees</span>
              )}
            </div>
          </div>
        </div>

        {company.description && (
          <p className="about">{company.description}</p>
        )}

        {company.extendedDescription && (
          <div className="section">
            <h3>About the Company</h3>
            <p>{company.extendedDescription}</p>
          </div>
        )}

        {company.internshipDetails && (
          <div className="section">
            <h3>Internship Details</h3>
            <p>{company.internshipDetails}</p>
          </div>
        )}

        {company.offers && (
          <div className="section">
            <h3>What We Offer</h3>
            <p>{company.offers}</p>
          </div>
        )}

        {company.crackSyllabus && (
          <div className="section">
            <h3>Crack Syllabus</h3>
            <p>{company.crackSyllabus}</p>
          </div>
        )}

        {company.interviewProcess && (
          <div className="section">
            <h3>Interview Process</h3>
            <p>{company.interviewProcess}</p>
          </div>
        )}

        {company.resumeTips && (
          <div className="section">
            <h3>Resume Tips</h3>
            <p>{company.resumeTips}</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default CompanyPage;