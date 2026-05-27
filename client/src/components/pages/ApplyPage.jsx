import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaLaptopCode,
  FaBuilding,
  FaRocket,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaBookOpen,
  FaTimes,
} from "react-icons/fa";

import "../sections/styles/applyPage.scss";

const ApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalMode, setFinalMode] = useState(null);

  const startInterview = () => {
    navigate(`/online-interview/${jobId}/quiz`);
  };

  // ================= OFFLINE EMAIL =================

  const sendOfflineEmail = () => {
    console.log("📧 Sending offline internship email for job:", jobId);

    alert(
      "Offline internship details sent successfully to your email."
    );

    setShowConfirm(false);
  };

  return (
    <div className="apply-page">

      {/* ================= HERO SECTION ================= */}

      <div className="hero-section">
        <div className="hero-badge">
          Internship Application Portal
        </div>

        <h2>Choose Your Internship Mode</h2>

        <p className="subtitle">
          Start your professional journey with online or offline
          internship opportunities.
        </p>
      </div>

      {/* ================= MODE CARDS ================= */}

      <div className="mode-buttons">

        {/* ONLINE CARD */}

        <div
          className={`mode-btn ${
            mode === "online" ? "active" : ""
          }`}
          onClick={() => setMode("online")}
        >
          <div className="icon">
            <FaLaptopCode />
          </div>

          <h3>Online Internship</h3>

          <p>
            Attend interview remotely and complete internship
            virtually from anywhere.
          </p>

          <span className="tag">Remote Mode</span>
        </div>

        {/* OFFLINE CARD */}

        <div
          className={`mode-btn offline ${
            mode === "offline" ? "active" : ""
          }`}
          onClick={() => setMode("offline")}
        >
          <div className="icon">
            <FaBuilding />
          </div>

          <h3>Offline Internship</h3>

          <p>
            Visit company office, attend rounds physically,
            and work onsite.
          </p>

          <span className="tag">Onsite Mode</span>
        </div>
      </div>

      {/* ================= INFO BOX ================= */}

      {mode === "online" && (
        <div className="info-box">

          <h3>
            <FaLaptopCode /> Online Internship Process
          </h3>

          <ul>
            <li>
              <FaCheckCircle /> Upload your updated resume
            </li>

            <li>
              <FaCheckCircle /> Start online aptitude/interview
            </li>

            <li>
              <FaCheckCircle /> Interview timing shared via email
            </li>

            <li>
              <FaCheckCircle /> Work remotely from home
            </li>
          </ul>

          <button
            className="confirm-btn"
            onClick={() => setShowConfirm(true)}
          >
            Continue Application
          </button>
        </div>
      )}

      {mode === "offline" && (
        <div className="info-box">

          <h3>
            <FaBuilding /> Offline Internship Details
          </h3>

          <ul>
            <li>
              <FaMapMarkerAlt /> Company office address
            </li>

            <li>
              <FaClock /> Visit schedule & interview timing
            </li>

            <li>
              <FaBookOpen /> Syllabus & preparation material
            </li>

            <li>
              <FaCheckCircle /> Additional instructions
            </li>
          </ul>

          <button
            className="confirm-btn"
            onClick={() => setShowConfirm(true)}
          >
            Continue Application
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}

      {showConfirm && (
        <div className="confirm-modal">

          <div className="modal-box">

            <button
              className="modal-close"
              onClick={() => setShowConfirm(false)}
            >
              <FaTimes />
            </button>

            <h3>Confirm Your Internship Mode</h3>

            <p>
              Please verify your selected internship mode
              before continuing.
            </p>

            <div className="modal-actions">

              {/* ONLINE */}

              <button
                onClick={() => {
                  setFinalMode("online");
                  setShowConfirm(false);
                }}
              >
                <FaLaptopCode />
                Online
              </button>

              {/* OFFLINE */}

              <button
                className="offline"
                onClick={() => {
                  setFinalMode("offline");
                  sendOfflineEmail();
                }}
              >
                <FaBuilding />
                Offline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FINAL RESULT ================= */}

      {finalMode === "online" && (
        <div className="info-box success-box">

          <div className="success-icon">
            <FaRocket />
          </div>

          <h3>Online Internship Selected</h3>

          <p>
            Upload your resume and begin your online interview
            process now.
          </p>

          <button
            className="start-btn"
            onClick={startInterview}
          >
            🚀 Start Online Interview
          </button>
        </div>
      )}

      {finalMode === "offline" && (
        <div className="info-box success-box">

          <div className="success-icon">
            <FaCheckCircle />
          </div>

          <h3>Offline Internship Selected</h3>

          <p>
            Check your email for internship location,
            schedule, syllabus, and instructions.
          </p>

          <ul>
            <li>Company office location</li>
            <li>Interview date & timing</li>
            <li>Selection round syllabus</li>
            <li>Required documents</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;