import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa"; // Quiz icon
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import './CSS/QuizIntro.css';

const QuizIntro = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/quiz/${username}/start`);
  };

  return (
    <>
      <div className="grp">
        <Link to={`/dashboard/${username}`} style={{ textDecoration: "none" }}>
          <div className="back-arrow">
            <FiArrowLeft size={24} />
          </div>
        </Link>
      </div>

      <div className="quiz-intro-container">
        <FaQuestionCircle className="quiz-icon" />
        <h1 className="quiz-heading">Ready for the Quiz?</h1>
        <p className="quiz-text">
          You will be given <strong>10 questions</strong> and <strong>2 minutes</strong> to answer.
          Each quiz consists of 10 carefully crafted questions focused on sustainability, ecology, and green living.
        </p>
        <p className="quiz-text">
          Choose the best answer for each question before time runs out. Good luck and let’s see how eco-smart you are!
        </p>
        <button className="quiz-start-btn" onClick={handleStart}>
          Start Quiz!
        </button>
      </div>
    </>
  );
};

export default QuizIntro;
