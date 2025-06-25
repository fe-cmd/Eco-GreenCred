import React, { useState } from "react";
import './CSS/Onboard.css';
import ec16 from "../Components/Assets/ec16.png";
import ec19 from "../Components/Assets/ec19.png";
import ec11 from "../Components/Assets/ec11.png";
import { FiArrowRight } from 'react-icons/fi'; // Import the arrow icon

import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';




const onboardingData = [
  {
    title: "Welcome To Eco-GreenCred",
    description:
      "Your go-to platform for rewarding everyday green actions and Earn while you go green",
    image: ec16, // Replace with actual image paths
  },
  {
    title: "Get attuned with us!",
    description: "Explore to earn for eco-sustainability",
    image: ec19, // Replace with actual image paths
  },
  {
    title: "Get inspired by Eco-Friendly impact",
    description: "Make every green step count toward a better community.",
    image: ec11, // Replace with actual image paths
  },
];

function Onboard() {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Redirect to the page when on the last slide
          window.location.href = "/modeselect"; // Replace with your desired page route
        }
      };
    
      
    
      // Helper function to calculate circular indices
      const getLeftIndex = (index) => {
        return index === 0 ? onboardingData.length - 1 : index - 1;
      };
    
      const getRightIndex = (index) => {
        return index === onboardingData.length - 1 ? 0 : index + 1;
      };
    
      return (

        <>

        <Link to="/" style={{ textDecoration: "none" }}>
             <div className="back-arrow">
                <FiArrowLeft size={24} />
              </div></Link>

        <div className="onboarding-container">
          <div className="slider1">
            <div className="slide1">
            <div className="text-content">
                <h1>{onboardingData[currentIndex].title}</h1>
                <p>{onboardingData[currentIndex].description}</p>
              </div>
              <div className="image-group1">
                {/* Left Smaller Image */}
                <img
                  src={onboardingData[getLeftIndex(currentIndex)].image}
                  alt="left side"
                  className="side-image"
                />
                {/* Main Image */}
                <img
                  src={onboardingData[currentIndex].image}
                  alt={`slide-${currentIndex}`}
                  className="main-image"
                />
                {/* Right Smaller Image */}
                <img
                  src={onboardingData[getRightIndex(currentIndex)].image}
                  alt="right side"
                  className="side-image"
                />
              </div>
              
            </div>
          </div>
    
          {/* Pagination Bar */}
          <div className="pagination">
            {onboardingData.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
              ></span>
            ))}
          </div>
    
          {/* Next Button */}
          <button className="next-button" onClick={handleNext}>
        <FiArrowRight className="arrow-icon" />
        </button>
        </div>

        </>
      );
  }
  

export default Onboard;
