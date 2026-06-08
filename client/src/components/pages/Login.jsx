import React, { useState } from "react";

import "../sections/styles/Login.scss";

import {
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import {
  useUser,
} from "../../context/userContext";

import API from "../../api/axios";

const loginUser = async (data) => {
  try {
    const res = await API.post("/api/users/login", data);
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};

const UserLoginRegisterForm = () => {

  // ================= HOOKS =================

  const navigate = useNavigate();

  const { setUser } =
    useUser();

  // ================= STATES =================

  const [email, setEmail] =
    useState("");

  const [agree, setAgree] =
    useState(false);

  // ================= LOGIN =================

  const handleLogin = (e) => {

    e.preventDefault();

    if (!agree) {

      alert(
        "Please accept agreement"
      );

      return;
    }

    // ================= USER SAVE =================

    const loggedUser = {

      fullname: email
        .split("@")[0],

      email: email,

      logedIn: true,

    };

    // SAVE IN CONTEXT

    setUser(loggedUser);

    // SAVE IN LOCAL STORAGE

    localStorage.setItem(
      "jobpulse_user",
      JSON.stringify(loggedUser)
    );

    // ================= SUCCESS =================

    alert(
      "Login Successful"
    );

    // ================= REDIRECT =================

    navigate("/");
  };

  return (

    <div className="modern-login-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="login-left">

        <div className="overlay"></div>

        <div className="left-content">

          <span className="small-tag">
            AI Powered Job Portal
          </span>

          <h1>
            Build Your Career
            <br />
            With JobPulse
          </h1>

          <p>
            Find internships,
            AI interviews,
            and career opportunities
            in one powerful platform.
          </p>

        </div>

      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="login-right">

        <div className="login-card">

          <div className="top-badge">
            Welcome Back
          </div>

          <h2>
            Login Account
          </h2>

          <p className="login-desc">
            Continue your internship
            journey with secure
            email access.
          </p>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleLogin}
          >

            {/* ================= EMAIL ================= */}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-box">

                <FaEnvelope
                  className="input-icon"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

            {/* ================= AGREEMENT ================= */}

            <div className="agreement-box">

              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={() =>
                  setAgree(!agree)
                }
              />

              <label htmlFor="agree">

                I agree to the
                platform terms,
                privacy policy
                and AI interview
                guidelines.

              </label>

            </div>

            {/* ================= BUTTON ================= */}

            <button
              type="submit"
              className="login-btn"
            >

              Continue Login

              <FaArrowRight />

            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default UserLoginRegisterForm;