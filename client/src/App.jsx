import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [fileType, setFileType] = useState("resume");
  const [file, setFile] = useState(null);
  const [token, setToken] = useState("");
  const [response, setResponse] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !token) {
      alert("Please select a file and provide your token!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:5012/api/users/upload-file/${fileType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Upload success:", res.data);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("Upload failed:", err);
      setResponse("Error uploading file!");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2>Upload File (Resume / Profile / Documents)</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="fileType" style={{ marginRight: "10px" }}>
            File Type:
          </label>
          <select
            id="fileType"
            name="fileType"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            required
          >
            <option value="resume">Resume</option>
            <option value="profile">Profile</option>
            <option value="documents">Documents</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            id="fileInput"
            name="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            id="token"
            placeholder="Paste your JWT token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ width: "90%", padding: "8px" }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Upload File
        </button>
      </form>

      {response && (
        <pre
          style={{
            marginTop: "20px",
            background: "#f4f4f4",
            padding: "10px",
            textAlign: "left",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </pre>
      )}
    </div>
  );
};

export default App;
