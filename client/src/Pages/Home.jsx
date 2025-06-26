import React, { useEffect, useRef, useState } from 'react';
import './CSS/Home.css';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import bg from '../Components/Assets/bg.png';
import ec1 from '../Components/Assets/ec1.png';
import ec2 from '../Components/Assets/ec2.png';
import ec3 from '../Components/Assets/ec3.png';
import ec4 from '../Components/Assets/ec4.png';
import ec6 from '../Components/Assets/ec6.png';
import ec14 from '../Components/Assets/ec14.png';
import ec15 from '../Components/Assets/ec15.png';
import ec17 from '../Components/Assets/ec17.png';
import ec18 from '../Components/Assets/ec18.png';
import ec20 from '../Components/Assets/ec20.png';
import tp from '../Components/Assets/tp.png';

import Navbar from './Navbar';
import Footer from './Footer';
import Teams from './Teams';


const slides = [
    {
      image: bg,
      title: "Welcome to Eco-GreenCred",
      description:
"an ecological engagement sustainability rewards platform"    },
    {
      image: ec1,
      title: "Exclusive eco-friendly application",
      description:
"Login and signup today to begin your Journey into a safe eco-environment and earnings"    },
    {
      image: ec4,
      title: "A push in human-energy sustainability ",
      description:
"Take on sustainability energy challenges to help improve ecological environments and wildlife conservations"    },
    {
      image: ec2,
      title: "Effective User management and Verification",
      description:
"get verified and approved for every challenges done posted on our platforms to earn high points"    },
    {
      image: ec3,
      title: "Effective Admin-Server Point tracking System",
      description:
"Keep track of your points from management on our server side by Admin panels to improve your eco-activities"    },
    {
      image: ec20,
      title: "Earn via points generated from our platform",
      description:
"Acquire more points to earn from our platform at Eco-GreenCred to boost users support  to care more for eco, energy & wildlife conservations"    },
   {
      image: ec6,
      title: "Backend generated eco-Quiz enlightment",
      description:
"Test more on your knowledge to boost your level of productivity in eco-friendly nature and energy sustainability & earn more points." },
];
  
  
const slideVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };




const Home = () => {
const [index, setIndex] = useState(0);  
const topRef = useRef(null);
const bottomRef = useRef(null);
const [topInView, setTopInView] = useState(false);
const [bottomInView, setBottomInView] = useState(false);
const { username } = useParams();
const navigate = useNavigate();

useEffect(() => {

  // Store current ref values in variables
  const currentTopRef = topRef.current;
  const currentBottomRef = bottomRef.current;

    const topObserver = new IntersectionObserver(
      ([entry]) => setTopInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    const bottomObserver = new IntersectionObserver(
      ([entry]) => setBottomInView(entry.isIntersecting),
      { threshold: 0.5 }
    );

     if (currentTopRef) topObserver.observe(currentTopRef);
  if (currentBottomRef) bottomObserver.observe(currentBottomRef);

return () => {
      // Use the variables in the cleanup
    if (currentTopRef) topObserver.unobserve(currentTopRef);
    if (currentBottomRef) bottomObserver.unobserve(currentBottomRef);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

    useEffect(() => {
      const section2 = document.querySelector('.section2');
  
      // Create an intersection observer to detect when the section is in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add 'in-view' class to animate image and change background color
              section2.classList.add('in-view');
            } else {
              // Remove 'in-view' class when not in view
              section2.classList.remove('in-view');
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of the section is in view
      );
  
      observer.observe(section2);
  
      return () => observer.disconnect();
    }, []);
  

  return (
    <>
      <Navbar/>
      
      <div className="hero-container">
        <AnimatePresence mode="wait">
        <motion.div
  key={index}
  className="hero-slide"
  variants={slideVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 1 }}
>
  <div
    className="background-zoom"
    style={{ backgroundImage: `url(${slides[index].image})` }}
  ></div>

  <div className="overlay">
    <div className="hero-content">
      <h1>{slides[index].title}</h1> 
      <p>{slides[index].description}</p>  
      <div className="hero-buttons">
      <Link to="/page-loading" style={{ textDecoration: "none" }}>
      <button className="read-more-button">Get Started →</button></Link>
    </div>
  </div>
  </div>

  
</motion.div>
        </AnimatePresence>
      </div>

       <div className="section1">
        <h1>Shaping the Future of eco-friendly & sustainable environment</h1>
        <p>Eco-GreenCred is a youth-focused sustainability rewards program that encourages humans to take eco-friendly actions like recycling, tree planting, volunteering, and wildlife conservation. Each verified action earns GreenCred points, which can be tracked through our digital platform. These points are redeemable for cash-based support, helping individuals make a real impact while being rewarded for their environmental contributions.
The platform features weekly challenges, community missions, and climate literacy content to boost engagement. GreenCred promotes a culture of responsibility, innovation, and environmental awareness among people. By turning everyday green actions into tangible value, it empowers youth to lead change in their communities. With every action, humans help build a cleaner, more sustainable future for the society — protecting both the planet and its wildlife.
</p>
        <Link to="/page-loading" style={{ textDecoration: "none" }}>
        <button>Get Started Now! →</button></Link>
      </div>

      <div className="section2">
        <div className="leftview">
        <h1>Explore to Feel our Impact</h1>
        <p>Discover Eco-GreenCred — a response to the real challenges limiting youth participation in sustainability. Without immediate rewards, structure, or social motivation, eco-actions often go unrecognized.
Eco-GreenCred solves this by turning everyday green behaviors into trackable points and cash-based rewards. Through digital tools, peer influence, and climate education, we empower young people to act sustainably — for both the planet and their personal growth.
</p>
        <Link to="/page-loading" style={{ textDecoration: "none" }}>
        <button>Explore Now! →</button></Link>
        </div>
        <div className="rightview">
            <img className="imgside" src={tp} alt=''/>
        </div>
      </div>

      <div className="image-layout-wrapper">
  <img src={ec17} alt="Left" className="side-image left" />

  {/* Trigger for TOP image */}
  <div ref={topRef} className="trigger-area top-trigger">
    <div className={`middle-image top ${topInView ? 'animate-down' : 'initial-white'}`}>
      <img src={ec14} alt="Top" />
    </div>
  </div>

  {/* Trigger for BOTTOM image */}
  <div ref={bottomRef} className="trigger-area bottom-trigger">
    <div className={`middle-image bottom ${bottomInView ? 'animate-up' : 'initial-white'}`}>
      <img src={ec15} alt="Bottom" />
    </div>
  </div>

  <img src={ec18} alt="Right" className="side-image right" />
</div>
       
      <Teams/>

        <button className="progress-btn4" onClick={() => navigate(`/partner/${username}/start`)}>Partner with Eco-GreenCred</button>



      <h1>Hello World!!!</h1>

      <Footer />
    </>
  )
}

export default Home
