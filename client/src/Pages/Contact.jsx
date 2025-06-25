import React from 'react';
import './CSS/Contact.css';
import Navbar from './Navbar';
import Footer from './Footer';
import ec24 from '../Components/Assets/ec24.png';
import ec25 from '../Components/Assets/ec25.png';

import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';



const Contact = () => {
  return (
    <>
          <Navbar/>

          <div className="hero-container1">
                <div
                  className="hero-slide1"
                  style={{
                    backgroundImage: `url(${ec24})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100vh',
                    position: 'relative',
                  }}
                >
                    <div className="overlay1">
                    <div className="hero-content1 ">
                      <h1>Contact Us</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section4">
        <h1 >Contact Eco-GreenCred</h1>
        <p >For specific enquiries to
        Eco-GreenCred, use the contact information below.</p>
      </div>

      <div className="famfa-history-container1">
  <div className="background-left1" style={{ backgroundColor: "rgb(5, 49, 5)" }}>
    <div className="footer__link--items" style={{ marginTop: '5vh' }}>
      <h2 className='rep' >Eco-GreenCred Details</h2>
      <button className='but'>
        <FiMapPin className='gru1'  />
        Lagos,Nigeria
      </button>
      <button className='but'>
        <FiPhone className='gru' />
        +234(0)7044765385
      </button>
      <button className='but'>
        <FiMail className='gru' />
        oluferonmijoshua@gmail.com
      </button>
    </div>
  </div>

  <div className="background-right1" style={{ backgroundColor: "rgb(253, 128, 10)" }}>
    <div className="circle-wrapper1">
      <img src={ec25} alt='' className="circle-image1" />
    </div>
  </div>
</div>


    <Footer/>

    </>
  )
}

export default Contact
