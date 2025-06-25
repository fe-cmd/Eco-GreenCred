import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaCoins, FaTrophy } from 'react-icons/fa';
import './CSS/QuizResultPage.css';

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useParams();

  const score = location.state?.score ?? 0;
  const percentage = (score / 10) * 100;
  const passed = score >= 5;

  return (
    <div className="quiz-result-page">
      <div className="quiz-result-container">
        <FaTrophy className="quiz-trophy-icon" />
        <h2>Thanks for taking up our eco-challenge</h2>
        <p>We believe you learnt well 🌱</p>

        <div className="score-display">
          <span className="score-text">Your Score: {score}/10</span>
          <span className="points-earned">
            <FaCoins style={{ color: 'gold' }} /> +{score} pts
          </span>
        </div>

        <div className="progress-bar-wrapper">
          <div
            className={`progress-bar-fill ${passed ? 'pass' : 'fail'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="result-status">
          {passed ? (
            <>
              <FaCheckCircle className="status-icon pass" />
              <p className="pass-text">Pass ✅ - Well done! Keep it up and do better next time.</p>
            </>
          ) : (
            <>
              <FaTimesCircle className="status-icon fail" />
              <p className="fail-text">Fail ❌ - You can do better next time. Don’t feel bad!</p>
            </>
          )}
        </div>

        <button className="exit-btn" onClick={() => navigate(`/dashboard/${username}`)}>
          Exit Quiz Area
        </button>
      </div>
    </div>
  );
};

export default QuizResultPage;
