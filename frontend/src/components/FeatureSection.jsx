// src/components/FeatureSection.jsx
import React, { useState, useEffect, useRef } from "react";
import FeatureCard from "./FeatureCard";
import "../styles/FeatureSection.css";
import { useNavigate } from "react-router-dom";

// Combine all features into one array
const allFeatures = [
  {
    title: "Knowledge Garden",
    description: "Discover interactive wisdom about pregnancy",
    gradient: "bg-pink",
    photo: "/assets/knowledge-garden.jpg",
    route: "knowledge-garden"
  },
  {
    title: "Personalization",
    description: "Get tailored resources for specific needs.",
    gradient: "bg-blue",
    route: "personalization-hub",
    photo: "/assets/personalization-hub.jpg"
  },
  {
    title: "Symptom Tracker",
    description: "Monitor symptoms alongside environmental conditions",
    gradient: "bg-pink",
    route: "symptom-tracker",
    photo: "/assets/symptom-tracker.jpg"
  },
  {
    title: "Knowledge Game",
    description: "Test your pregnancy knowledge with fun puzzles",
    gradient: "bg-pink",
    route: "acrostic-puzzles",
    photo: "/assets/mother.jpg"
  },
  {
    title: "Heat Impact",
    description: "See how high temperatures affect pregnancy.",
    gradient: "bg-pink",
    route: "heat-impact",
    photo: "/assets/heat-impact4.jpg"
  },
  {
    title: "Air Pollution",
    description: "Learn how poor air quality affects prenatal health.",
    gradient: "bg-blue",
    route: "air-pollution-impact",
    photo: "/assets/air.jpg"
  },
  {
    title: "A Day in Her Shoes",
    description: "Interactive scenarios to learn through stories.",
    gradient: "bg-blue",
    route: "day-in-her-shoes",
    photo: "/assets/day-in-her-shoes.jpg"
  }
];

export default function FeatureSection({
  startAnimation,
  innerRef,
  onCardClick,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  // Determine number of visible cards based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add stars to the background
  useEffect(() => {
    const featuresSection = innerRef.current;
    if (featuresSection) {
      // Create stars
      for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.setProperty('--i', Math.random());
        star.style.setProperty('--j', Math.random());
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        featuresSection.appendChild(star);
      }
    }
    
    // Cleanup function to remove stars when component unmounts
    return () => {
      if (featuresSection) {
        const stars = featuresSection.querySelectorAll('.star');
        stars.forEach(star => star.remove());
      }
    };
  }, [innerRef]);

  const handleCardClick = (feature) => {
    if (feature.route) {
      onCardClick(feature.route);
    } else if (feature.id === "environment-impact") {
      setPopupContent(feature.title);
      setShowPopup(true);
    }
  };

  // Handle next and previous slides
  const handlePrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : 0
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex < allFeatures.length - visibleCards ? prevIndex + 1 : prevIndex
    );
  };

  // Determine if we can navigate prev/next
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < allFeatures.length - visibleCards;

  return (
    <section className="features-section" ref={innerRef}>
      <h2 className="features-title">How We Support You</h2>

      <div className="carousel-container">
        {/* Left Navigation Arrow */}
        <button 
          className={`carousel-arrow prev-arrow ${!canNavigatePrev ? 'disabled' : ''}`}
          onClick={handlePrev}
          disabled={!canNavigatePrev}
          aria-label="Previous cards"
        >
          &lt;
        </button>
        
        {/* Card Carousel */}
        <div className="carousel-wrapper" ref={carouselRef}>
          <div 
            className="carousel-track" 
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              gridTemplateColumns: `repeat(${allFeatures.length}, calc(100% / ${visibleCards}))`
            }}
          >
            {allFeatures.map((feature, index) => (
              <div className="carousel-item" key={index}>
                <FeatureCard
                  {...feature}
                  className={startAnimation ? "float-in" : ""}
                  onClick={() => handleCardClick(feature)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Navigation Arrow */}
        <button 
          className={`carousel-arrow next-arrow ${!canNavigateNext ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!canNavigateNext}
          aria-label="Next cards"
        >
          &gt;
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              ✕
            </button>
            <h3 className="popup-title">💨 {popupContent}</h3>
            <p className="popup-subtext">How would you like to explore?</p>
            <div className="popup-buttons">
              <button onClick={() => navigate("/heat-impact")}>🔥 Heat</button>
              <button onClick={() => navigate("/air-pollution-impact")}>
                🌫️ Air Pollution
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}