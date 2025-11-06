import React, { useState } from "react";
import axios from "axios";

const App = () => {
  // User states
  const [fileType, setFileType] = useState("resume");
  const [userFile, setUserFile] = useState(null);
  const [userToken, setUserToken] = useState("");

  // Company states
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyToken, setCompanyToken] = useState("");
  const [preview, setPreview] = useState("");

  // Shared message
  const [message, setMessage] = useState("");

  // ---------------- USER UPLOAD ----------------
  const handleUserUpload = async (e) => {
    e.preventDefault();
    if (!userFile || !userToken) {
      alert("Please select a file and provide your user token!");
      return;
    }

    const formData = new FormData();
    formData.append("file", userFile);

    try {
      const res = await axios.post(
        `http://localhost:5012/api/users/upload-file/${fileType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setMessage(` User File Uploaded Successfully: ${res.data.message}`);
    } catch (err) {
      console.error("User upload failed:", err);
      setMessage(" User file upload failed!");
    }
  };

  // ---------------- COMPANY UPLOAD ----------------
  const handleCompanyUpload = async (e) => {
    e.preventDefault();
    if (!companyLogo || !companyToken) {
      alert("Please select a logo and provide your company token!");
      return;
    }

    const formData = new FormData();
    formData.append("file", companyLogo);

    try {
      const res = await axios.post(
        `http://localhost:5012/api/company/upload-file/logo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );
      setMessage(` Company Logo Uploaded Successfully: ${res.data.message}`);

      if (res.data.path) {
        const imgUrl = res.data.path.startsWith("http")
          ? res.data.path
          : `http://localhost:5012/${res.data.path}`;
        setPreview(imgUrl);
      }
    } catch (err) {
      console.error("Company upload failed:", err);
      setMessage(" Company logo upload failed!");
    }
  };

  return (
    <div
  style={{
    fontFamily: "Arial, sans-serif",
    background: "#f8f9fa",
    minHeight: "100vh",
    padding: "20px 40px 40px", // 🔹 Less top padding
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  <h1
    style={{
      color: "#007bff",
      marginTop: "10px", // 🔹 Pulls title closer to top
      marginBottom: "25px", // 🔹 Reduces space below title
      textAlign: "center",
    }}
  >
     JobPulse File Upload Portal
  </h1>


      {/* ======== FORMS CONTAINER ======== */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/*  USER UPLOAD FORM */}
        <form
          onSubmit={handleUserUpload}
          encType="multipart/form-data"
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "450px",
          }}
        >
          <h2 style={{ color: "#007bff", textAlign: "center", marginBottom: "20px" }}>
             Upload User File
          </h2>

          <label
            style={{
              color: "#007bff",
              fontWeight: "bold",
              display: "block",
              marginBottom: "6px",
            }}
          >
            File Type:
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          >
            <option value="resume">Resume</option>
            <option value="profile">Profile</option>
            <option value="documents">Documents</option>
          </select>

          <label
            style={{
              color: "#007bff",
              fontWeight: "bold",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Select File:
          </label>
          <input
            type="file"
            onChange={(e) => setUserFile(e.target.files[0])}
            required
            style={{
              width: "100%",
              marginBottom: "15px",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label
            style={{
              color: "#007bff",
              fontWeight: "bold",
              display: "block",
              marginBottom: "6px",
            }}
          >
            User JWT Token:
          </label>
          <input
            type="text"
            placeholder="Paste your user JWT token"
            value={userToken}
            onChange={(e) => setUserToken(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Upload User File
          </button>
        </form>

        {/*  COMPANY UPLOAD FORM */}
        <form
          onSubmit={handleCompanyUpload}
          encType="multipart/form-data"
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "450px",
          }}
        >
          <h2 style={{ color: "#007bff", textAlign: "center", marginBottom: "20px" }}>
             Upload Company Logo
          </h2>

          <label
            style={{
              color: "#007bff",
              fontWeight: "bold",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Select Company Logo:
          </label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => setCompanyLogo(e.target.files[0])}
            required
            style={{
              width: "100%",
              marginBottom: "15px",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label
            style={{
              color: "#007bff",
              fontWeight: "bold",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Company JWT Token:
          </label>
          <input
            type="text"
            placeholder="Paste your company JWT token"
            value={companyToken}
            onChange={(e) => setCompanyToken(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Upload Company Logo
          </button>

          {preview && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <h3 style={{ color: "#007bff" }}> Uploaded Logo Preview</h3>
              <img
                src={preview}
                alt="Company Logo"
                style={{
                  maxWidth: "200px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          )}
        </form>
      </div>

      {/*  Message */}
      {message && (
        <div
          style={{
            marginTop: "40px",
            background: "#e9f7ef",
            padding: "15px 25px",
            borderRadius: "8px",
            borderLeft: "6px solid #28a745",
            textAlign: "center",
            color: "#155724",
            width: "500px",
            fontSize: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
