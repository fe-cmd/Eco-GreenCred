import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CSS/QuizPage.css';
import ec32 from '../Components/Assets/ec32.png'; // Adjust path if different

const API = process.env.REACT_APP_API || "";


const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(120);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API}/quiz/start/${username}`);
        const data = await res.json();
        if (data.message) {
          alert(data.message);
          navigate(`/dashboard/${username}`);
        } else {
          setQuestions(data.questions);
          setSelectedOptions(Array(data.questions.length).fill(null));
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        navigate(`/dashboard/${username}`);
      }
    };
    fetchQuiz();
  }, [username, navigate]);

  useEffect(() => {
    if (timer > 0 && !submitted) {
      const id = setTimeout(() => setTimer(prev => prev - 1), 1000);
      return () => clearTimeout(id);
    } else if (timer === 0 && !submitted) {
      handleSubmit();
    }
  }, [timer, submitted]);

  const handleAnswer = (option) => {
    if (submitted || selectedOptions[current] !== null) return;
    const updated = [...selectedOptions];
    updated[current] = option;
    setSelectedOptions(updated);

    if (option === questions[current].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    const answersPayload = questions.map((q, i) => ({
      question: q.question,
      selected: selectedOptions[i]
    }));

    setSubmitted(true);

    try {
      await fetch(`${API}/quiz/submit/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersPayload })
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }

    setTimeout(() => {
      navigate(`/quiz/${username}/result`, { state: { score } });
    }, 1500);
  };

  if (questions.length === 0) return <div className="quiz-loading">Loading quiz...</div>;

  const q = questions[current];

  return (
    <div className="quiz-background" style={{ backgroundImage: `url(${ec32})` }}>
      <div className="quiz-overlay">
        <div className="quiz-page">
          <div className="quiz-header">
            <h2>Eco Quiz</h2>
            <div className="timer">
              ⏱️ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="quiz-body">
            <h3>Q{current + 1}. {q.question}</h3>
            <ul className="quiz-options">
              {q.options.map((opt, idx) => {
                const selected = selectedOptions[current] === opt;
                const isCorrect = selected && opt === q.answer;
                const isWrong = selected && opt !== q.answer;
                const showCorrect = selectedOptions[current] !== null && opt === q.answer;

                return (
                  <li
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    className={`option ${selected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${showCorrect && !isCorrect ? 'correct' : ''}`}
                  >
                    {opt}
                    {selected && isCorrect && <span style={{ color: 'green', marginLeft: 8 }}>✔</span>}
                    {selected && isWrong && <span style={{ color: 'red', marginLeft: 8 }}>✘</span>}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="quiz-footer">
            <button onClick={() => setCurrent(p => Math.max(p - 1, 0))} disabled={current === 0}>
              Previous
            </button>
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent(p => Math.min(p + 1, questions.length - 1))}>
                Next
              </button>
            ) : (
              <button onClick={handleSubmit}>Finish Quiz</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
