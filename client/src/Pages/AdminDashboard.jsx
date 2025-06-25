import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./CSS/AdminDashboard.css";
import ec28 from '../Components/Assets/ec28.png'; // ✅ JSX-based background image

const API = "http://localhost:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [profileImage, setProfileImage] = useState("/ec26.png");

  useEffect(() => {
    fetch(`${API}/admin/profile`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profileImage) setProfileImage(`${API}/${data.profileImage}`);
      })
      .catch(() => setProfileImage("/ec26.png"));
  }, []);

  useEffect(() => {
    const fetchUploads = () => {
      fetch(`${API}/admin/uploads`)
        .then((res) => res.json())
        .then((data) => setUploads(data))
        .catch((err) => console.error("Error loading uploads:", err));
    };

    fetchUploads();
    const interval = setInterval(fetchUploads, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API}/admin/upload-profile`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.profileImage) {
        setProfileImage(`${API}/${data.profileImage}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleCardClick = (username, uploadId) => {
    navigate(`/admin/user/${username}/upload/${uploadId}`);
  };

  return (
    <div className="background-wrapper-admin" style={{ backgroundImage: `url(${ec28})` }}>
      <div className="overlay-admin">
        <div className="admin-dashboard-container">
          <div className="admin-header">
            <div>
              <h1>Hello,</h1>
              <h2>Admin</h2>
            </div>

            <div className="profile-wrapper">
              <div className="profile-pic-container">
                <img src={profileImage} alt="Admin" className="profile-pic" />
                <label htmlFor="admin-upload" className="camera-icon1">
                  <FaCamera />
                </label>
                <input
                  type="file"
                  id="admin-upload"
                  hidden
                  onChange={handleProfileChange}
                  accept="image/*"
                />
              </div>
              <button className="logout-btn" onClick={() => navigate("/")}>
                Logout
              </button>
            </div>
          </div>

          <div className="uploads-section">
            <h3>Manage User Uploads</h3>
            {uploads.length === 0 ? (
              <p className="no-uploads-msg">No user uploads yet! Check back later.</p>
            ) : (
              uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="user-upload-card"
                  onClick={() => handleCardClick(upload.username, upload.id)}
                >
                  <img
                    src={`${API}/${upload.profileImage}`}
                    alt={upload.name}
                    className="card-profile-pic"
                  />
                  <div className="card-user-info">
                    <p className="card-name">{upload.name}</p>
                    <p className="card-username">@{upload.username}</p>
                  </div>
                  <div className="card-status">
                    <span className={`status ${upload.status}`}>
                      {upload.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
