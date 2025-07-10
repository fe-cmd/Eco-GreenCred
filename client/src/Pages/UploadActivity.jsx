import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import './CSS/UploadActivity.css';

const API = process.env.REACT_APP_API || "http://localhost:5000";

const UploadActivity = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const [activityType, setActivityType] = useState("");
  const [customType, setCustomType] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const activityOptions = [
    "Wildlife Conservation", "Tree Planting", "EcoGreen Outreach", "Recycling",
    "Waste Collection", "Beach Cleanup", "Bike Commuting", "Energy Conservation",
    "Water Conservation", "Sustainable Gardening", "Plastic Reduction", "E-waste Disposal",
    "Others"
  ];

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    const isVideo = selected[0].type.startsWith("video");

    if (isVideo && selected.length > 1) {
      alert("Only one video allowed.");
      return;
    }

    if (!isVideo && selected.length + files.length > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }

    const newPreviews = selected.map(file => URL.createObjectURL(file));
    setFiles(prev => [...prev, ...selected]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalActivity = activityType === "Others" ? customType : activityType;

    if (!finalActivity || !description || files.length === 0) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("activityType", finalActivity);
    formData.append("description", description);
    files.forEach(file => formData.append("files", file)); // ✅ MATCHES multer

    try {
      const res = await fetch(`${API}/upload-activity`, {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
if (!res.ok) {
  const errorText = await res.text();
  throw new Error(`Server Error: ${errorText}`);
}

if (!contentType.includes("application/json")) {
  const raw = await res.text();
  throw new Error(`Unexpected response: ${raw}`);
}
      const data = await res.json();
      if (res.ok) {
        alert("Upload submitted successfully!");
        navigate(`/progress/${username}`);
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong.");
    }
  };

  const isVideo = files.length > 0 && files[0].type.startsWith("video");

  return (
    <div className="upload-form-container">
      <div className="upload-header">
        <span className="cancel-text" onClick={() => navigate(-1)}>Cancel</span>
        <h2 className="upload-title">Log Activity</h2>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <label className="form-label">Activity Type</label>
        <select
          className="activity-select"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          required
        >
          <option value="">-- Select Activity --</option>
          {activityOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {activityType === "Others" && (
          <input
            className="activity-select"
            placeholder="Enter custom activity"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            required
          />
        )}

        <label className="form-label">Upload Proof</label>
        <label className="upload-box">
          {!files.length && (
            <div className="upload-placeholder">
              <FiPlus className="plus-icon" />
              <span className="upload-text">Add photo or video</span>
            </div>
          )}

          {isVideo ? (
            <video src={previewUrls[0]} className="upload-preview" controls />
          ) : (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {previewUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preview ${i}`}
                  style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px" }}
                />
              ))}
              {files.length < 5 && (
                <div style={{ fontSize: "0.8rem", textAlign: "center", color: "#888" }}>
                  <FiPlus /> Max 5 images
                </div>
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>

        <label className="form-label">Description</label>
        <textarea
          className="description-input"
          placeholder="Describe your activity..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default UploadActivity;
