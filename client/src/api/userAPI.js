import axios from "axios";

let baseUrl =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:5012/api/users";

/* REGISTER USER */
export const requestUserRegister = async (data) => {
  return axios.post(`${baseUrl}/register`, data);
};

/* VERIFY EMAIL OTP (REGISTER) */
export const requestUserEmailOtpVerification = async (email, otp) => {
  return axios.post(`${baseUrl}/verify-otp`, {
    email,
    userOtp: otp?.toString(),
  });
};

/* LOGIN USER */
export const requestUserLogin = async (data) => {
  try {
    let result = await axios.post(`${baseUrl}/user-login`, data);

    // Save token to localStorage if it exists
    if (result.data && result.data.token) {
      localStorage.setItem("token", result.data.token);
    }

    return result;
  } catch (err) {
    throw err;
  }
};

/* FETCH USER PROFILE (Auth Required) */
export const requestUserProfile = async (token) => {
  try {
    let result = await axios.get(`${baseUrl}/fetch-user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result;
  } catch (err) {
    throw err;
  }
};

/* UPLOAD PROFILE PICTURE (Auth Required) */
export const userProfilePicture = async (token, formData) => {
  try {
    const result = await axios.post(
      `${baseUrl}/upload-file/profile_picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, //  FIXED
        },
      }
    );

    return result.data;
  } catch (err) {
    throw err;
  }
};

/* UPLOAD RESUME (Auth Required)
   file_type = resume */
export const uploadResumeAPI = async (token, formData) => {
  try {
    const result = await axios.post(
      `${baseUrl}/upload-file/resume`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result.data;
  } catch (err) {
    throw err;
  }
};

/* SEND OTP FOR PASSWORD RESET*/
export const requestOTPForPasswordReset = async (email) => {
  try {
    const result = await axios.post(`${baseUrl}/password-reset-request`, {
      email,
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* VERIFY OTP & RESET PASSWORD */
export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
  try {
    const result = await axios.post(
      `${baseUrl}/verify-reset-password-request`,
      data
    );
    return result;
  } catch (err) {
    throw err;
  }
};
