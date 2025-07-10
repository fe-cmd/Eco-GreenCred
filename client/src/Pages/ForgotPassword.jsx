// src/Pages/ForgotPassword.jsx
import React, { useState } from "react";
import './CSS/LoginSignup.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import ec29 from '../Components/Assets/ec29.png';

const API = process.env.REACT_APP_API || "http://localhost:5000";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      return setError("Passwords do not match.");
    }
    try {
      const res = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/auth"), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="background-wrapper" style={{ backgroundImage: `url(${ec29})` }}>
      <div className="overlay-container">
        <div className="grp2">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <FiArrowLeft size={24} />
          </Link>
          <h2 className='hi'>Back to login page</h2>
        </div>

        <div className="login-signup-container">
          <h2 className="login-signup-title">Reset Your Password</h2>
          <form className="login-signup-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-signup-input"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="login-signup-input"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="login-signup-input"
              required
            />
            {error && <p className="login-signup-error">{error}</p>}
            {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
            <button type="submit" className="login-signup-button">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
