// ================= USERAPI.JS =================

import axios from "axios";

/* =========================================
   BASE API
========================================= */

const API_ROOT =
  "http://localhost:5012/api/users";

/* =========================================
   REGISTER USER
   New Register Form:
   - fullname
   - email
   - password
========================================= */

export const requestUserRegister =
  async (data) => {

    try {

      const trimmedData = {

        fullname:
          data.fullname?.trim(),

        email:
          data.email?.trim(),

        password:
          data.password?.trim(),
      };

      const result = await axios.post(
        `${API_ROOT}/register`,
        trimmedData
      );

      return result.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   VERIFY EMAIL OTP
========================================= */

export const requestUserEmailOtpVerification =
  async (email, userOtp) => {

    try {

      const result = await axios.post(
        `${API_ROOT}/verify-otp`,
        {
          email: email.trim(),
          userOtp: userOtp.trim(),
        }
      );

      return result.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   LOGIN USER
   New Login Page:
   - only email
========================================= */

export const requestUserLogin =
  async (email) => {

    try {

      const response = await axios.post(
        `${API_ROOT}/login`,
        {
          email: email.trim(),
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      /* SAVE TOKEN */

      if (response.data?.token) {

        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      return response.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   FETCH USER PROFILE
========================================= */

export const requestUserProfile =
  async (token) => {

    try {

      const result = await axios.get(
        `${API_ROOT}/profile`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      return result.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   UPLOAD PROFILE PICTURE
========================================= */

export const userProfilePicture =
  async (token, formData) => {

    try {

      const result = await axios.post(
        `${API_ROOT}/upload-file/profile_picture`,
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      return result.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   UPLOAD RESUME
========================================= */

export const uploadResumeAPI =
  async (token, formData) => {

    try {

      const result = await axios.post(
        `${API_ROOT}/upload-file/resume`,
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      return result.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   PASSWORD RESET REQUEST
========================================= */

export const requestOTPForPasswordReset =
  async (email) => {

    try {

      const result = await axios.post(
        `${API_ROOT}/password-reset-request`,
        {
          email: email.trim(),
        }
      );

      return result.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   VERIFY RESET OTP
========================================= */

export const requestUserEmailOtpVerificationPasswordReset =
  async (data) => {

    try {

      const trimmedData = {

        email:
          data.email.trim(),

        userOtp:
          data.userOtp.trim(),

        newPassword:
          data.newPassword.trim(),
      };

      const result = await axios.post(
        `${API_ROOT}/verify-reset-password`,
        trimmedData
      );

      return result.data;

    } catch (err) {

      throw err;
    }
  };

/* =========================================
   EXPORT ALL
========================================= */

const userAPI = {

  requestUserRegister,

  requestUserEmailOtpVerification,

  requestUserLogin,

  requestUserProfile,

  userProfilePicture,

  uploadResumeAPI,

  requestOTPForPasswordReset,

  requestUserEmailOtpVerificationPasswordReset,
};

export default userAPI;