// ================= REGISTER.JSX =================

import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import "./styles/Register.scss";

const Register = () => {

  const navigate = useNavigate();

  // ================= REGISTER =================

  const handleRegister = (e) => {

    e.preventDefault();

    // Register Logic Here

    // DIRECT OPEN LOGIN PAGE
    navigate("/login");
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* ================= TITLE ================= */}

        <div className="register-title">

          <h2>Register Account</h2>

          <div className="register-line"></div>

        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleRegister}>

          {/* FULL NAME */}

          <div className="input-group">

            <label>Full Name</label>

            <div className="input-box">

              <input
                type="text"
                placeholder="Enter your full name"
                required
              />

              <FaUser className="input-icon" />

            </div>
          </div>

          {/* EMAIL */}

          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">

              <input
                type="email"
                placeholder="Enter your email"
                required
              />

              <FaEnvelope className="input-icon" />

            </div>
          </div>

          {/* PASSWORD */}

          <div className="input-group">

            <label>Password</label>

            <div className="input-box">

              <input
                type="password"
                placeholder="Enter your password"
                required
              />

              <FaLock className="input-icon" />

            </div>
          </div>

          {/* ONLY REGISTER BUTTON */}

          <button
            type="submit"
            className="register-btn"
          >
            Register Now
          </button>

        </form>

      </div>
    </div>
  );
};

export default Register;