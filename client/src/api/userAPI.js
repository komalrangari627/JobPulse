import axios from "axios";

let baseUrl = import.meta.env.VITE_BASE_API_URL || "http://localhost:5012/api/users";

// REGISTER USER
export const requestUserRegister = async (data) => {
    return axios.post(`${baseUrl}/register`, data);
};

// VERIFY EMAIL OTP
export const requestUserEmailOtpVerification = async (email, otp) => {
    return axios.post(`${baseUrl}/verify-otp`, {
        email,
        userOtp: otp?.toString()
    });
};

// LOGIN USER

export const requestUserLogin = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/user-login`, data)
        return result
    } catch (err) {
        throw err
    }
}
// FETCH USER PROFILE
export const requestUserProfile = async (token) => {
    try {
        let result = await axios({
            method: "GET",
            url: `${baseUrl}/fetch-user-profile`,
            headers: {
                authorization: token
            }
        })

        return result

    } catch (err) {
        throw (err)
    }
}
