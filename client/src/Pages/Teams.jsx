import React from 'react';
import './CSS/Teams.css';
import ec30 from '../Components/Assets/ec30.jpeg';
//import ec23 from '../Components/Assets/ec23.PNG';
import ec31 from '../Components/Assets/ec31.jpeg';

import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';





const Teams = () => {
  return (
    <>  

    <div className='grp'>            
    <Link to="/" style={{ textDecoration: "none" }}>
     <div className="back-arrow">
        <FiArrowLeft size={24} />
      </div></Link> 
      <h2 className='hi'> Meet the Team Members</h2> 
      </div>

    <div className="layout-container">
          <div className="text-section">
            <h2>Team Lead: Samuel Adebanjo</h2>
            <p>Samuel Adebanjo is an Aerospace Engineering
student at Lagos State University, passionate about Astro-AeroIntelligence—the fusion of aerospace, robotics, and AI. With a strong drive for innovation
and impact, he created Eco-GreenCred to inspire Nigerian students to embrace sustainability through
a tech-driven, reward-based system. His goal is to
combine engineering with social responsibility to
create smarter, greener communities.
            </p>
          </div>
    
          <div className="image-section">
            <img src={ec31} alt="Offshore Facility 1" />
          </div>
       <div className="image-section">
            <img src={ec30} alt="Aerial View of Facility" />
          </div>
     <div className="text-section">
            <h2>Team Co-Lead: Samiat Animashaun</h2>
            <p>
          Samiat Animashaun is a mechanical engineering
student at Lagos State University with a passion
for sustainability, clean tech, and innovation. She has hands-on experience in CAD design and
IoT systems, and is exploring automation and machine learning for environmental solutions. As an active member of a student engineering
community, she contributes to projects like
Eco-GreenCred, using her technical skills and
teamwork to drive youth-led climate action.
                </p>      
                </div>
    
         
         {/*<div className="image-section">
            <img src={ec23} alt="Offshore Facility 2" />
          </div>
    
          <div className="text-section">
            <h2>Software(Fullstack) Engineer: Joshua Simidele Akinwole</h2>
            <p>
             Joshua Akinwole is a Computer Engineering student at Obafemi Awolowo University and founder of ENGISOL, a platform for expert web 
             and design solutions. With 4+ years of experience in full-stack development using Python/Django and React/Node.js, he builds scalable digital tools. Passionate about 
             both software and hardware—including robotics—his goal is to merge 
             engineering with real-world innovation for societal impact. 
            </p>
          </div> */}
    
         
        </div>
        </>
  )
}

export default Teams
