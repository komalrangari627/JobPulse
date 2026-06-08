import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../api/axios";
import "../styles/company-page.scss";

const CompanyPage = () => {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ALL COMPANIES (OPTIONAL DEBUG) ================= */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get("/companies");
        console.log("All companies:", res.data);
      } catch (err) {
        console.log("Error fetching companies list:", err.message);
      }
    };

    fetchCompanies();
  }, []);

  /* ================= FETCH SINGLE COMPANY ================= */
  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/companies/${companyId}`);

        setCompany(res.data.company);
      } catch (err) {
        console.log(err.message);
        setError("Unable to load company details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
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

        {/* ===== HEADER ===== */}
        <div className="header">
          {company.logo && (
            <img
              src={company.logo}
              alt={company.name || "Company Logo"}
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

        {/* ===== DESCRIPTION ===== */}
        {company.description && (
          <p className="about">{company.description}</p>
        )}

        {/* ===== EXTENDED DESCRIPTION ===== */}
        {company.extendedDescription && (
          <div className="section">
            <h3>About the Company</h3>
            <p>{company.extendedDescription}</p>
          </div>
        )}

        {/* ===== INTERNSHIP DETAILS ===== */}
        {company.internshipDetails && (
          <div className="section">
            <h3>Internship Details</h3>
            <p>{company.internshipDetails}</p>
          </div>
        )}

        {/* ===== OFFERS ===== */}
        {company.offers && (
          <div className="section">
            <h3>What We Offer</h3>
            <p>{company.offers}</p>
          </div>
        )}

        {/* ===== CRACK SYLLABUS ===== */}
        {company.crackSyllabus && (
          <div className="section">
            <h3>Crack Syllabus</h3>
            <p>{company.crackSyllabus}</p>
          </div>
        )}

        {/* ===== INTERVIEW PROCESS ===== */}
        {company.interviewProcess && (
          <div className="section">
            <h3>Interview Process</h3>
            <p>{company.interviewProcess}</p>
          </div>
        )}

        {/* ===== RESUME TIPS ===== */}
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