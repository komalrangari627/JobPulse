import { useState } from "react";
import { useParams } from "react-router-dom";
import "../sections/styles/applyPage.scss";

const ApplyPage = () => {
  const { jobId } = useParams();
  const [mode, setMode] = useState(null);

  return (
    <div className="apply-page">
      <h2>Apply Internship</h2>
      <p className="subtitle">
        We provide two internship modes: Online & Offline
      </p>

      {/* Mode Buttons */}
      <div className="mode-buttons">
        <button
          className={`mode-btn ${mode === "online" ? "active" : ""}`}
          onClick={() => setMode("online")}
        >
          Online Internship
        </button>

        <button
          className={`mode-btn offline ${mode === "offline" ? "active" : ""}`}
          onClick={() => setMode("offline")}
        >
          Offline Internship
        </button>
      </div>

      {/* Online Info */}
      {mode === "online" && (
        <div className="info-box">
          <p>
            If you choose <b>Online Internship</b>, upload your resume and
            start your interview online. After submission, we will review
            and send interview timing (today or tomorrow).
          </p>

          <button className="start-btn">
            Start Interview
          </button>
        </div>
      )}

      {/* Offline Info */}
      {mode === "offline" && (
        <div className="info-box">
          <p>
            For <b>Offline Internship</b>, you will receive an email with:
          </p>
          <ul>
            <li>Company location & address</li>
            <li>Visiting date & time</li>
            <li>Syllabus for crack round</li>
            <li>Other instructions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;
