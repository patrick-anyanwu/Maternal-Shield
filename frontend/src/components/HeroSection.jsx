import React, { useState, useEffect, useRef } from "react";
import "../styles/HeroSection.css";

export default function HeroSection({ scrollToRef, onTriggerAnimation }) {
  const [startFeatureAnimation, setStartFeatureAnimation] = useState(false);
  const [isPlayingHeartbeat, setIsPlayingHeartbeat] = useState(false);
  const [isHintDismissed, setIsHintDismissed] = useState(false);
  const audioRef = useRef(null);

  const handleStartJourney = () => {
    // Navigate with state if needed
    window.location.href = "/pm25";
  };

  const handleScroll = () => {
    onTriggerAnimation(true); // ✅ This triggers the animation from parent
    scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Optional: reset animation if user scrolls back up
  useEffect(() => {
    const handleScrollReset = () => {
      if (window.scrollY < window.innerHeight / 2) {
        setStartFeatureAnimation(false);
      }
    };
    window.addEventListener("scroll", handleScrollReset);
    return () => window.removeEventListener("scroll", handleScrollReset);
  }, []);

  // Auto-dismiss the hint after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHintDismissed(true);
    }, 10000); // Hide hint after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Handle heartbeat sound
  const toggleHeartbeat = () => {
    if (audioRef.current) {
      if (isPlayingHeartbeat) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play()
          .catch(error => {
            // Handle autoplay restrictions
            console.log("Audio playback was prevented:", error);
            // You might want to show a message to the user here
          });
      }
      setIsPlayingHeartbeat(!isPlayingHeartbeat);
      setIsHintDismissed(true); // Hide the hint once clicked
    }
  };

  return (
    <section className="hero">
      {/* Audio element for heartbeat sound */}
      <audio 
        ref={audioRef} 
        src="/assets/heartbeat.mp3" 
        loop 
      />

      {/* Fixed position heartbeat indicator */}
      {isPlayingHeartbeat && (
        <div className="heartbeat-indicator">
          <div className="ecg-container">
            <div className="ecg-grid"></div>
            <div className="ecg-line"></div>
          </div>
          <span className="playing-text">Listening</span>
          <span className="heartbeat-rate">124</span>
        </div>
      )}

      {/* 🟢 Aurora Effect */}
      <div className="aurora-container">
        <div className="aurora"></div>
        <div className="aurora"></div>
        <div className="aurora"></div>
      </div>
      
      {/* 🌟 Animated Stars */}
      <div className="stars-layer">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="star" style={{
            "--i": Math.random(),
            "--j": Math.random()
          }} />
        ))}
      </div>
      
      {/* 💫 Shooting Stars */}
      <div className="stars-layer">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`shooting-${i}`} className="shooting-star" style={{
            "--i": Math.random(),
            "--j": Math.random(),
            "--rotation": `${Math.random() * 60 - 30}deg`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 2 + 2}s`
          }} />
        ))}
      </div>

      {/* 🌬️ Wind Breeze Layer */}
      <div className="wind-layer">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="wind" style={{ 
            "--delay": `${i * 1.5}s`,
            top: `${i * 10}%`
          }}></div>
        ))}
      </div>
      
      {/* 🔵 Modern Backdrop Circles */}
      <div className="backdrop-circle"></div>
      <div className="backdrop-circle"></div>
      
      {/* ✨ Atmospheric Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={`particle-${i}`} 
          className="particle"
          style={{
            width: `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--duration': `${Math.random() * 20 + 10}s`,
            '--delay': `${Math.random() * 5}s`,
            '--x1': `${Math.random() * 40 - 20}px`,
            '--y1': `${Math.random() * 40 - 20}px`,
            '--x2': `${Math.random() * 40 - 20}px`,
            '--y2': `${Math.random() * 40 - 20}px`,
            '--x3': `${Math.random() * 40 - 20}px`,
            '--y3': `${Math.random() * 40 - 20}px`
          }}
        ></div>
      ))}

      {/* 🌳 Enhanced Tree with hanging circle + baby image */}
      <div className="tree-wrapper">
        <img src="/assets/f.png" alt="Tree with swing" className="tree-image" />
        
        {/* This div creates a layer for the top part animation */}
        <div className="tree-top">
          {/* Add leaf clusters for additional movement in the foliage */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={`leaf-cluster-${i}`} 
              className="leaf-cluster"
              style={{
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 70 + 15}%`,
                '--rustle-duration': `${Math.random() * 4 + 4}s`,
                '--rustle-delay': `${Math.random() * 3}s`,
              }}
            />
          ))}
          
          {/* Add subtle branch movements */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={`branch-${i}`} 
              className="branch"
              style={{
                top: `${Math.random() * 50}%`,
                right: `${Math.random() * 60 + 10}%`,
                '--branch-duration': `${Math.random() * 6 + 8}s`,
                '--branch-delay': `${Math.random() * 4}s`,
                '--sway-amount': `${Math.random() * 3 + 1}deg`,
              }}
            />
          ))}
        </div>
        
        {/* Falling leaves - original ones */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={`leaf-${i}`} 
            className="leaf"
            style={{
              top: `${Math.random() * 30 + 20}%`,
              right: `${Math.random() * 20 + 20}%`,
              '--x-dist': `${Math.random() * 100 - 50}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 8}s`
            }}
          />
        ))}
        
        {/* Add more falling leaves from the top of the tree */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={`top-leaf-${i}`} 
            className="leaf"
            style={{
              top: `${Math.random() * 15}%`, // Position higher in the tree
              right: `${Math.random() * 40 + 30}%`, // Position more toward center of tree
              '--x-dist': `${Math.random() * 150 - 75}px`, // Wider horizontal movement
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 7 + 10}s` // Longer falling time
            }}
          />
        ))}
        
        {/* Tree glow effect */}
        <div className="tree-glow"></div>
        
        {/* Enhanced clickable baby image with better visibility */}
        <div className="baby-wrapper">
          <img 
            src="/assets/fetus.png" 
            alt="Baby in swing - Click to hear heartbeat" 
            className={`baby-image ${isPlayingHeartbeat ? 'pulse-animation' : ''}`}
            onClick={toggleHeartbeat}
          />
          
          {/* Add a tooltip hint that disappears after a set time or when clicked */}
          {!isHintDismissed && (
            <div className={`baby-hint ${isPlayingHeartbeat ? 'hide-hint' : ''}`}>
              <span className="baby-hint-heart">♥</span>
              <span>Click to hear heartbeat</span>
            </div>
          )}
        </div>
      </div>

      {/* 🌊 Hero Text */}
      <div className="hero-text wave-fade-in">
        <h2>Breathing for Two</h2>
        <h3>Navigate Environmental Risks with Confidence</h3>
        <p>
          Empowering pregnant women with tools to stay safe during air pollution
          and heatwave events. Our real-time monitoring and personalized guidance
          help protect both mother and baby.
        </p>
        <button className="cosmic-journey-btn" onClick={handleStartJourney }><span>Start Your Journey</span></button>
      </div>

      {/* 🔻 Scroll Down - Updated design with multiple chevrons */}
      <div className="scroll-down" onClick={handleScroll}>
        <p>Scroll to discover our features</p>
        <div className="scroll-indicator">
          <div className="chevron"></div>
          <div className="chevron"></div>
          <div className="chevron"></div>
        </div>
      </div>
    </section>
  );
}