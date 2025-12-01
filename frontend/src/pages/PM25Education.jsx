import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PM25Education.css'; // Make sure to update this path as needed

const PM25Education = () => {
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const [currentComparison, setCurrentComparison] = useState(0);

  const sizeComparisons = [
    {
      name: 'Human Hair',
      size: '50-70 micrometers',
      description: 'A human hair is about 30 times larger than PM2.5 particles',
      actualSize: 60, // micrometers
      color: '#e2c4f5' // Light purple to match the website
    },
    {
      name: 'Red Blood Cell',
      size: '~8 micrometers',
      description: 'Red blood cells are still 3-4 times larger than PM2.5',
      actualSize: 8, // micrometers
      color: '#ff99cc' // Pink to match the website
    },
    {
      name: 'PM2.5 Particle',
      size: '2.5 micrometers or smaller',
      description: 'Small enough to pass from lungs to bloodstream to placenta',
      actualSize: 2.5, // micrometers
      color: '#77e1ff' // Light blue to match the website
    },
    {
      name: 'Virus',
      size: '0.02-0.3 micrometers',
      description: 'Most viruses are even smaller than PM2.5 particles',
      actualSize: 0.1, // micrometers (average)
      color: '#b3fff0' // Light teal to match the website
    }
  ];

  // Calculate visual size based on actual size with improved scaling
  const getVisualSize = (actualSize) => {
    // Using logarithmic scale to better show differences between small particles
    const minVisualSize = 10; // Minimum size for smallest particles
    const maxVisualSize = 110; // Maximum size for largest particles
    
    // Using log scale to emphasize differences between small particles
    const scale = Math.log(actualSize + 1) / Math.log(sizeComparisons[0].actualSize + 1);
    
    // Apply scale and ensure minimum size
    return Math.max(scale * maxVisualSize, minVisualSize);
  };

  const navigateToAirPollutionImpact = () => {
    navigate('/air-pollution-impact');
  };

  // Function to move to the next comparison
  const showNextComparison = () => {
    setCurrentComparison((prev) => (prev + 1) % sizeComparisons.length);
  };

  // Function to move to the previous comparison
  const showPrevComparison = () => {
    setCurrentComparison((prev) => (prev === 0 ? sizeComparisons.length - 1 : prev - 1));
  };

  // Create stars for the background
  const createStars = () => {
    if (!starsRef.current) return;
    
    // Clear any existing stars first
    while (starsRef.current.firstChild) {
      starsRef.current.removeChild(starsRef.current.firstChild);
    }

    const starsContainer = starsRef.current;
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'pm25-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  };

  useEffect(() => {
    // Create background stars immediately
    createStars();
    
    // Set up automatic transition for size comparisons
    const autoTransitionInterval = setInterval(() => {
      showNextComparison();
    }, 5000); // Change every 5 seconds
    
    return () => {
      // Clear the interval when component unmounts
      clearInterval(autoTransitionInterval);
    };
  }, []);

  return (
    <div className="pm25-content">
      <div className="pm25-stars-container" ref={starsRef}></div>
      
      <div className="pm25-single-page">
        <div className="pm25-definition-section">
          <h2 className="pm25-section-title">What is PM2.5?</h2>
          <p className="pm25-section-text">
            Fine particulate matter with a diameter of 2.5 micrometers or smaller that can penetrate deep into your lungs 
            and enter your bloodstream, potentially affecting you and your baby during pregnancy.
          </p>
        </div>
        
        <div className="pm25-divider"></div>
        
        {/* Blurred box for "How Small is PM2.5?" section */}
        <div className="pm25-blurred-box">
          <div className="pm25-visualization-section">
            <h2 className="pm25-section-title">How Small is PM2.5?</h2>
            
            <div className="pm25-comparison-row">
              {/* Side navigation button - previous */}
              <button 
                className="pm25-side-nav-btn pm25-prev-btn" 
                onClick={showPrevComparison}
                aria-label="Previous comparison"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              
              <div className="pm25-visual-container">
                <div className="pm25-circle-container">
                  <div 
                    className="pm25-circle"
                    style={{
                      width: `${getVisualSize(sizeComparisons[currentComparison].actualSize)}px`,
                      height: `${getVisualSize(sizeComparisons[currentComparison].actualSize)}px`,
                      backgroundColor: sizeComparisons[currentComparison].color
                    }}
                  />
                </div>
                <div className="pm25-particle-label">
                  {sizeComparisons[currentComparison].name}
                </div>
              </div>
              
              <div className="pm25-size-details">
                <h3 className="pm25-size-name">{sizeComparisons[currentComparison].name}</h3>
                <div className="pm25-size-measurement">{sizeComparisons[currentComparison].size}</div>
                <p className="pm25-size-description">{sizeComparisons[currentComparison].description}</p>
              </div>
              
              {/* Side navigation button - next */}
              <button 
                className="pm25-side-nav-btn pm25-next-btn" 
                onClick={showNextComparison}
                aria-label="Next comparison"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
            
            <div className="pm25-indicator-dots">
              {sizeComparisons.map((_, index) => (
                <span 
                  key={index} 
                  className={`pm25-indicator-dot ${index === currentComparison ? 'active' : ''}`}
                  onClick={() => setCurrentComparison(index)}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="pm25-cta-container">
          <button className="pm25-cta-btn" onClick={navigateToAirPollutionImpact}>
            Explore PM2.5 Effects on Pregnancy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PM25Education;