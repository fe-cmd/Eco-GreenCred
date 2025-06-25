import React, { useState } from "react";
import './CSS/LoginSignup.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ec29 from '../Components/Assets/ec29.png'; // ✅ Import the background image

const API = process.env.REACT_APP_API || "";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    occupation: ""
  });
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      occupation: ""
    });
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/signup";

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (isLogin) {
        window.location.href = `/dashboard/${data.username}`;
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="background-wrapper"
      style={{ backgroundImage: `url(${ec29})` }}
    >
      <div className="overlay-container">
        <div className="grp2">
          <Link to="/modeselect" style={{ textDecoration: "none", color: "white" }}>
            <FiArrowLeft size={24} />
          </Link>
          <h2 className='hi'>Click arrow to go back to select mode</h2>
        </div>

        <div className="login-signup-container">
          <h2 className="login-signup-title">{isLogin ? "Login" : "Sign Up"}</h2>
          <form className="login-signup-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="login-signup-input" />
                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="login-signup-input" />
                <input name="occupation" placeholder="Career Occupation" value={form.occupation} onChange={handleChange} required className="login-signup-input" />
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="login-signup-input" />
              </>
            )}
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="login-signup-input" />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="login-signup-input" />
            {!isLogin && (
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className="login-signup-input" />
            )}
            {error && <p className="login-signup-error">{error}</p>}
            <button className="login-signup-button" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>
          <p onClick={toggleMode} className="login-signup-toggle">
            {isLogin ? "New here? Sign Up" : "Already registered? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;