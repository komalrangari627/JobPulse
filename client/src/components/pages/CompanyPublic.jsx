import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../sections/styles/company-public.scss";

const CompanyPublic = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/companies/${companyId}`
        );
        setCompany(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (!company) return <div className="company-loading">Loading...</div>;

  return (
    <section className="company-public">
      <header>
        <img src={company.companyDetails?.logo} alt="" />
        <div>
          <h1>{company.companyName}</h1>
          <span>{company.companyDetails?.industry}</span>
        </div>
      </header>

      <div className="about">
        <h2>About Company</h2>
        <p>{company.companyDetails?.about}</p>
      </div>

      <div className="stats">
        <span>Founded: {company.companyDetails?.founded}</span>
        <span>Employees: {company.companyDetails?.employees}</span>
      </div>
    </section>
  );
};

export default CompanyPublic;
