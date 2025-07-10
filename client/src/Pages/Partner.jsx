import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { GiSeedling } from "react-icons/gi";
import bg from "../Components/Assets/bg.png";
import "./CSS/Partner.css";

const Partner = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  return (
    <div
      className="leaderboard-container2"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat-y",
        backgroundPosition: "center",
      }}
    >
      <div className="leaderboard-overlay2">
        <div className="leaderboard-header2">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="back-arrow4">←</span>
          </Link>
          <h2>Partner With Us</h2>
        </div>

        <div className="partner-content">
          <h1 className="eco-heading">ECOGREENCRED</h1>
          <GiSeedling className="eco-plus-icon" size={48} color="green" />
          <p className="eco-subtext">
            Join or partner with us in making a difference for the environment
          </p>
          <button
            className="progress-btn1"
            onClick={() => navigate(`/partner/${username}/start`)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Partner;
