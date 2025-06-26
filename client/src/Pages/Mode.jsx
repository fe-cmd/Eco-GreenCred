import React, { useState } from 'react';
import './CSS/Mode.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate  } from 'react-router-dom';




function Mode() {
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook


  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    const targetRoute = mode === 'admin' ? '/admin_auth' : '/auth';
    setTimeout(() => {
      navigate(targetRoute);
    }, 2000); // Delay for 2000 milliseconds (2 seconds)
  };
  

  return (
    <div className="vc">
    <div className="login-container">
      <div className="back-button">
        <Link to="/page-loading">
            <FaArrowLeft className="back-arrow" />
          </Link>
        </div>

      <h2 className='int'>Choose Mode</h2>
      <p className='int'>Dear Users choose the box applicable to You. Note!: Admin box is restricted from users</p>

      <div className="mode-options">
        <div
          className={`mode-option ${selectedMode === 'admin' ? 'active' : ''}`}
          onClick={() => handleModeChange('admin')}
        >
          <div className={`header-container ${selectedMode === 'admin' ? 'active' : ''}`}>
            <h3>Admins/Server</h3>
          </div>
          <hr className={`hover-line ${selectedMode === 'admin' ? 'active' : ''}`} />
          <p>Admin management only!!!</p>
          {selectedMode === 'admin' ? (
            <div className="check-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.5 10.5L8.5 14.5L15.5 7.5"
                  stroke="#280769"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="radio-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#280769" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>

        <div
          className={`mode-option ${selectedMode === 'user' ? 'active' : ''}`}
          onClick={() => handleModeChange('user')}
        >
          <div className={`header-container ${selectedMode === 'user' ? 'active' : ''}`}>
            <h3>Users</h3>
          </div>
          <hr className={`hover-line ${selectedMode === 'user' ? 'active' : ''}`} />
          <p>Dear Users, welcome. Kindly click this box to Begin, Thanks.</p>
          {selectedMode === 'user' ? (
            <div className="check-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.5 10.5L8.5 14.5L15.5 7.5"
                  stroke="#280769"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="radio-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#280769" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Mode;