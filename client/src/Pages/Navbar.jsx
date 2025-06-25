import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import el from '../Components/Assets/el.png';




const Navbar = () => {

  
    const [activeLink, setActiveLink] = useState('home'); // Track the active link
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
     const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLinkClick = (link) => {
      setActiveLink(link); // Set the clicked link as active
  
    };
  
   

  return (
    <div className="navbar">
        <div className="logo-section">
          <div className="logo-circle">
            <img src={el} alt='' className="logo-image"/>
          </div>
          <span className="logo-text">Eco-GreenCred</span>
        </div>

        <div className="hamburger" onClick={toggleMobileMenu}>
    {mobileMenuOpen ? "✕" : "☰"}
  </div>

  <ul className={`menu ${mobileMenuOpen ? "open" : ""}`}>
  <Link to="/" style={{ textDecoration: "none" }}>
    <li
      onClick={() => handleLinkClick('home')}
      className={activeLink === 'home' ? 'active' : ''}
    >
      HOME
    </li>
  </Link>

  <Link to="/teams_expertise" style={{ textDecoration: "none" }}>
    <li  onClick={() => handleLinkClick('contact')}
      className={activeLink === 'contact' ? 'active' : ''}>
      TEAMS
    </li>
  </Link>
  

  <Link to="/company_contacts" style={{ textDecoration: "none" }}>
    <li
      onClick={() => handleLinkClick('contact')}
      className={activeLink === 'contact' ? 'active' : ''}
    >
      CONTACT US
    </li>
  </Link>
</ul>

      </div>
  )
}

export default Navbar
