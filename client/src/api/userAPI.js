import API from "../api/axios";

/* REGISTER */
export const requestUserRegister = async (data) => {
  const res = await API.post("/users/register", {
    fullname: data.fullname?.trim(),
    email: data.email?.trim(),
    password: data.password?.trim(),
  });

  return res.data;
};

/* VERIFY OTP */
export const requestUserEmailOtpVerification = async (email, userOtp) => {
  const res = await API.post("/users/verify-otp", {
    email: email.trim(),
    userOtp: userOtp.trim(),
  });

  return res.data;
};

/* LOGIN */
export const requestUserLogin = async (email) => {
  const response = await API.post("/users/login", {
    email: email.trim(),
  });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

/* PROFILE */
export const requestUserProfile = async (token) => {
  const res = await API.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* PROFILE PICTURE */
export const userProfilePicture = async (token, formData) => {
  const res = await API.post(
    "/users/upload-file/profile_picture",
    formData,
    {
      headers: { Authorization: token },
    }
  );

  return res.data;
};

/* RESUME UPLOAD */
export const uploadResumeAPI = async (token, formData) => {
  const res = await API.post(
    "/users/upload-file/resume",
    formData,
    {
      headers: { Authorization: token },
    }
  );

  return res.data;
};

/* PASSWORD RESET */
export const requestOTPForPasswordReset = async (email) => {
  const res = await API.post("/users/password-reset-request", {
    email: email.trim(),
  });

  return res.data;
};

/* RESET VERIFY */
export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
  const res = await API.post("/users/verify-reset-password", {
    email: data.email.trim(),
    userOtp: data.userOtp.trim(),
    newPassword: data.newPassword.trim(),
  });

  return res.data;
};

export default {
  requestUserRegister,
  requestUserEmailOtpVerification,
  requestUserLogin,
  requestUserProfile,
  userProfilePicture,
  uploadResumeAPI,
  requestOTPForPasswordReset,
  requestUserEmailOtpVerificationPasswordReset,
};