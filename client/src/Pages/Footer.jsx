import { Link } from 'react-router-dom';
import React from 'react';
import el from '../Components/Assets/el.png';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaRegCopyright, FaUsers  } from 'react-icons/fa';


const Footer = () => {
  return (
    <div className='footer'>
  <div className="footer__container">
    <div className="footer__links">
      <div className="footer__link--wrapper">
        <div className="logo-section1">
          <div className="logo-circle1" style={{ width: '200px', height: '100px' }}>
            <img src={el} alt='' className="logo-image1" style={{ width: '200px', height: '100px' }} />
          </div>
          <span className="logo-text1">Eco-GreenCred</span>
        </div>
      </div>
      <div className="footer__link--wrapper">
        <div className="footer__link--items">
          <h2>Our Team</h2>
          <Link to="/teams_expertise" style={{ textDecoration: "none" }}>
            <button><FaUsers style={{ marginRight: '8px', fontSize: '30px', color: 'rgb(253, 128, 10)' }} />Who We Are</button>
          </Link>
          
          <Link to="/company_contacts" style={{ textDecoration: "none" }}>
            <button><FiPhone style={{ marginRight: '8px', fontSize: '30px', color: 'rgb(253, 128, 10)' }} />Contact us</button>
          </Link>
         
        </div>
      </div>

      <div className="footer__link--wrapper">
        <div className="footer__link--items">
          <h2>Contact</h2>
          <button><FiMapPin style={{ marginRight: '8px', fontSize: '20px', color: 'rgb(253, 128, 10)' }} /> Lagos, Nigeria</button>
          <button><FiPhone style={{ marginRight: '8px', fontSize: '20px', color: 'rgb(253, 128, 10)' }} /> +234(0)7044765385</button>
          <button><FiMail style={{ marginRight: '8px', fontSize: '20px', color: 'rgb(253, 128, 10)' }} /> samueloluola.a@gmail.com </button>
        </div>
      </div>
    </div>
  </div>
  <div style={{ width: '100%', maxWidth: "900px", justifySelf: 'center', marginTop: "50px" }}>
    <hr />
    <p className="website__right">
      <FaRegCopyright style={{ marginRight: '6px', verticalAlign: 'middle' }} />
      2025 Eco-GreenCred All rights reserved.
    </p>
    <p className="website__right1">
      Redefining the Future of Ecology by Inspiring Action, Fostering Circular Economies, and Protecting Biodiversity at Every Step
    </p>
  </div>
</div>

  )
}

export default Footer
