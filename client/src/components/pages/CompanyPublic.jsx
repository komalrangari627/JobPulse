import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompany } from "../../context/companyContext";
import companyAPI from "../../api/companyAPI";

const CompanyPublic = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { company, loadingCompany, companyError, loadCompany } = useCompany();

  useEffect(() => {
    if (!companyId) {
      navigate("/");
      return;
    }
    loadCompany(companyId);
  }, [companyId]);

  if (loadingCompany) return <p className="text-center mt-4">Loading company...</p>;
  if (companyError) return <p className="text-center mt-4">Error loading company</p>;
  if (!company) return <p className="text-center mt-4">Company not found</p>;

  const jobs = Array.isArray(company.createdJobs) ? company.createdJobs : company.jobs ?? [];

  return (
    <div className="content-container max-w-4xl mx-auto py-8">
      <div className="company-header mb-6">
        <h1 className="text-3xl font-bold">{company.companyDetails?.name || company.name}</h1>
        <p className="text-sm opacity-80">{company.companyDetails?.industry}</p>
        <p className="mt-2">{company.companyDetails?.bio || company.about || ""}</p>
      </div>

      <div className="company-jobs mt-8">
        <h2 className="text-2xl font-semibold mb-4">Open roles</h2>
        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <div className="grid gap-4">
            {jobs.map((j) => (
              <div key={j._id || j.id} className="card p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{j.title ?? j.jobTitle}</h3>
                  <p className="text-sm">{j.jobRequirements?.location ?? j.location ?? "Remote"}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => navigate(`/job/${j._id || j.id}`)} className="btn btn-ghost">
                    View Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPublic;
