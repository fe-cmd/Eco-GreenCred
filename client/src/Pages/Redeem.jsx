import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaGift } from "react-icons/fa";
import './CSS/LogActivityStart.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Redeem = () => {
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
          <h1 className="eco-heading">Earn points and redeem rewards</h1>
      <FaGift className="eco-plus-icon" />
      <p className="eco-subtext">Collect points for each activity and redeem them for eco-friendly rewards and discounts</p>
      <button className="progress-btn1"  onClick={() => navigate(`/rewards/${username}/earn`)}>
        Next 
      </button>
    </div>
    </>
  );
};

export default Redeem;
