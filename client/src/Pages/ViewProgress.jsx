import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import "./CSS/ViewProgress.css";

const API = process.env.REACT_APP_API || "http://localhost:5000";

const ViewProgress = () => {
  const { username } = useParams();
  const [uploads, setUploads] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [popupImage, setPopupImage] = useState(null); // for enlarged preview

  useEffect(() => {
    fetch(`${API}/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setUploads(data.uploads || []);
        setUserPoints(data.points || 0);
      });

    const interval = setInterval(() => {
      fetch(`${API}/check-status/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setStatusMessage(data.message);

            fetch(`${API}/user/${username}`)
              .then((res) => res.json())
              .then((data) => {
                setUploads(data.uploads || []);
                setUserPoints(data.points || 0);
              });

            setTimeout(() => setStatusMessage(""), 4000);
          }
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [username]);

  const handleImageClick = (imgUrl) => {
    setPopupImage(imgUrl);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  const resolveUrl = (path) =>
    path?.startsWith("http") ? path : `${API}/${path}`;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <Link to={`/dashboard/${username}`} className="back-arrow">
          <FiArrowLeft size={24} style={{ color: "orange" }} />
        </Link>
        <div className="prg">
          <h2 className="progress-title">Your Uploaded Items</h2>
          <p className="par">
            NOTE: Kindly stay calm while we go over your post & note that it may
            be approved or declined by our Server soon, and if approved already,
            congratulations for the earned points and if declined, don't give up
            for you can try better next time, Thank you!.
          </p>
        </div>
      </div>

      {statusMessage && <div className="status-popup">{statusMessage}</div>}

      {uploads.length === 0 ? (
        <p className="no-uploads">
          There are no uploads yet, kindly go to log-activity to upload your
          activities.
        </p>
      ) : (
        <div className="upload-list">
          {uploads.map((upload, i) => (
            <div key={i} className="upload-card">
              {upload.fileType === "video" ? (
                <video
                  src={resolveUrl(upload.filePath)}
                  controls={upload.status === "approved"}
                  className="vid-up"
                />
              ) : Array.isArray(upload.filePath) ? (
                <div className="image-group">
                  {upload.filePath.map((img, index) => (
                    <img
                      key={index}
                      src={resolveUrl(img)}
                      alt={`Group ${i}-${index}`}
                      className="group-image-thumb"
                      onClick={() => handleImageClick(resolveUrl(img))}
                    />
                  ))}
                </div>
              ) : (
                <img
                  src={resolveUrl(upload.filePath)}
                  alt="Upload preview"
                  className="upload-image"
                  onClick={() => handleImageClick(resolveUrl(upload.filePath))}
                />
              )}

              <div className="upload-info">
                <span className="activity-type">{upload.activityType}</span>

                {upload.status === "approved" && (
                  <div className="upload-points">
                    <FaCoins className="coin-icon" />
                    {upload.points} pts
                  </div>
                )}

                <span className={`status-badge ${upload.status}`}>
                  {upload.status}
                </span>
              </div>

              <p className="upload-description">{upload.description}</p>
            </div>
          ))}
        </div>
      )}

      {popupImage && (
        <div className="image-popup-overlay" onClick={closePopup}>
          <img
            src={popupImage}
            alt="Enlarged"
            className="image-popup-content"
          />
        </div>
      )}
    </div>
  );
};

export default ViewProgress;
