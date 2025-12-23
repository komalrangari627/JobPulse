import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';

import "./styles/UserLoginRegisterForm.scss";

import { PiEyesFill, PiEyeClosedFill } from "react-icons/pi";
import { useMessage } from '../../context/messageContext';
import { useUser } from '../../context/userContext.jsx';
import userAPI from "../../api/userAPI.js";  // ✅ Correct import

const UserLoginRegisterForm = () => {
  // Destructure API functions inside the component
  const {
    requestUserRegister,
    requestUserEmailOtpVerification,
    requestUserLogin,
    requestUserProfile,
  } = userAPI;

  const navigate = useNavigate();
  const { fetchUserProfile } = useUser();
  const { triggerMessage } = useMessage();

  const [openFormLogin, setOpenFormLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    name: "", phone: "", email: "", password: "",
    street: "", city: "", state: "", country: "",
    pincode: "", dob: ""
  });

  const [loginForm, setLoginForm] = useState({
    email: "", password: ""
  });

  const [registerFormVerifyOtp, setRegisterFormVerifyOtp] = useState({
    email: "", userOtp: ""
  });

  const [otp, setOtp] = useState("");

  const payload = {
    name: registerForm.name.trim(),
    phone: registerForm.phone.trim(),
    email: registerForm.email.trim().toLowerCase(),
    password: registerForm.password.trim(),
    street: registerForm.street,
    city: registerForm.city,
    state: registerForm.state,
    country: registerForm.country,
    pincode: registerForm.pincode,
    dob: registerForm.dob,
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    const payload = {
      email: loginForm.email.trim().toLowerCase(),
      password: loginForm.password.trim(),
    };
    
    await requestUserLogin(payload);    
  
    console.log("LOGIN PAYLOAD 👉", payload); // IMPORTANT
  
    try {
      const res = await requestUserLogin(payload);
      console.log("LOGIN SUCCESS 👉", res.data);
    } catch (err) {
      console.error(
        "LOGIN ERROR 👉",
        err?.response?.data || err.message
      );
    }
  };
    
  // ================= LOGIN =================
  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      email: loginForm.email.trim().toLowerCase(),
      password: loginForm.password.trim(), // ✅ MUST EXIST
    };
  
    const result = await requestUserLogin(payload);
    try {
      setLoading(true);
      const result = await requestUserLogin(loginForm);
      triggerMessage("success", result.data.message || "Login successful!");
      localStorage.setItem("token", result.data.token);
      await fetchUserProfile();
      navigate("/user-dashboard");
    } catch (error) {
      triggerMessage("danger",
        error?.response?.data?.message ||
        error?.response?.data?.err ||
        error?.message ||
        "Login failed!"
      );
    } finally {
      setLoading(false);
    }
    };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // ================= REGISTER =================
  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await requestUserRegister(registerForm);

      if (result.status !== 201) throw "Unable to register user!";

      triggerMessage("success", result.data.message, true);

      setShowOtpForm(true);
      setRegisterFormVerifyOtp({ email: registerForm.email, userOtp: "" });

      setRegisterForm({
        name: "", phone: "", email: "", password: "",
        street: "", city: "", state: "", country: "",
        pincode: "", dob: ""
      });
    } catch (err) {
      triggerMessage("danger", err.message || err, true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFormChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  // ================= OTP VERIFY =================
  const handleOtpFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await requestUserEmailOtpVerification(
        registerFormVerifyOtp.email,
        otp
      );

      if (result.status !== 200) throw "Unable to verify OTP!";

      triggerMessage("success", result.data.message, true);

      setShowOtpForm(false);        // close OTP
      setOpenFormLogin(true);       // return to LOGIN

      setRegisterFormVerifyOtp({ email: "", userOtp: "" });
      setOtp("");
    } catch (err) {
      triggerMessage("danger", err.response?.data?.err || err, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-register-form'>
      <div className='content'>
        <div className={`login-register-section shadow-lg rounded overflow-hidden ${showOtpForm ? "otp-active" : ""}`}>

          {/* LEFT SIDE (REGISTER + OTP) */}
          <div className='register'>
            {showOtpForm ? (
              /* OTP FORM */
              <form onSubmit={handleOtpFormSubmit}
                className='h-full flex flex-col justify-center items-center p-5 gap-5'
              >
                <h1 className='text-2xl font-bold'>
                  Verify <span className='text-primary'>Email</span>
                </h1>

                <span className='text-center'>
                  OTP sent to:
                  <span className='text-primary'> {registerFormVerifyOtp.email}</span>
                </span>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  inputType="number"
                  shouldAutoFocus
                  renderInput={(props) => <input {...props} />}
                  renderSeparator={<span className='mx-2'>-</span>}
                  inputStyle={{
                    border: "2px solid black",
                    borderRadius: "8px",
                    width: "54px",
                    height: "54px",
                    fontSize: "16px",
                    textAlign: "center"
                  }}
                />

                <button type='submit'
                  className={`${loading ? "bg-gray-800" : "bg-green-600"} hover:bg-green-700 text-light font-bold px-8 py-2 rounded transition-all`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Verify OTP"}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterFormSubmit}
                className='flex flex-col gap-4'
              >
                <h1 className='text-2xl font-bold'>
                  Create New <span className='text-primary'>Account</span>
                </h1>

                {/* Name + Phone */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span>Name</span>
                    <input name='name' value={registerForm.name} onChange={handleRegisterFormChange}
                      type="text" placeholder="Name" required />
                  </div>

                  <div>
                    <span>Phone</span>
                    <input name='phone' value={registerForm.phone} onChange={handleRegisterFormChange}
                      type="tel" placeholder="Phone" required />
                  </div>
                </div>

                {/* DOB + Email */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span>D.O.B.</span>
                    <input name='dob' value={registerForm.dob} onChange={handleRegisterFormChange}
                      type="date" placeholder="DOB" required />
                  </div>

                  <div>
                    <span>Email</span>
                    <input name='email' value={registerForm.email} onChange={handleRegisterFormChange}
                      type="email" placeholder="Email" required />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <span>Address</span>
                  <input name='street' value={registerForm.street} onChange={handleRegisterFormChange}
                    type="text" placeholder="Street" required />

                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <input name='city' value={registerForm.city} onChange={handleRegisterFormChange}
                      type="text" placeholder="City" required />

                    <input name='state' value={registerForm.state} onChange={handleRegisterFormChange}
                      type="text" placeholder="State" required />
                  </div>

                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <input name='country' value={registerForm.country} onChange={handleRegisterFormChange}
                      type="text" placeholder="Country" required />

                    <input name='pincode' value={registerForm.pincode} onChange={handleRegisterFormChange}
                      type="number" placeholder="Pincode" required />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <span>Create Password</span>
                  <div className='flex items-center gap-3'>
                    <input name='password' value={registerForm.password} onChange={handleRegisterFormChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Please Enter Password" required />
                    <button type='button' onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <PiEyesFill size={25} /> : <PiEyeClosedFill size={25} />}
                    </button>
                  </div>
                </div>

                {/* BUTTONS */}
                <button type='submit'
                  className={`${loading ? "bg-gray-800 hover:bg-gray-800" : "bg-green-600"} text-light font-bold px-6 py-2 rounded transition-all`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Register User"}
                </button>

                <hr />

                <button type='button' onClick={() => setOpenFormLogin(true)}
                  className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded'>
                  Already Registered? Please Login
                </button>

              </form>
            )}
          </div>

          {/* RIGHT SIDE (LOGIN FORM) */}
          <div className='login'>
            <form onSubmit={handleLoginFormSubmit}
              className='h-full flex flex-col justify-center p-5 gap-7'
            >
              <h1 className='text-2xl font-bold'>Login</h1>

              <div>
                <span>Email</span>
                <input name='email' value={loginForm.email} onChange={handleLoginChange}
                  type="email" placeholder="Please Enter Email" required />
              </div>

              <div>
                <div className='flex justify-between opacity-70'>
                  <span>Password</span>
                  <span className='text-primary'>Forgot Password ?</span>
                </div>

                <div className='flex items-center gap-3'>
                  <input name='password' value={loginForm.password} onChange={handleLoginChange}
                    type={showPassword ? "text" : "password"} placeholder="Please Enter Password" required />

                  <button type='button' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <PiEyesFill size={25} /> : <PiEyeClosedFill size={25} />}
                  </button>
                </div>
              </div>

              <button type='submit'
                className={`${loading ? "bg-gray-800" : "bg-green-600"} hover:bg-green-700 text-light font-bold px-6 py-2 rounded`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Login"}
              </button>

              <hr />

              <button type='button' onClick={() => setOpenFormLogin(false)}
                className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded'>
                New Here? Please Register
              </button>
            </form>
          </div>

          {/* SLIDER */}
          <div className={`slider ${openFormLogin ? "login" : "register"}`}>
            <div className='text-data h-full flex flex-col justify-end gap-2 text-light p-6'>
              <span className='font-bold text-2xl'>Welcome to JobPulse,</span>
              <p>an advanced job application system designed to bridge the gap between job seekers and employers.</p>
              <span className='bg-primary p-2 font-bold w-fit rounded'>Get 20% Off</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
            };

export default UserLoginRegisterForm;
