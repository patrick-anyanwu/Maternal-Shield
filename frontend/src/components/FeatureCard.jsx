import React, { useState, useEffect, useRef } from "react";
import "../styles/FeatureCard.css";

const FeatureCard = ({ 
  title, 
  description, 
  gradient, 
  icon,
  iconImage,
  photo,
  className = "", 
  style = {}, 
  onClick 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const unhoverTimeoutRef = useRef(null);
  
  // Handle hover behavior with timeout
  const handleMouseEnter = () => {
    clearTimeout(unhoverTimeoutRef.current);
    setIsHovering(true);
    
    // Flip card after a brief delay (optional)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsFlipped(true);
    }, 200); // 200ms delay before flipping when hovered
  };
  
  // Handle un-hover with delay
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovering(false);
    
    // Delay the flip back when mouse leaves
    unhoverTimeoutRef.current = setTimeout(() => {
      setIsFlipped(false);
    }, 1500); // 1.5 second delay before flipping back
  };
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current);
      clearTimeout(unhoverTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`feature-card ${gradient} ${className} ${isHovering ? 'is-hovering' : ''} ${isFlipped ? 'is-flipped' : ''} ${photo ? 'has-photo' : ''}`}
      style={style}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Photo background - when photo prop is provided */}
      {photo && (
        <div className="card-photo-container">
          <img src={photo} alt={title} className="card-photo" />
          <div className="photo-overlay"></div>
        </div>
      )}
      
      {/* The aurora effects - only shown when no photo */}
      {!photo && (
        <div className="card-aurora-container">
          <div className="card-aurora"></div>
          <div className="card-aurora"></div>
        </div>
      )}
      
      <div className="card-inner">
        <div className="card-front">
          {!photo && (
            <div className={`card-icon-container ${gradient}`}>
              {iconImage ? (
                <img src={iconImage} alt={title} className="card-icon-image" />
              ) : icon ? (
                <div className="card-icon">{icon}</div>
              ) : null}
            </div>
          )}
          <div className="card-title">{title}</div>
        </div>
        
        <div className="card-back">
          <h3 className="card-back-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="explore-button">
            <span>Explore</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="card-shine"></div>
      
      {/* Glow around the card */}
      <div className="card-glow"></div>
    </div>
  );
};

export default FeatureCard;