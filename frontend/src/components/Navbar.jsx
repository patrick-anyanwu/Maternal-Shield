// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for redirection
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle navigation click
  const handleNavClick = (link) => {
    setActiveLink(link);
    setMobileMenuOpen(false);

    if (link === 'home') {
      // Navigate to homepage
      navigate('/');
    } else if (link === 'features') {
      // Scroll to features section
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        window.scrollTo({
          top: featuresSection.offsetTop - 80,
          behavior: 'smooth'
        });
      } else {
        // If features section not found on current page, navigate to homepage with features hash
        navigate('/#features');
      }
    } else if (link === 'pm25') {
      // Navigate to PM2.5 page
      navigate('/pm25');
    } else if (link === 'heatwave') {
      // Navigate to Heatwave page
      navigate('/heatwave');
    } else if (link === 'knowledge-garden') {
      // Navigate to Symptom Tracker page
      navigate('/knowledge-garden');
    } else {
      // For other links, just smooth scroll if section exists
      const element = document.getElementById(link);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      
        <div className="navbar-logo" onClick={() => handleNavClick('home')}>
          <div className="logo-container">
            <img src="../assets/logo.png" alt="MaternalShield Logo" className="logo-img" />
          </div>
          
          <h1 className="brand-name">
            <span className="maternal">Maternal</span>
            <span className="shield">Shield</span>
          </h1>
        </div>

        <div className="nav-links" role="navigation">
          <span 
            className={activeLink === 'home' ? 'active' : ''}
            onClick={() => handleNavClick('home')}
            role="button"
            tabIndex="0"
            aria-label="Home page"
          >
            Home
          </span>
          <span 
            className={activeLink === 'heatwave' ? 'active' : ''}
            onClick={() => handleNavClick('heatwave')}
            role="button"
            tabIndex="0"
            aria-label="Heatwave Education page"
          >
            Heatwave
          </span>
          <span 
            className={activeLink === 'pm25' ? 'active' : ''}
            onClick={() => handleNavClick('pm25')}
            role="button"
            tabIndex="0"
            aria-label="PM2.5 Education page"
          >
            Air Pollution
          </span>
          <span 
            className={activeLink === 'knowledge-garden' ? 'active' : ''}
            onClick={() => handleNavClick('knowledge-garden')}
            role="button"
            tabIndex="0"
            aria-label="Knowledge Garden page"
          >
            Knowledge Garden
          </span>
        </div>
        
        <button className="mobile-menu-btn" 
          onClick={toggleMobileMenu} 
          aria-expanded={mobileMenuOpen} 
          aria-label="Toggle navigation menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
          <span 
            className={activeLink === 'home' ? 'active' : ''}
            onClick={() => handleNavClick('home')}
          >
            Home
          </span>
          <span 
            className={activeLink === 'features' ? 'active' : ''}
            onClick={() => handleNavClick('features')}
          >
            Features
          </span>
          <span 
            className={activeLink === 'heatwave' ? 'active' : ''}
            onClick={() => handleNavClick('heatwave')}
          >
            Heatwave
          </span>
          <span 
            className={activeLink === 'pm25' ? 'active' : ''}
            onClick={() => handleNavClick('pm25')}
          >
            PM2.5
          </span>
          <span 
            className={activeLink === 'knowledge-garden' ? 'active' : ''}
            onClick={() => handleNavClick('knowledge-garden')}
          >
            Knowledge Garden
          </span>
        </div>
        
        {/* Overlay for mobile menu */}
        <div 
          className={`overlay ${mobileMenuOpen ? 'visible' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      </nav>
    </>
  );
};

export default Navbar;