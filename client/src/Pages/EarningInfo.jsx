import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GiTwoCoins } from "react-icons/gi";
import { FaMoneyBillWave } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import ec27 from '../Components/Assets/ec27.png'; // ✅ background image

import './CSS/EarningInfo.css';

const EarningInfo = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const conversionRate = 1;

  useEffect(() => {
    fetch(`http://localhost:5000/user/${username}`)
      .then(res => res.json())
      .then(data => setPoints(data.points || 0))
      .catch(err => console.error(err));
  }, [username]);

  const nairaValue = points * conversionRate;

  return (
    <>
      

      <div
        className="earning-bg-wrapper"
        style={{
          backgroundImage: `url(${ec27})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      >
        <div className="log-activity-start-container earn-container">
        <div className='grp'>
        <Link to={`/dashboard/${username}`} style={{ textDecoration: "none" }}>
          <div className="back-arrow2">
            <FiArrowLeft size={24} />
            <p>Back</p>
          </div>
        </Link>
      </div>
          <h1 className="eco-heading">Points to Cash Conversion</h1>

          <div className="conversion-box">
            <div className="conversion-line">
              <span className="value-text">100</span>
              <GiTwoCoins className="eco-icon" />
              <span className="unit-text">pts</span>
              <FiArrowRight className="arrow-icon" />
              <span className="value-text">₦100</span>
              <FaMoneyBillWave className="money-icon" />
            </div>

            <p className="eco-subtext">Your earned money so far</p>

            <div className="conversion-line">
              <GiTwoCoins className="eco-icon" />
              <span className="value-text">{points}</span>
              <span className="unit-text">pts</span>
              <FiArrowRight className="arrow-icon" />
              <FaMoneyBillWave className="money-icon" />
              <span className="value-text">₦{nairaValue}</span>
            </div>
          </div>

          <button
            className="progress-btn1"
            onClick={() => navigate(`/rewards/${username}/earn`)}
          >
            Click to earn!
          </button>
        </div>
      </div>
    </>
  );
};

export default EarningInfo;
