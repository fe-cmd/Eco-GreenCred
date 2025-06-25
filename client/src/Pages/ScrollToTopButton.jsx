import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './CSS/ScrollToTopButton.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollY / totalHeight;
      setIsVisible(scrollPercent > 0.15);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button className={`scroll-button ${isVisible ? 'show' : ''}`} onClick={scrollToTop}>
      <FaArrowUp size={18} />
    </button>
  );
};

export default ScrollToTopButton;
