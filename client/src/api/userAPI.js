import axios from "axios";

const baseUrl =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:5012/api/users";

/* Create Axios instance with automatic token handling */
const apiClient = axios.create({
  baseURL: baseUrl,
});

// Request interceptor to automatically attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* REGISTER USER */
export const requestUserRegister = async (data) => {
  const result = await apiClient.post("/register", data);
  return result.data;
};

/* VERIFY EMAIL OTP */
export const requestUserEmailOtpVerification = async (email, otp) => {
  const result = await apiClient.post("/verify-otp", {
    email,
    userOtp: otp?.toString(),
  });
  return result.data;
};

/* LOGIN USER */
export const requestUserLogin = async (data) => {
  const result = await apiClient.post("/user-login", data);
  if (result.data?.token) {
    localStorage.setItem("token", result.data.token); // Store token for subsequent requests 
  }
  return result.data;
};

/* FETCH USER PROFILE */
export const requestUserProfile = async () => {
  const result = await apiClient.get("/fetch-user-profile");
  return result.data;
};

/* UPLOAD PROFILE PICTURE */
export const userProfilePicture = async (formData) => {
  const result = await apiClient.post("/upload-file/profile_picture", formData);
  return result.data;
};

/* UPLOAD RESUME */
export const uploadResumeAPI = async (formData) => {
  const result = await apiClient.post("/upload-file/resume", formData);
  return result.data;
};

/* PASSWORD RESET REQUEST */
export const requestOTPForPasswordReset = async (email) => {
  const result = await apiClient.post("/password-reset-request", { email });
  return result.data;
};

/* VERIFY OTP & RESET PASSWORD */
export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
  const result = await apiClient.post("/verify-reset-password-request", data);
  return result.data;
};
