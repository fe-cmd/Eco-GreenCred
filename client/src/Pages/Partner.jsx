import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GiPlantSeed, GiSeedling } from "react-icons/gi";
import { TbPlant2 } from "react-icons/tb";
import './CSS/Partner.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Partner = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  return (

     <>
           <div className='grp'>            
              <Link to="/" style={{ textDecoration: "none" }}>
               <div className="back-arrow">
                  <FiArrowLeft size={24} />
                </div></Link> 
                </div>

    <div className="log-activity-start-container">
          <h1 className="eco-heading">ECOGREENCRED</h1>
      <GiSeedling className="eco-plus-icon" />
      <p className="eco-subtext">Join or partner with us in making a difference for the environment</p>
      <button className="progress-btn1"  onClick={() => navigate(`/partner/${username}/start`)}>
        Next 
      </button>
    </div>
    </>
  );
};

export default Partner;
