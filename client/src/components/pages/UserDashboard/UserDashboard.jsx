import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaChartLine,
  FaCheckCircle,
  FaBrain,
  FaHome,
} from "react-icons/fa";

import "./userDashboard.scss";

const UserDashboard = () => {

  const navigate = useNavigate();

  const progressData = JSON.parse(
    localStorage.getItem(
      "jobpulse_interview_progress"
    )
  );

  const userData = JSON.parse(
    localStorage.getItem("jobpulse_user")
  );

  return (
    <div className="dashboard-page">

      <div className="dashboard-card">

        {/* HOME BUTTON */}

        <button
          className="home-btn"
          onClick={() => navigate("/")}
        >
          <FaHome />
          Home
        </button>

        {/* USER */}

        <div className="user-section">

          <div className="user-icon">

            {userData?.fullname
              ? userData.fullname
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>

          <div>

            <h2>
              {userData?.fullname ||
                "JobPulse User"}
            </h2>

            <p>
              AI Interview Dashboard
            </p>

          </div>

        </div>

        {/* TITLE */}

        <div className="dashboard-title">

          <FaChartLine />

          Interview Progress Overview

        </div>

        {/* STATS */}

        <div className="dashboard-stats">

          <div className="progress-box">

            <FaCheckCircle />

            <h3>
              {progressData?.progress || 0}%
            </h3>

            <span>
              Interview Completed
            </span>

          </div>

          <div className="progress-box">

            <FaBrain />

            <h3>
              {progressData?.totalRounds || 0}
            </h3>

            <span>Total Rounds</span>

          </div>

          <div className="progress-box">

            <FaChartLine />

            <h3>
              {progressData?.answeredQuestions ||
                0}
            </h3>

            <span>
              Answered Questions
            </span>

          </div>

        </div>

        {/* FINAL STATUS */}

        <div className="final-status">

           Congratulations!
          Your AI interview has been completed successfully.

        </div>

      </div>

    </div>
  );
};

export default UserDashboard;