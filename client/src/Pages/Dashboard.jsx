import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlusCircle, FaGift, FaCoins, FaCamera, FaSignOutAlt } from "react-icons/fa";
import './CSS/Dashboard.css';
import ec28 from '../Components/Assets/ec28.png'; // ✅ JSX-based background image
import ec13 from '../Components/Assets/ec13.png'; // ✅ JSX-based background image


const API = process.env.REACT_APP_API || "";

const tipsList = [
  "🌱 Turn off lights when not in use.",
  "🌿 Plant a tree today.",
  "🌍 Use reusable water bottles.",
  "♻️ Recycle plastics and papers.",
  "🚲 Ride a bike instead of driving.",
  "⚡ Switch to renewable energy.",
  "🛍️ Bring reusable bags for shopping.",
  "🌊 Conserve water whenever possible.",
  "🌞 Use solar-powered devices.",
  "🐝 Protect pollinators by avoiding pesticides."
];

const Dashboard = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetch(`${API}/user/${username}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setPreviewImage(data.profileImage ? `${API}/${data.profileImage}` : "/ec26.png");
      })
      .catch(err => console.error("Error fetching user:", err));
  }, [username]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tipsList.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => navigate('/');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API}/upload-profile/${username}`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setPreviewImage(`${API}/${data.profileImage}`);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  if (!user) return <p>Loading...</p>;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="dashboard-container">
      <div className="top-bar">
        <div className="greeting">
          <h1>Hello,</h1>
          <h2>{firstName}</h2>
        </div>
        <div className="profile-wrapper">
          <div className="profile-left">
            <img src={previewImage} alt="Profile" className="profile-pic" />
            <label htmlFor="upload" className="camera-icon" title="Change Photo">
              <FaCamera />
            </label>
            <input type="file" id="upload" hidden onChange={handleImageChange} accept="image/*" />
          </div>
          <button className="logout-text-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="points-card">
        <div className="points-value">
          <FaCoins color="#FFD700" size={30} />
          <span>{user.points || 0} pts</span>
        </div>
      </div>

      <div className="dashboard-buttons">
        <div className="action-card" onClick={() => navigate(`/log-activity/${username}/start`)}>
          <FaPlusCircle size={30} className="action-icon" />
          <span className="action-text">Log Activity</span>
        </div>
        <div className="action-card" onClick={() => navigate(`/rewards/${username}/start`)}>
          <FaGift size={30} className="action-icon" />
          <span className="action-text">Redeem Rewards</span>
        </div>
      </div>
      
      <div className="bla">
      <img
                  src={ec28}
                  alt="lad"
                  className="mains"
                />
                  <img
                  src={ec13}
                  alt="lad"
                  className="mains"
                />
                  
                </div>

      <div className="tip-box">
        <h4>Sustainability Tip of the Day</h4>
        <p>{tipsList[currentTipIndex]}</p>
      </div>

       <div className="quiz-box">
        <h4>Eco-GreenCred Challenges you</h4>
        <p>Take our Quiz to earn more <FaCoins color="#FFD700" size={30} /> points, to see how knowledgeable you are.</p>
        <button className="quiz-btn" onClick={() => navigate(`/quiz-intro/${username}`)}>Access Quiz!</button>
      </div>

      <div className="progress-btn-group">
        <button className="progress-btn" onClick={() => navigate(`/progress/${username}`)}>View Progress</button>
        <button className="progress-btn3" onClick={() => navigate(`/partner/${username}/start`)}>Partner with Eco-GreenCred</button>
      </div>

      <button className="progress-btn2" onClick={() => navigate(`/leaderboard/${username}`)}>
        View current rank among others!
      </button>

     
    </div>
  );
};

export default Dashboard;
