import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL + "/user";

/* REGISTER USER */
export const requestUserRegister = async (data) => {
  try {
    const result = await axios.post(`${baseUrl}/register`, data);
    return result;
  } catch (err) {
    throw err;
  }
};

/* VERIFY EMAIL OTP */
export const requestUserEmailOtpVerification = async (data) => {
  try {
    const result = await axios.post(`${baseUrl}/verify-otp`, data);
    return result;
  } catch (err) {
    throw err;
  }
};

/* LOGIN USER */
export const requestUserLogin = async (data) => {
  try {
    const result = await axios.post(`${baseUrl}/user-login`, data);
    return result;
  } catch (err) {
    throw err;
  }
};

/* FETCH USER PROFILE */
export const requestUserProfile = async (token) => {
  try {
    const result = await axios({
      method: "GET",
      url: `${baseUrl}/fetch-user-profile`,
      headers: {
        authorization: token,
      },
    });
    return result;
  } catch (err) {
    throw err;
  }
};

/* UPLOAD PROFILE PICTURE */
export const userProfilePicture = async (token, formData) => {
  try {
    const result = await axios.post(
      `${baseUrl}/upload-file/profile_picture`,
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

/* PASSWORD RESET REQUEST */
export const requestOTPForPasswordReset = async (email) => {
  try {
    const result = await axios.post(
      `${baseUrl}/password-reset-request`,
      { email }
    );
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

/* UPLOAD RESUME */
export const uploadResumeAPI = async (token, formData) => {
  try {
    const result = await axios.post(
      `${baseUrl}/upload-file/resume`,
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

/* UPLOAD BIO */
export const uploadBIO = async (token, newBio) => {
  try {
    const result = await axios.post(
      `${baseUrl}/upload-new-bio`,
      newBio,
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

/* DELETE RESUME */
export const deleteResume = async (token) => {
  try {
    const result = await axios.delete(`${baseUrl}/delete-resume`, {
      headers: {
        authorization: token,
      },
    });
    return result;
  } catch (err) {
    throw err;
  }
};

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