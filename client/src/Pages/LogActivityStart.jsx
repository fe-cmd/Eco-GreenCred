import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import './CSS/LogActivityStart.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LogActivityStart = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  return (

     <>
           <div className='grp'>            
              <Link to={`/dashboard/${username}`} style={{ textDecoration: "none" }}>
               <div className="back-arrow">
                  <FiArrowLeft size={24} />
                </div></Link> 
                </div>

    <div className="log-activity-start-container">
          <h1 className="eco-heading">Log Your Eco-Friendly Activities</h1>
      <FaPlusCircle className="eco-plus-icon" onClick={() => navigate(`/log-activity/${username}/upload`)}/>
      <p className="eco-subtext">Keep track of actions like reducing waste, 
      saving energy, and using sustainable transportation. Kindly click the plus or next icon to begin.</p>
      <button className="progress-btn1" onClick={() => navigate(`/log-activity/${username}/upload`)}>
        Next 
      </button>
    </div>
    </>
  );
};

export default LogActivityStart;
