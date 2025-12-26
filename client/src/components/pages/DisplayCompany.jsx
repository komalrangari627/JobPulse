import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../sections/styles/display-company.scss";

const DisplayCompany = () => {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/company-detail/${companyId}`
        );
        setCompany(res.data.company);
      } catch {
        setError("Unable to load company");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (loading) return <div className="display-company loading">Loading...</div>;
  if (error) return <div className="display-company error">{error}</div>;
  if (!company)
    return <div className="display-company error">Company not found</div>;

  return (
    <section className="display-company">
      <div className="card">
        <div className="header">
          <img src={company.companyLogo} alt="logo" />
          <div>
            <h1>{company.companyDetails?.name}</h1>
            <span>{company.companyDetails?.industryType}</span>
          </div>
        </div>

        <p>{company.companyDetails?.bio}</p>
      </div>
    </section>
  );
};

export default DisplayCompany;
