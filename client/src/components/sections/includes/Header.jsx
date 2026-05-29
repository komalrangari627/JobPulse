import React from "react";

import "./includes.scss";

import {
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import {
  MdWorkspacesOutline,
} from "react-icons/md";

import { useNavigate } from "react-router-dom";

import { useUser }
from "../../../context/userContext.jsx";

const Header = () => {

  const { user } = useUser() || {};

  const navigate = useNavigate();

  // ================= USER NAME FIRST LETTER =================

  const userLetter =
    user?.fullname
      ? user.fullname.charAt(0).toUpperCase()
      : "U";

  return (
    <header className="new-header">

      <div className="header-container">

        {/* ================= LOGO ================= */}

        <div
          className="logo-section"
          onClick={() => navigate("/")}
        >

          <div className="logo-icon">
            <MdWorkspacesOutline />
          </div>

          <div className="logo-text">
            JOBPULSE
          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="search-section">

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search internships..."
            />

          </div>

        </div>

        {/* ================= USER SECTION ================= */}

        <div className="user-section">

          {user?.logedIn ? (

            <div className="user-profile">

              {/* USER ICON LETTER */}

              <div className="user-avatar">
                {userLetter}
              </div>

              {/* USER NAME */}

              <div className="user-name">
                {user.fullname}
              </div>

            </div>

          ) : (

            <button
              className="register-btn"
              onClick={() =>
                navigate("/register")
              }
            >
              <FaUserCircle />

              Register
            </button>

          )}

        </div>

      </div>
    </header>
  );
};

export default Header;