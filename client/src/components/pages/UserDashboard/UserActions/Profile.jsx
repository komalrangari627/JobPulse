import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// styles
import "./user-action.scss";

// icons
import { FaTimes, FaUser, FaCamera, FaCheckCircle } from "react-icons/fa";
import { FaPhone, FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { PiEyesFill, PiEyeClosedFill } from "react-icons/pi";

// context
import { useUser } from "../../../../context/userContext";
import { useMessage } from "../../../../context/messageContext";

// api
import {
  userProfilePicture,
  uploadResumeAPI,
  requestOTPForPasswordReset,
  requestUserEmailOtpVerificationPasswordReset,
} from "../../../../api/userAPI";

// otp input
import OtpInput from "react-otp-input";

const Profile = () => {
  const { user, fetchUserProfile } = useUser();
  const { triggerMessage } = useMessage();
  const navigate = useNavigate();

  // modal & mode
  const [triggerEditForm, setTriggerEditForm] = useState(false);
  // modes: "picture" | "password" | "otpVerify" | "resume"
  const [editMode, setEditMode] = useState("picture");

  // picture
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // password reset
  const [passwordResetEmail, setPasswordResetEmail] = useState(
    user?.email?.userEmail || ""
  );
  const [passwordOtp, setPasswordOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Sending OTP and verifying
  const [sendingOtp, setSendingOtp] = useState(false);

  // resume
  const [resumeFiles, setResumeFiles] = useState(null);

  // ensure profile is fresh
  useEffect(() => {
    if (fetchUserProfile) fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers

  const safeEmail = () => user?.email?.userEmail || passwordResetEmail || "";

  const buildProfileImageSrc = () => {
    // if backend returns a filename string in user.profile_picture
    if (!user?.profile_picture) return null;
    if (typeof user.profile_picture === "string") {
      const serverRoot = import.meta.env.VITE_BASE_API_URL
        ? import.meta.env.VITE_BASE_API_URL.replace("/api/users", "")
        : "";
      return `${serverRoot}/profile_pictures/${user.profile_picture}`;
    }
    // if backend returns an object with url
    if (typeof user.profile_picture === "object" && user.profile_picture.url) {
      return user.profile_picture.url;
    }
    return null;
  };

  // Picture handlers

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      triggerMessage("warning", "Please select an image file.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      triggerMessage("warning", "Only images are allowed.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProfilePictureUpload = async () => {
    if (!selectedImage) return triggerMessage("warning", "Select a picture!");
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const token = localStorage.getItem("token");
      await userProfilePicture(token, formData);
      triggerMessage("success", "Profile picture updated!");
      await fetchUserProfile();
      setTriggerEditForm(false);
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (err) {
      triggerMessage("danger", err?.response?.data?.message || "Upload failed");
    }
  };

  // Password reset flow (in same modal)

  const sendPasswordResetOtp = async () => {
    const emailToSend = passwordResetEmail || safeEmail();
    if (!emailToSend) return triggerMessage("warning", "Enter email!");

    try {
      setSendingOtp(true); // start loading
      const res = await requestOTPForPasswordReset(emailToSend);
      setOtpSent(true);
      setEditMode("otpVerify");
      triggerMessage("success", res?.data?.message || "OTP sent! Check your email.");
    } catch (err) {
      triggerMessage("danger", err?.response?.data?.message || "Could not send OTP");
    } finally {
      setSendingOtp(false); // stop loading
    }
  };

  const verifyPasswordReset = async (e) => {
    e?.preventDefault?.();
    if (!passwordOtp) return triggerMessage("warning", "Enter OTP!");
    if (!newPassword) return triggerMessage("warning", "Enter new password!");

    try {
      await requestUserEmailOtpVerificationPasswordReset({
        email: passwordResetEmail || safeEmail(),
        userOtp: passwordOtp,
        newPassword,
      });

      triggerMessage("success", "Password updated!");
      // close modal then redirect to login
      setTriggerEditForm(false);
      setTimeout(() => navigate("/user-login-register"), 500);
    } catch (err) {
      triggerMessage("danger", err?.response?.data?.message || "OTP verification failed");
    }
  };

  // Resume upload using backend API

  const handleResumeSelect = (e) => {
    setResumeFiles(e.target.files);
  };

  const uploadResume = async () => {
    if (!resumeFiles || resumeFiles.length === 0)
      return triggerMessage("warning", "Select a file first!");

    const formData = new FormData();
    formData.append("file", resumeFiles[0]);

    try {
      const token = localStorage.getItem("token");
      await uploadResumeAPI(token, formData);
      triggerMessage("success", "Resume uploaded!");
      await fetchUserProfile();
      setTriggerEditForm(false);
      setResumeFiles(null);
    } catch (err) {
      triggerMessage("danger", err?.response?.data?.message || err.message || "Upload failed");
    }
  };

  // OTP input renderer for compatibility

  const renderOtpInput = (props) => (
    <input
      {...props}
      style={{
        width: 48,
        height: 48,
        margin: 6,
        fontSize: 18,
        textAlign: "center",
        borderRadius: 8,
        border: "1px solid #cfcfcf",
      }}
    />
  );

  // Modal opener helper

  const openEditPopup = (mode) => {
    setEditMode(mode);
    setTriggerEditForm(true);
    // reset modal states
    setSelectedImage(null);
    setPreviewUrl(null);
    setPasswordOtp("");
    setOtpSent(false);
    setNewPassword("");
    setResumeFiles(null);
  };

  return (
    <>
      <div id="user-profile" className="shadow">
        <div className="bg-pink-400" />
        <div className="information">
          <div className="pnpa">
            <div className="profile-picture">
              {user?.logedIn && user?.profile_picture ? (
                <>
                  <img
                    src={buildProfileImageSrc()}
                    alt="Profile"
                    style={{ width: 160, height: 160, objectFit: "cover", borderRadius: "50%" }}
                  />
                  <button
                    onClick={() => openEditPopup("picture")}
                    className="bg-primary px-2 py-1 text-light rounded"
                  >
                    <FaCamera />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openEditPopup("picture")}
                  className="bg-primary px-2 py-1 text-light rounded"
                >
                  <FaCamera />
                </button>
              )}
            </div>

            <div className="user-info-container p-5 flex flex-col gap-3">
              <div className="flex gap-3 p-3 shadow">
                <span className="user-info-icon"><FaUser /></span>
                <span>{user?.name || "No Name"}</span>

                <span className="user-info-icon"><FaPhone /></span>
                <span>{user?.phone || "No Phone"}</span>
              </div>

              <div className="p-3 shadow flex items-center gap-2">
                <span className="user-info-icon"><IoMdMail /></span>
                <span>{user?.email?.userEmail || "No Email"}</span>
                <FaCheckCircle className={user?.email?.verified ? "text-green-500" : ""} />
              </div>

              <div className="p-3 shadow">
                <span className="user-info-icon"><FaLocationDot /></span>
                <span>
                  {user?.address
                    ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""}, ${user.address.country || ""}, ${user.address.pincode || ""}`
                    : "No Address"}
                </span>
              </div>
            </div>

            <div className="p-3 flex gap-4">
              <button
                onClick={() => openEditPopup("password")}
                className="bg-cyan-500 p-1 text-light rounded"
              >
                Password Reset
              </button>

              <button
                onClick={() => openEditPopup("resume")}
                className="bg-cyan-500 p-1 text-light rounded"
              >
                Upload Resume
              </button>
            </div>
          </div>

          <div className="reports p-3">
            <div className="applied-jobs">
              <span>{user?.appliedJobs?.length || 0}</span>
              <span>Applied Jobs</span>
            </div>

            <div className="profile-selected">
              <span>0</span>
              <span>Profile Selected</span>
            </div>
          </div>

          <div className="documents" />
        </div>
      </div>

      {/* POP-UP MODAL */}
      {triggerEditForm && (
        <div id="edit-pop-up-form">
          <div className="edit-form">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>
                {editMode === "picture" ? "Change Profile Picture" : editMode === "password" ? "Password Reset" : editMode === "otpVerify" ? "Verify OTP" : "Upload Resume"}
              </h3>
              <button className="close-btn bg-red-600 p-2 rounded-full shadow-lg hover:bg-red-700 transition" onClick={() => setTriggerEditForm(false)}>
                <FaTimes />
              </button>
            </div>

            <div style={{ marginTop: 20 }}>
              {/* PICTURE MODE */}
              {editMode === "picture" && (
                <div className="popup-profile-picture">
                  <div
                    className="upload-area"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                      minHeight: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 12,
                      padding: 16,
                    }}
                  >
                    {previewUrl ? (
                      <div className="w-full h-[220px] overflow-hidden rounded-lg">
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <>
                        <p>Drag & Drop or Click</p>
                        <input type="file" accept="image/*" onChange={handleFileSelect} />
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {selectedImage && (
                      <button className="submit-btn" onClick={handleProfilePictureUpload}>
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* PASSWORD RESET: send OTP */}
              {editMode === "password" && (
                <div className="popup-password-reset">
                  <label>Email</label>
                  <input
                    type="email"
                    value={passwordResetEmail}
                    onChange={(e) => setPasswordResetEmail(e.target.value)}
                    placeholder="Enter registered email"
                  />
                  <button className="submit-btn" onClick={sendPasswordResetOtp} disabled={sendingOtp}>
                    {sendingOtp ? "Processing..." : "Send OTP"}
                  </button>

                </div>
              )}

              {/* OTP VERIFY (inside same modal) */}
              {editMode === "otpVerify" && (
                <div className="popup-password-verify">
                  <p style={{ color: "#16a34a", marginBottom: 8 }}>OTP sent! Check your email.</p>

                  <label>Enter OTP</label>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                    <OtpInput
                      value={passwordOtp}
                      onChange={setPasswordOtp}
                      numInputs={4}
                      renderInput={renderOtpInput}
                      inputType="number"
                      isInputNum={false}
                    />
                  </div>

                  <label>New Password</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ flex: 1 }}
                      placeholder="Enter new password"
                    />
                    <span style={{ cursor: "pointer" }} onClick={() => setShowNewPassword((s) => !s)}>
                      {showNewPassword ? <PiEyesFill size={20} /> : <PiEyeClosedFill size={20} />}
                    </span>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button className="submit-btn" onClick={verifyPasswordReset}>
                      Verify & Reset Password
                    </button>
                  </div>
                </div>
              )}

              {/* RESUME UPLOAD */}
              {editMode === "resume" && (
                <div className="popup-resume-upload">
                  <label>Choose Resume</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeSelect} />
                  <div style={{ marginTop: 12 }}>
                    <button className="submit-btn" onClick={uploadResume}>
                      Upload Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
