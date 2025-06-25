import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCoins } from 'react-icons/fa';
import './CSS/Leaderboard.css';
import ec24 from '../Components/Assets/ec24.png';


const API = process.env.REACT_APP_API || "";

const Leaderboard = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [range, setRange] = useState("weekly");

  const fetchLeaderboard = () => {
    fetch(`${API}/leaderboard?range=${range}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching leaderboard:", err));
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // auto refresh every 5s
    return () => clearInterval(interval);
  }, [range]);

  return (
    <div className="leaderboard-container"
     style={{
    backgroundImage: `url(${ec24})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat-y',
    backgroundPosition: 'center',
    opacity: 1, // full visible container
  }}>
    <div className="leaderboard-overlay">

      <div className="leaderboard-header">
        <span className="back-arrow" onClick={() => navigate(`/dashboard/${username}`)}>←</span>
        <h2>Leaderboard</h2>
      </div>

      <div className="toggle-buttons">
        <button onClick={() => setRange("weekly")} className={range === "weekly" ? "active" : ""}>Weekly</button>
        <button onClick={() => setRange("monthly")} className={range === "monthly" ? "active" : ""}>Monthly</button>
      </div>

      <div className="leaderboard-list-header">
        <span>Rank</span>
        <span>Name</span>
        <span>Points</span>
      </div>

      {users.map((user, index) => (
        <div key={index} className="leaderboard-card">
          <span className="rank">{user.rank}</span>
          <div className="user-info">
            <img src={`${API}/${user.profileImage}`} alt="profile" />
            <span>{user.name}</span>
          </div>
          <div className="points">
            <FaCoins color="#FFD700" />
            <span>{user.points} pts</span>
          </div>
        </div>
      ))}
    </div>
      </div>

  );
};

export default Leaderboard;
