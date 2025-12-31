import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../sections/styles/applyPage.scss";

const ApplyPage = () => {
  const { jobId } = useParams(); // Get jobId from URL
  const navigate = useNavigate();

  const [mode, setMode] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalMode, setFinalMode] = useState(null);

  const startInterview = () => {
    navigate(`/online-interview/${jobId}/quiz`);
  };

  // 🔹 Offline email trigger
  const sendOfflineEmail = () => {
    console.log("📧 Sending offline internship email for job:", jobId);
    alert("Offline internship details sent to your email.");
    setShowConfirm(false);
  };

  return (
    <div className="apply-page">
      <h2>Apply Internship</h2>
      <p className="subtitle">
        We provide two internship modes: Online & Offline
      </p>

      {/* ================= Mode Selection ================= */}
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

      {/* ================= Info Before Confirm ================= */}
      {mode === "online" && (
        <div className="info-box">
          <p>
            If you choose <b>Online Internship</b>, upload your resume and
            start your interview online. After submission, we will review
            and send interview timing (today or tomorrow).
          </p>
        </div>
      )}

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

      {/* ================= Confirm Button ================= */}
      {mode && (
        <button
          className="confirm-btn"
          onClick={() => setShowConfirm(true)}
        >
          Confirm
        </button>
      )}

      {/* ================= Confirmation Modal ================= */}
      {showConfirm && (
        <div className="confirm-modal">
          <div className="modal-box">
            <h3>Confirm Internship Mode</h3>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setFinalMode("online");
                  setShowConfirm(false);
                }}
              >
                Online
              </button>

              <button
                className="offline"
                onClick={() => {
                  setFinalMode("offline");
                  sendOfflineEmail();
                }}
              >
                Offline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Final Result ================= */}
      {finalMode === "online" && (
        <div className="info-box">
          <p>
            You selected <b>Online Internship</b>. Upload resume and
            start your interview.
          </p>

          <button className="start-btn" onClick={startInterview}>
            🚀 Start Online Interview
          </button>
        </div>
      )}

      {finalMode === "offline" && (
        <div className="info-box">
          <p>
            Offline internship selected. Check your email for:
          </p>
          <ul>
            <li>Company location</li>
            <li>Visit date & time</li>
            <li>Syllabus</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;
