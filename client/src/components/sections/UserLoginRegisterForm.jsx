import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';

import "./styles/UserLoginRegisterForm.scss";

import { PiEyesFill, PiEyeClosedFill } from "react-icons/pi";
import {
  requestUserRegister,
  requestUserEmailOtpVerification,
  requestUserLogin
} from "../../api/userAPI.js";

import { useMessage } from '../../context/messageContext';
import { useUser } from '../../context/userContext.jsx';
import UserDashboard from "../pages/UserDashboard/UserDashboard.jsx";

const UserLoginRegisterForm = () => {

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

  // LOGIN HANDLER
  const handleLoginFormSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const result = await requestUserLogin(loginForm);

    triggerMessage("success", result.data.message || "Login successful!");
    localStorage.setItem("token", result.data.token);

    await fetchUserProfile();
    navigate("/user/dashboard");

  } catch (error) {

    const errorMessage =
      error?.response?.data?.message ||   
      error?.response?.data?.err ||       
      error?.message ||                   
      "Login failed!";                    

    triggerMessage("danger", errorMessage);
    console.log("Login error: ", error);

  } finally {
    setLoading(false);
  }
};

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // REGISTER HANDLER
  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let result = await requestUserRegister(registerForm);

      if (result.status !== 202) throw "Unable to register user!";

      triggerMessage("success", result.data.message || "Registered successfully!", true);

      setShowOtpForm(true);

      setRegisterFormVerifyOtp(prev => ({
        ...prev,
        email: registerForm.email
      }));

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

  // OTP VERIFY HANDLER
  const handleOtpFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await requestUserEmailOtpVerification(
        registerFormVerifyOtp.email,
        otp
      );

      if (result.status !== 202) throw "Unable to verify OTP!";

      triggerMessage("success", result.data.message || "OTP verified!", true);

      setShowOtpForm(false);
      setRegisterFormVerifyOtp({ email: "", userOtp: "" });
      setOtp("");
      setOpenFormLogin(true);

    } catch (err) {
      triggerMessage("danger", err.response?.data?.err || err, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-register-form'>
      <div className='content'>
        <div className='login-register-section shadow-lg rounded overflow-hidden'>

          {/* LEFT SECTION (REGISTER / OTP) */}
          <div className='register'>
            {showOtpForm ? (
              // OTP FORM
              <form onSubmit={handleOtpFormSubmit}
                className='h-full flex flex-col justify-center items-center p-5 gap-3'
              >
                <h1 className='text-2xl font-bold'>Verify <span className='text-primary'>Email</span></h1>

                <span className='text-center'>
                  An OTP has been sent to:
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
                    border: "1px solid black",
                    borderRadius: "8px",
                    width: "54px",
                    height: "54px",
                    fontSize: "16px",
                    textAlign: "center"
                  }}
                />

                <button type='submit'
                  className={`${loading ? "bg-gray-800" : "bg-green-600"} hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Verify OTP"}
                </button>
              </form>

            ) : (
              // REGISTER FORM
              <form onSubmit={handleRegisterFormSubmit}
                className='h-full flex flex-col justify-center p-5 gap-3'
              >

                <h1 className='text-2xl font-bold'>Create New <span className='text-primary'>Account</span></h1>

                {/* Name & Phone */}
                <div className='flex gap-3'>
                  <div className='grow'>
                    <span className='opacity-70'>Name</span>
                    <input name='name' value={registerForm.name} onChange={handleRegisterFormChange}
                      type="text" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Name" required />
                  </div>
                  <div className='grow'>
                    <span className='opacity-70'>Phone</span>
                    <input name='phone' value={registerForm.phone} onChange={handleRegisterFormChange}
                      type="tel" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Phone" required />
                  </div>
                </div>

                {/* DOB & Email */}
                <div className='flex gap-3'>
                  <div>
                    <span className='opacity-70'>D.O.B.</span>
                    <input name='dob' value={registerForm.dob} onChange={handleRegisterFormChange}
                      type="date" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" required />
                  </div>
                  <div className='grow'>
                    <span className='opacity-70'>Email</span>
                    <input name='email' value={registerForm.email} onChange={handleRegisterFormChange}
                      type="email" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Email" required />
                  </div>
                </div>

                {/* ADDRESS */}
                <div>
                  <span className='opacity-70'>Address</span>

                  <div className='address-fields w-full flex flex-col gap-3'>
                    <input name='street' value={registerForm.street} onChange={handleRegisterFormChange}
                      type="text" className="grow mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Street" required />

                    <div className='flex gap-3'>
                      <input name='city' value={registerForm.city} onChange={handleRegisterFormChange}
                        type="text" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="City" required />
                      <input name='state' value={registerForm.state} onChange={handleRegisterFormChange}
                        type="text" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="State" required />
                    </div>

                    <div className='flex gap-3'>
                      <input name='country' value={registerForm.country} onChange={handleRegisterFormChange}
                        type="text" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Country" required />
                      <input name='pincode' value={registerForm.pincode} onChange={handleRegisterFormChange}
                        type="number" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Pincode" required />
                    </div>
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <span className='opacity-70'>Create Password</span>
                  <div className='flex items-center gap-3'>
                    <input name='password' value={registerForm.password} onChange={handleRegisterFormChange}
                      type={showPassword ? "text" : "password"} className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Enter Password" required />

                    <button type='button' onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <PiEyesFill size={25} /> : <PiEyeClosedFill size={25} />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <div className='flex flex-col gap-3'>
                  <button type='submit'
                    className={`${loading ? "bg-gray-800" : "bg-green-600"} hover:bg-green-700 text-light font-bold px-6 py-2 rounded`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Register User"}
                  </button>

                  <hr />

                  <button type='button' onClick={() => setOpenFormLogin(true)}
                    className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded'
                  >
                    Already Registered? Login
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* LOGIN SECTION */}
          <div className='login'>
            <form onSubmit={handleLoginFormSubmit}
              className='h-full flex flex-col justify-center p-5 gap-7'
            >

              <h1 className='text-2xl font-bold'>Login</h1>

              <div>
                <span className='opacity-70'>Email</span>
                <input name='email' onChange={handleLoginChange}  value={loginForm.email}
                  type="email" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Enter Email" required />
              </div>

              <div>
                <div className='flex justify-between opacity-70'>
                  <span>Password</span>
                  <span className='text-primary'>Forgot Password?</span>
                </div>

                <div className='flex items-center gap-3'>
                  <input name='password' value={loginForm.password} onChange={handleLoginChange}
                    type={showPassword ? "text" : "password"} className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg block w-full p-2.5" placeholder="Enter Password" required />

                  <button type='button' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <PiEyesFill size={25} /> : <PiEyeClosedFill size={25} />}
                  </button>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <button type='submit'
                  className={`${loading ? "bg-gray-800" : "bg-green-600"} hover:bg-green-700 text-light font-bold px-6 py-2 rounded`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Login"}
                </button>

                <hr />

                <button type='button' onClick={() => setOpenFormLogin(false)}
                  className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded'
                >
                  New Here? Register
                </button>
              </div>

            </form>
          </div>

          {/* SLIDER SECTION */}
          <div className={`slider ${openFormLogin ? "login" : "register"}`}>
            <div className='text-data h-full flex flex-col justify-end gap-2 text-light p-6'>
              <span className='font-bold text-2xl'>Welcome</span>
              <p>to JobPulse — your gateway to better career opportunities.Advanced tools and smart matching to help you find the perfect job.</p>
              <span className='bg-primary p-2 font-bold w-fit rounded'>Get 20% Off</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserLoginRegisterForm;
