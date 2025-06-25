import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';


import './CSS/AdminLogin.css';


const AdminLogin = () => {
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminName, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
        <div className='grp'>            
                  <Link to="/modeselect" style={{ textDecoration: "none" }}>
                   <div className="back-arrow">
                      <FiArrowLeft size={24} />
                    </div></Link> 
                    <h3 className='hi'> Click arrow above to go back if not admin to select user mode</h3> 
                    </div>
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <input
          className="admin-login-input"
          type="text"
          placeholder="Admin Name"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          required
        />
        <input
          className="admin-login-input"
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="admin-login-error">{error}</p>}
        <button className="admin-login-button" type="submit">Login</button>
      </form>
    </div>

        </>

  );
};

export default AdminLogin;
