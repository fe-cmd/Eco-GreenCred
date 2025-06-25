import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCoins } from "react-icons/fa";
import "./CSS/AdminUploadReview.css";

const API = "http://localhost:5000";

const AdminUploadReview = () => {
  const { username, uploadId } = useParams();
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [points, setPoints] = useState("");

 useEffect(() => {
  fetch(`${API}/user/${username}`)
    .then((res) => res.json())
    .then((user) => {
      const specificUpload = user.uploads.find((u) => u.id === Number(uploadId));
      setUpload(specificUpload);
    });
}, [username, uploadId]);


  const handleApprove = async () => {
    if (!points) return alert("Assign some points!");
    await fetch(`${API}/admin/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, uploadId: Number(upload.id), points })
    });
    setUpload(prev => ({ ...prev, status: "approved", points: Number(points) }));
    setShowPopup(false);
  };

  const handleDecline = async () => {
    await fetch(`${API}/admin/decline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, uploadId: Number(upload.id) })
    });
    setUpload(prev => ({ ...prev, status: "declined" }));
  };

  if (!upload) {
    return (
      <div className="admin-review-container">
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
          <FaArrowLeft size={20} /> Back
        </button>
        <p className="no-upload-msg">This specific upload could not be found.</p>
      </div>
    );
  }

  return (
    <div className="admin-review-container">
      <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
        <FaArrowLeft size={20} /> Back
      </button>

      <div className="media-container">
        {upload.fileType === "video" ? (
          <video src={`${API}${upload.filePath}`} controls className="review-media" />
        ) : (
          <img src={`${API}${upload.filePath}`} alt="upload" className="review-media" />
        )}
      </div>

      <div className="info-row">
        <p><strong>Description:</strong> {upload.description}</p>
        <p><strong>Activity:</strong> {upload.activityType}</p>
        <p><strong>Time:</strong> {new Date(upload.timestamp).toLocaleString()}</p>
      </div>

      <div className="status-row">
        {upload.status === "pending" ? (
          <>
            <button className="approve-btn" onClick={() => setShowPopup(true)}>
              Approve
            </button>
            <button className="decline-btn" onClick={handleDecline}>
              Decline
            </button>
          </>
        ) : upload.status === "approved" ? (
          <div className="approved-status">
            <FaCheckCircle color="green" /> Approved ({upload.points} pts)
          </div>
        ) : (
          <div className="declined-status">
            <FaTimesCircle color="red" /> Declined
          </div>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <label>Assign Points:</label>
            <div className="points-input-wrapper">
              <FaCoins className="coin-icon" />
              <input
                type="number"
                value={points}
                onChange={e => setPoints(e.target.value)}
                placeholder="e.g. 100"
              />
              <span className="pts-label">pts</span>
            </div>
            <div className="popup-actions">
              <button className="popup-approve-btn" onClick={handleApprove}>
                Approve & Assign
              </button>
              <button className="popup-cancel-btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadReview;
