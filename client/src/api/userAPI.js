import axios from "axios";

// Full backend URL for users
const API_ROOT = "http://localhost:5012/api/users"; // only ONE /users

/* =========================
   REGISTER USER
========================= */
export const requestUserRegister = async (data) => {
  try {
    const trimmedData = {
      ...data,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      street: data.street.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      country: data.country.trim(),
      pincode: data.pincode.toString().trim(),
      password: data.password.trim(),
    };

    const result = await axios.post(`${API_ROOT}/register`, trimmedData);
    return result;
  } catch (err) {
    throw err;
  }
};

/* =========================
   VERIFY EMAIL OTP
========================= */
export const requestUserEmailOtpVerification = async (email, userOtp) => {
  try {
    const result = await axios.post(`${API_ROOT}/verify-otp`, {
      email: email.trim(),
      userOtp: userOtp.trim()
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* =========================
   LOGIN USER
========================= */
export const requestUserLogin = async ({ email, password }) => {
  try {
    const result = await axios.post(`${API_ROOT}/user-login`, {
      email,
      password, // ✅ password explicitly sent
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* =========================
   FETCH USER PROFILE
========================= */
export const requestUserProfile = async (token) => {
  try {
    const result = await axios.get(`${API_ROOT}/fetch-user-profile`, {
      headers: { authorization: token },
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* =========================
   UPLOAD PROFILE PICTURE
========================= */
export const userProfilePicture = async (token, formData) => {
  try {
    const result = await axios.post(
      `${API_ROOT}/upload-file/profile_picture`,
      formData,
      { headers: { authorization: token } }
    );
    return result.data;
  } catch (err) {
    throw err;
  }
};

/* =========================
   PASSWORD RESET REQUEST
========================= */
export const requestOTPForPasswordReset = async (email) => {
  try {
    const result = await axios.post(`${API_ROOT}/password-reset-request`, {
      email: email.trim()
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* =========================
   VERIFY OTP & RESET PASSWORD
========================= */
export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
  try {
    const trimmedData = {
      email: data.email.trim(),
      userOtp: data.userOtp.trim(),
      newPassword: data.newPassword.trim()
    };
    const result = await axios.post(`${API_ROOT}/verify-reset-password-request`, trimmedData);
    return result;
  } catch (err) {
    throw err;
  }
};

/* =========================
   UPLOAD RESUME
========================= */
export const uploadResumeAPI = async (token, formData) => {
  try {
    const result = await axios.post(`${API_ROOT}/upload-file/resume`, formData, {
      headers: { authorization: token },
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

/* =========================
   UPLOAD BIO
========================= */
export const uploadBIO = async (token, newBio) => {
  try {
    const result = await axios.post(`${API_ROOT}/upload-new-bio`, newBio, {
      headers: { authorization: token },
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

/* =========================
   DELETE RESUME
========================= */
export const deleteResume = async (token) => {
  try {
    const result = await axios.delete(`${API_ROOT}/delete-resume`, {
      headers: { authorization: token },
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* =========================
   EXPORT ALL
========================= */
const userAPI = {
  requestUserRegister,
  requestUserEmailOtpVerification,
  requestUserLogin,
  requestUserProfile,
  userProfilePicture,
  uploadResumeAPI,
  requestOTPForPasswordReset,
  requestUserEmailOtpVerificationPasswordReset,
  uploadBIO,
  deleteResume,
};

export default userAPI;
