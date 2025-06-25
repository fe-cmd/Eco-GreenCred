import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import './CSS/UploadActivity.css';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API || "";



const UploadActivity = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const [activityType, setActivityType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const activityOptions = [
    "Wildlife Conservation",
    "Tree Planting",
    "Recycling",
    "Waste Collection",
    "Beach Cleanup",
    "Bike Commuting",
    "Energy Conservation",
    "Water Conservation",
    "Sustainable Gardening",
    "Plastic Reduction",
    "E-waste Disposal"
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityType || !file || !description) {
      alert("Please complete all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("activityType", activityType);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/upload-activity`, {
        method: "POST",
        body: formData,
      });
      await res.json();
      alert("Upload submitted successfully!");
      navigate(`/progress/${username}`);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="upload-form-container">
      <div className="upload-header">
        <span className="cancel-text" onClick={() => navigate(-1)}>
          Cancel
        </span>
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

        <label className="form-label">Upload Proof</label>
       <label className="upload-box">
  {!filePreview && (
    <div className="upload-placeholder">
      <FiPlus className="plus-icon" />
      <span className="upload-text">Add photo or video</span>
    </div>
  )}
  {filePreview && (
    file.type.startsWith("video") ? (
      <video src={filePreview} className="upload-preview" muted controls={false} />
    ) : (
      <img src={filePreview} className="upload-preview" alt="Preview" />
    )
  )}
  <input
    type="file"
    accept="image/*,video/*"
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

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadActivity;
