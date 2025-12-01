import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeatwaveEducation.css';

const HeatwaveEducation = () => {
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const thermometerRef = useRef(null);
  const dayDisplayRef = useRef(null); // Added ref for day display
  const [currentTemperature, setCurrentTemperature] = useState(42);
  const [currentDay, setCurrentDay] = useState(1);
  const [isHeatwave, setIsHeatwave] = useState(false);
  const [autoplayActive, setAutoplayActive] = useState(false);
  const [cityIndex, setCityIndex] = useState(0);
  
  // Australian cities data
  const australianCities = [
    { 
      name: "Sydney", 
      state: "New South Wales",
      normalSummer: 28,
      heatwaveTemp: 41,
      heatwaveDuration: 3,
      recordTemp: 45.8,
      recordYear: 2020,
      climateZone: "Temperate"
    },
    { 
      name: "Melbourne", 
      state: "Victoria",
      normalSummer: 26,
      heatwaveTemp: 40,
      heatwaveDuration: 4,
      recordTemp: 46.4,
      recordYear: 2009,
      climateZone: "Temperate"
    },
    { 
      name: "Brisbane", 
      state: "Queensland",
      normalSummer: 30,
      heatwaveTemp: 38,
      heatwaveDuration: 3,
      recordTemp: 43.2,
      recordYear: 2014,
      climateZone: "Subtropical"
    },
    { 
      name: "Perth", 
      state: "Western Australia",
      normalSummer: 31,
      heatwaveTemp: 42,
      heatwaveDuration: 5,
      recordTemp: 46.2,
      recordYear: 2022,
      climateZone: "Mediterranean"
    },
    { 
      name: "Adelaide", 
      state: "South Australia",
      normalSummer: 29,
      heatwaveTemp: 43,
      heatwaveDuration: 4,
      recordTemp: 47.7,
      recordYear: 2019,
      climateZone: "Mediterranean"
    },
    { 
      name: "Darwin", 
      state: "Northern Territory",
      normalSummer: 33,
      heatwaveTemp: 38,
      heatwaveDuration: 3,
      recordTemp: 38.9,
      recordYear: 2016,
      climateZone: "Tropical"
    },
    { 
      name: "Hobart", 
      state: "Tasmania",
      normalSummer: 23,
      heatwaveTemp: 33,
      heatwaveDuration: 3,
      recordTemp: 41.8,
      recordYear: 2013,
      climateZone: "Temperate"
    },
    { 
      name: "Canberra", 
      state: "Australian Capital Territory",
      normalSummer: 27,
      heatwaveTemp: 38,
      heatwaveDuration: 4,
      recordTemp: 44.0,
      recordYear: 2020,
      climateZone: "Continental"
    }
  ];
  
  // Get unique states for dropdown
  const states = [...new Set(australianCities.map(city => city.state))];
  
  // Daily temperatures for the simulation
  const generateDailyTemps = (city) => {
    const temps = [];
    
    // Generate days before heatwave (normal temperatures with small fluctuations)
    for (let i = 0; i < 3; i++) {
      temps.push(city.normalSummer + Math.random() * 2 - 1);
    }
    
    // Generate heatwave days
    for (let i = 0; i < city.heatwaveDuration; i++) {
      // Gradually increase to peak then decrease
      let modifier = 0;
      if (i < city.heatwaveDuration / 2) {
        modifier = i;
      } else {
        modifier = city.heatwaveDuration - i;
      }
      
      temps.push(city.heatwaveTemp - 1 + modifier);
    }
    
    // Generate days after heatwave (returning to normal)
    for (let i = 0; i < 2; i++) {
      temps.push(city.normalSummer + Math.random() * 3);
    }
    
    return temps;
  };
  
  // Get temperatures for current city
  const currentCity = australianCities[cityIndex];
  const dailyTemperatures = generateDailyTemps(currentCity);
  const totalDays = dailyTemperatures.length;
  
  // Navigate to heat impact page
  const navigateToHeatImpact = () => {
    navigate('/heat-impact');
  };
  
  // Change to next day with animation
  const goToNextDay = () => {
    if (currentDay < totalDays) {
      setCurrentDay(currentDay + 1);
      setCurrentTemperature(Math.round(dailyTemperatures[currentDay]));
      
      // Check if we're in heatwave territory
      checkIfHeatwave(currentDay);
      
      // Add animation to day display
      if (dayDisplayRef.current) {
        dayDisplayRef.current.classList.add('day-changed');
        setTimeout(() => {
          if (dayDisplayRef.current) {
            dayDisplayRef.current.classList.remove('day-changed');
          }
        }, 500);
      }
    } else {
      // Reset to day 1 if we've reached the end
      setCurrentDay(1);
      setCurrentTemperature(Math.round(dailyTemperatures[0]));
      setIsHeatwave(false);
      
      // Same animation for reset
      if (dayDisplayRef.current) {
        dayDisplayRef.current.classList.add('day-changed');
        setTimeout(() => {
          if (dayDisplayRef.current) {
            dayDisplayRef.current.classList.remove('day-changed');
          }
        }, 500);
      }
    }
  };
  
  // Check if current day is part of a heatwave
  const checkIfHeatwave = (dayIndex) => {
    // Check if this is the start of consecutive hot days
    if (dayIndex >= 2) {
      const isHot1 = dailyTemperatures[dayIndex] >= currentCity.heatwaveTemp - 2;
      const isHot2 = dailyTemperatures[dayIndex - 1] >= currentCity.heatwaveTemp - 2;
      const isHot3 = dailyTemperatures[dayIndex - 2] >= currentCity.heatwaveTemp - 2;
      
      setIsHeatwave(isHot1 && isHot2 && isHot3);
    } else {
      setIsHeatwave(false);
    }
  };
  
  // Toggle autoplay simulation
  const toggleAutoplay = () => {
    setAutoplayActive(!autoplayActive);
    
    if (!autoplayActive) {
      // Start simulation
      goToNextDay();
    }
  };
  
  // Handle state selection change
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    // Find the first city for the selected state
    const cityForState = australianCities.findIndex(city => city.state === selectedState);
    if (cityForState !== -1) {
      setCityIndex(cityForState);
      
      // Reset simulation
      setCurrentDay(1);
      setCurrentTemperature(Math.round(australianCities[cityForState].normalSummer));
      setIsHeatwave(false);
      setAutoplayActive(false);
    }
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
      star.className = 'hw-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  };
  
  // Update thermometer height based on temperature
  const updateThermometer = () => {
    if (thermometerRef.current) {
      const minTemp = 20;
      const maxTemp = 50;
      const height = ((currentTemperature - minTemp) / (maxTemp - minTemp)) * 100;
      thermometerRef.current.style.height = `${Math.min(Math.max(height, 0), 100)}%`;
    }
  };
  
  // Setup autoplay
  useEffect(() => {
    let interval;
    if (autoplayActive) {
      interval = setInterval(() => {
        goToNextDay();
      }, 1500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplayActive, currentDay]);
  
  // Initialize stars on component mount
  useEffect(() => {
    createStars();
  }, []);
  
  // Update thermometer whenever temperature changes
  useEffect(() => {
    updateThermometer();
  }, [currentTemperature]);
  
  // Get color based on temperature
  const getTemperatureColor = (temp) => {
    if (temp >= 45) return '#ff5252'; // Extreme heat
    if (temp >= 40) return '#ff9d5c'; // Severe heat - Orange color matching image
    if (temp >= 35) return '#ffb74d'; // High heat
    return '#ffe082'; // Moderate heat
  };
  
  // Get heat intensity class based on current temperature
  const getHeatIntensityClass = () => {
    if (!autoplayActive) return ''; // Return empty string when simulation is not running
    if (currentTemperature >= 45) return 'extreme-heat';
    if (currentTemperature >= 40) return 'severe-heat';
    if (currentTemperature >= 35) return 'high-heat';
    return 'moderate-heat';
  };
  
  const tempColor = getTemperatureColor(currentTemperature);

  return (
    <div className={`hw-content ${getHeatIntensityClass()}`}>
      <div className="hw-stars-container" ref={starsRef}></div>
      
      <div className="hw-compact-page">
        {/* What is a Heatwave section - at the top with space */}
        <div className="hw-definition-box">
          <div className="hw-definition-card">
            <h3>What is a Heatwave?</h3>
            <p>In Australia, the Bureau of Meteorology defines a heatwave as "three or more days of high maximum and minimum temperatures that are unusual for that location."</p>
          </div>
        </div>
        
        {/* State selector at the top */}
        <div className="hw-state-selector">
          <label htmlFor="state-select">Select your state or territory:</label>
          <select 
            id="state-select" 
            className="hw-state-dropdown"
            value={currentCity.state}
            onChange={handleStateChange}
          >
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        
        {/* Main content box - Simplified two-column layout */}
        <div className="hw-main-box">
          <div className="hw-main-content">
            {/* Temperature section - Left column */}
            <div className="hw-temp-section">
              <div className="hw-thermometer-layout">
                <div className="hw-thermometer-wrapper">
                  <div className="hw-thermometer">
                    <div 
                      className="hw-thermometer-fill" 
                      ref={thermometerRef}
                      style={{ backgroundColor: tempColor }}
                    ></div>
                    <div className="hw-thermometer-bulb" style={{ backgroundColor: tempColor }}></div>
                  </div>
                  <div className="hw-thermometer-scale">
                    <span>50°C</span>
                    <span>40°C</span>
                    <span>30°C</span>
                    <span>20°C</span>
                  </div>
                </div>
                
                <div>
                  <div className="hw-temp-display" style={{ color: tempColor }}>
                    {currentTemperature}°C
                  </div>
                  <div className="hw-day-display" ref={dayDisplayRef}>
                    Day {currentDay} of {totalDays}
                  </div>
                </div>
              </div>
              
              <button 
                className={`hw-control-btn ${autoplayActive ? 'active' : ''}`} 
                onClick={toggleAutoplay}
              >
                {autoplayActive ? 'Pause' : 'Run'} Simulation
              </button>
              
              {isHeatwave && (
                <div className="hw-heatwave-indicator">
                  ⚠️ Heatwave Detected!
                </div>
              )}
            </div>
            
            {/* Climate facts - Right column */}
            <div className="hw-climate-facts">
              <h3>{currentCity.name} Climate Facts:</h3>
              <div className="hw-fact-item">
                <span className="hw-fact-label">Climate Zone:</span>
                <span className="hw-fact-value">{currentCity.climateZone}</span>
              </div>
              <div className="hw-fact-item">
                <span className="hw-fact-label">Typical Summer:</span>
                <span className="hw-fact-value">{currentCity.normalSummer}°C</span>
              </div>
              <div className="hw-fact-item">
                <span className="hw-fact-label">Record High:</span>
                <span className="hw-fact-value">{currentCity.recordTemp}°C ({currentCity.recordYear})</span>
              </div>
              <div className="hw-fact-item">
                <span className="hw-fact-label">Heatwave Temp:</span>
                <span className="hw-fact-value">{currentCity.heatwaveTemp}°C+</span>
              </div>
              <div className="hw-fact-item">
                <span className="hw-fact-label">Avg. Duration:</span>
                <span className="hw-fact-value">{currentCity.heatwaveDuration} days</span>
              </div>
              
              {/* CTA button at the bottom of climate facts */}
              <div className="hw-cta-container">
                <button className="hw-cta-btn" onClick={navigateToHeatImpact}>
                  Learn About Heatwave Effects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatwaveEducation;