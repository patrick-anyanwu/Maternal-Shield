import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Info, MapPin, X, Search, Users } from "lucide-react";
import "../styles/HeatImpact.css";
import PregnancyHealthDataChart from "../components/PregnancyHealthDataChart";

const HeatImpact = () => {
  // Get API key from environment variables
  const API_KEY = process.env.REACT_APP_HEAT_API_KEY;

  // State for temperature and location
  const [temperature, setTemperature] = useState(25); // Starting at 25°C
  const [currentLocation, setCurrentLocation] = useState("Melbourne, VIC");
  const [activeTrimester, setActiveTrimester] = useState("first");
  const [activeArea, setActiveArea] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isHighTemperature, setIsHighTemperature] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [showInfoBubble, setShowInfoBubble] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  // New state for gestational data chart modal
  const [showHealthDataChart, setShowHealthDataChart] = useState(false);
  
  // Thermometer control states
  const [isDragging, setIsDragging] = useState(false);
  
  // Animation states
  const [showContent, setShowContent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [animateIn, setAnimateIn] = useState(false);

  // Refs
  const thermometerRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Navigate to personalization hub
  const navigateToPersonalizationHub = () => {
    window.location.href = "/personalization-hub";
  };

  // Gradual reveal effect
  useEffect(() => {
    // Small delay to let the page load first
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // After content loads, trigger animations
    const animationTimer = setTimeout(() => {
      setAnimateIn(true);
    }, 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
    };
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    if (currentLocation) {
      fetchWeatherData();
    }
  }, [currentLocation]);
  
  // Calculate scroll offset based on location bar height
  useEffect(() => {
    // Calculate the offset based on the location bar's height plus some padding
    const calculateOffset = () => {
      const locationBar = document.querySelector('.location-bar');
      if (locationBar) {
        const locationBarHeight = locationBar.offsetHeight;
        // Adding extra padding to ensure content is clearly visible below the bar
        setScrollOffset(locationBarHeight + 20);
      }
    };
    
    // Calculate on initial render and whenever window is resized
    calculateOffset();
    window.addEventListener('resize', calculateOffset);
    
    return () => {
      window.removeEventListener('resize', calculateOffset);
    };
  }, []);

  // Handle clicks outside the suggestion box to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add useEffect for global mouse up event to end dragging even if mouse is released outside thermometer
  useEffect(() => {
    // Add global event listeners for mouse up and mouse move
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleThermometerMouseMove);
    
    // Cleanup
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleThermometerMouseMove);
    };
  }, [isDragging, temperature]); // Depend on isDragging and temperature

  // Updated trimester sensitivity areas mapping based on the new data
  const trimesterAreas = {
    first: [
      { id: "neural-tube-development", name: "Neural Tube Development", description: "Heat disrupts early brain and spine formation, especially before week 6." },
      { id: "heart-formation", name: "Heart Formation", description: "Exposure to heat can interfere with heart development." },
      { id: "cell-division", name: "Cell Division and Early Placenta Formation", description: "Heat impairs implantation and early placenta growth." }
    ],
    second: [
      { id: "placental-blood-flow", name: "Placental Blood Flow and Fetal Growth", description: "Heat reduces placental blood supply, slowing fetal growth." },
      { id: "amniotic-fluid", name: "Amniotic Fluid Regulation", description: "Maternal dehydration from heat can lower amniotic fluid levels." },
      { id: "maternal-blood-pressure", name: "Maternal Blood Pressure", description: "Heat exposure increases cardiovascular strain in mothers." }
    ],
    third: [
      { id: "uterine-activity", name: "Uterine Activity", description: "Heat can trigger early contractions, raising premature birth risk." },
      { id: "placental-oxygen", name: "Placental Oxygen Supply", description: "Heat reduces oxygen delivery through the placenta." },
      { id: "maternal-heat-illness", name: "Maternal Heat Illness", description: "Heat stroke in the mother can cause rapid fetal distress." }
    ]
  };

  // Updated area details mapping based on research and new data
  const areaDetails = {
    // First Trimester
    "neural-tube-development": {
      title: "Neural Tube Development (Weeks 3-6)",
      description: "The neural tube is the embryonic structure that develops into the brain and spinal cord. It forms and closes between weeks 3-6 of pregnancy, making this a particularly critical period.",
      heatImpact: "Heat disrupts early brain and spine formation, especially before week 6. High maternal temperatures can double the risk of severe birth defects including spina bifida and anencephaly. Elevated body temperatures above 39°C during neural tube formation have been associated with increased risk of neural tube defects.",
      recommendation: "During weeks 3-6 of pregnancy, take extra precautions to avoid activities that increase core body temperature significantly. Ensure adequate folate intake through diet and prenatal vitamins. If experiencing fever, consult healthcare provider about safe fever-reducing medications."
    },
    "heart-formation": {
      title: "Heart Formation (Weeks 5-9)",
      description: "The fetal heart begins forming around week 5 and has developed its basic structure by week 9. This is a critical period for proper heart chamber and valve development.",
      heatImpact: "Exposure to repeated heat above 30°C in early weeks can interfere with heart development, increasing risks of structural abnormalities. Heat exposure during critical cardiac development stages can disrupt the formation of heart chambers, valves, and major blood vessels, potentially leading to congenital heart defects.",
      recommendation: "Avoid heat exposure above 30°C during weeks 5-9 of pregnancy. Stay in air-conditioned environments during hot weather and avoid hot tubs, saunas, and very hot baths. Maintain proper hydration and consider scheduling outdoor activities during cooler parts of the day."
    },
    "cell-division": {
      title: "Cell Division and Early Placenta Formation (Weeks 1-12)",
      description: "The first trimester involves rapid cell division and the formation of the placenta, which is crucial for nutrient and oxygen supply to the developing embryo.",
      heatImpact: "High heat impairs implantation and early placenta growth, leading to higher miscarriage risk, especially during extreme heat events. Temperatures above 32°C can disrupt proper cellular division and placental development, potentially compromising the pregnancy.",
      recommendation: "During the first trimester, avoid extended exposure to temperatures above 32°C. Stay in cooler environments during heat waves and maintain proper hydration. If outdoor activities are necessary, schedule them during cooler parts of the day and take frequent breaks in shaded areas."
    },
    
    // Second Trimester
    "placental-blood-flow": {
      title: "Placental Blood Flow and Fetal Growth (Weeks 14-26)",
      description: "The second trimester is characterized by rapid fetal growth, with the fetus gaining significant weight and length. Proper placental blood flow is essential for delivering nutrients and oxygen to support this growth.",
      heatImpact: "Prolonged heat reduces placental blood supply, slowing fetal growth and increasing the risk of low birth weight. Temperatures above 32°C can redirect blood flow away from the uterus to the skin for cooling, potentially leading to intrauterine growth restriction where the fetus doesn't grow as expected.",
      recommendation: "During the second trimester, continue monitoring heat exposure and stay in temperature-controlled environments when temperatures exceed 32°C. Ensure adequate protein and calorie intake to support fetal growth, especially during hot weather when appetite may decrease."
    },
    "amniotic-fluid": {
      title: "Amniotic Fluid Regulation (Weeks 14-26)",
      description: "Amniotic fluid surrounds and protects the developing fetus, allowing for movement and growth. During the second trimester, amniotic fluid is primarily composed of fetal urine and is constantly being produced and reabsorbed.",
      heatImpact: "Maternal dehydration from heat can lower amniotic fluid levels, affecting fetal lung development and movement. Temperatures above 35°C significantly increase the risk of oligohydramnios (low amniotic fluid), which can compress the umbilical cord and restrict fetal movement.",
      recommendation: "During hot weather, increase water intake by at least 1-2 cups beyond normal pregnancy recommendations. Watch for signs of dehydration such as dark urine, thirst, and reduced urination. If living in a hot climate or during a heat wave, ask your healthcare provider about monitoring amniotic fluid levels more frequently."
    },
    "maternal-blood-pressure": {
      title: "Maternal Blood Pressure (Weeks 14-26)",
      description: "The second trimester typically brings stabilization in blood pressure, but heat exposure can disrupt this balance and lead to complications.",
      heatImpact: "Heat exposure increases cardiovascular strain, leading to elevated maternal blood pressure and placenta-related complications. Temperatures above 35°C can cause blood pressure fluctuations that may contribute to gestational hypertension and preeclampsia, conditions that can severely impact both maternal and fetal health.",
      recommendation: "Monitor blood pressure more frequently during hot weather. Stay well-hydrated and avoid sudden position changes that could further affect blood pressure. If taking medication for blood pressure, consult with healthcare provider about potential adjustments during hot weather."
    },
    
    // Third Trimester
    "uterine-activity": {
      title: "Uterine Activity (Weeks 27-40)",
      description: "As pregnancy progresses, the uterus becomes more sensitive to external factors that can trigger contractions. Heat and dehydration can significantly impact uterine activity in the third trimester.",
      heatImpact: "Heat-triggered dehydration and stress hormones can stimulate early contractions, raising the risk of premature birth. Temperatures above 35°C have been linked to increased rates of preterm labor and delivery, with studies showing 5-20% higher risk during heat waves.",
      recommendation: "In the third trimester, limit time outdoors during the hottest part of the day (10am-4pm) when temperatures exceed 35°C. Use air conditioning or cooling centers during heat waves. Stay vigilant for signs of preterm labor, especially during hot weather, and contact healthcare provider promptly if experiencing regular contractions."
    },
    "placental-oxygen": {
      title: "Placental Oxygen Supply (Weeks 27-40)",
      description: "By the third trimester, the placenta must supply increasing amounts of oxygen to the rapidly growing fetus. Heat exposure can compromise this crucial function.",
      heatImpact: "Severe heat reduces oxygen delivery through the placenta, greatly increasing stillbirth risk, especially after 30°C. Studies show a significant correlation between maternal heat exposure and reduced placental efficiency, potentially leading to fetal distress and, in severe cases, stillbirth.",
      recommendation: "Avoid heat exposure above 30°C in the third trimester whenever possible. Pay attention to fetal movement patterns during hot weather, as decreased movement can be a sign of fetal distress. Use kick counts to monitor fetal activity daily, especially during heat waves."
    },
    "maternal-heat-illness": {
      title: "Maternal Heat Illness (Weeks 27-40)",
      description: "In the third trimester, pregnant women are more vulnerable to heat-related illnesses due to increased blood volume, metabolic rate, and reduced ability to regulate body temperature.",
      heatImpact: "Heat stroke in the mother (core temp ≥39°C) can cause rapid fetal distress, oxygen deprivation, and life-threatening emergencies. When maternal body temperature rises above 39°C, it creates an emergency situation that requires immediate medical attention to protect both mother and baby.",
      recommendation: "Be extremely cautious when temperatures approach or exceed 39°C. Know the warning signs of heat illness (dizziness, confusion, headache, nausea) and seek immediate medical care if experiencing these symptoms. Stay in air-conditioned environments during extreme heat and maintain hydration with electrolyte-balanced fluids."
    }
  };

  // Updated risk thresholds based on temperature (in Celsius) according to the new data
  const riskThresholds = {
    first: {
      'neural-tube-development': { low: 30, moderate: 33, high: 36, extreme: 39, critical: 41 },
      'heart-formation': { low: 26, moderate: 30, high: 33, extreme: 36, critical: 39 },
      'cell-division': { low: 28, moderate: 32, high: 35, extreme: 38, critical: 40 }
    },
    second: {
      'placental-blood-flow': { low: 28, moderate: 32, high: 35, extreme: 38, critical: 40 },
      'amniotic-fluid': { low: 30, moderate: 33, high: 35, extreme: 38, critical: 40 },
      'maternal-blood-pressure': { low: 30, moderate: 33, high: 35, extreme: 38, critical: 40 }
    },
    third: {
      'uterine-activity': { low: 30, moderate: 33, high: 35, extreme: 38, critical: 40 },
      'placental-oxygen': { low: 27, moderate: 30, high: 33, extreme: 36, critical: 39 },
      'maternal-heat-illness': { low: 33, moderate: 36, high: 39, extreme: 41, critical: 43 }
    }
  };

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      // First, geocode the location to get coordinates
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${currentLocation},AU&limit=1&appid=${API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.length) {
        console.error("Location not found");
        alert("Location not found. Please try another Australian suburb or city.");
        setIsLoadingWeather(false);
        return;
      }

      const { lat, lon } = geocodeData[0];

      // Get current weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData) {
        setWeatherData(weatherData);
        const currentTemp = Math.round(weatherData.main.temp);
        setTemperature(Math.max(0, currentTemp)); // Ensure we don't go below 0
        
        // Check for high temperature (> 35°C is considered extreme heat)
        setIsHighTemperature(currentTemp > 35);
      }
      
      setIsLoadingWeather(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please check your connection and try again.");
      setIsLoadingWeather(false);
    }
  };

  // Get risk level and color based on temperature
  const getRiskLevel = (temp) => {
    if (temp <= 30) return { level: "Low", color: "#22c55e" }; // Green for safe level
    if (temp <= 33) return { level: "Moderate", color: "#f97316" }; // Orange
    if (temp <= 36) return { level: "High", color: "#ef4444" }; // Red
    if (temp <= 39) return { level: "Extreme", color: "#7f1d1d" }; // Dark red
    return { level: "Critical", color: "#450a0a", textColor: "#ffffff" }; // Very dark red with white text
  };
  
  // Get area-specific risk level based on temperature and area ID
  const getAreaRiskLevel = (areaId, temp) => {
    // Get thresholds for this area from our tabular data
    const thresholds = riskThresholds[activeTrimester]?.[areaId];
    
    if (!thresholds) {
      // Default thresholds if area-specific not found
      if (temp <= 30) return { level: "Low", color: "#22c55e" };
      if (temp <= 33) return { level: "Moderate", color: "#f97316" };
      if (temp <= 36) return { level: "High", color: "#ef4444" };
      if (temp <= 39) return { level: "Extreme", color: "#7f1d1d" };
      return { level: "Critical", color: "#450a0a", textColor: "#ffffff" };
    }
    
    // Determine risk level based on temperature value and thresholds
    if (temp <= thresholds.low) return { level: "Low", color: "#22c55e" };
    if (temp <= thresholds.moderate) return { level: "Moderate", color: "#f97316" };
    if (temp <= thresholds.high) return { level: "High", color: "#ef4444" };
    if (temp <= thresholds.extreme) return { level: "Extreme", color: "#7f1d1d" };
    return { level: "Critical", color: "#450a0a", textColor: "#ffffff" };
  };

  // Get thermometer shake class based on temperature
  const getThermometerShakeClass = (temp) => {
    if (temp <= 30) return "";  // No shaking for safe temperatures
    if (temp <= 33) return "shake-once-mild";
    if (temp <= 36) return "shake-once-medium";
    if (temp <= 39) return "shake-once-severe";
    return "shake-once-extreme";  // Extra strong shaking for critical temperatures
  };

  // IMPROVED THERMOMETER INTERACTION HANDLERS
  
  // Handle thermometer click to set temperature directly
  const handleThermometerClick = (e) => {
    if (isDragging) return; // Skip if already dragging
    
    const thermometerElem = thermometerRef.current;
    if (!thermometerElem) return;
    
    const thermometerRect = thermometerElem.getBoundingClientRect();
    const thermometerHeight = thermometerRect.height;
    const clickY = e.clientY - thermometerRect.top;
    
    // Calculate height percentage from bottom (0 to 1)
    const heightPercentage = Math.max(0, Math.min(1, (thermometerHeight - clickY) / thermometerHeight));
    
    // Calculate temperature (range is from 0°C to 50°C)
    const newTemp = Math.round(heightPercentage * 50);
    
    // Set new temperature (minimum 0)
    setTemperature(Math.max(0, newTemp));
    setShakeKey(prevKey => prevKey + 1); // Trigger animation
  };
  
  // Handle thermometer mouse down - start drag operation
  const handleThermometerMouseDown = (e) => {
    // Start drag operation
    setIsDragging(true);
    
    // Also set the initial temperature based on click position
    handleThermometerClick(e);
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Handle thermometer mouse move - update temperature during drag
  const handleThermometerMouseMove = (e) => {
    // Only process movement if we're dragging
    if (!isDragging) return;
    
    const thermometerElem = thermometerRef.current;
    if (!thermometerElem) return;
    
    const thermometerRect = thermometerElem.getBoundingClientRect();
    const thermometerHeight = thermometerRect.height;
    const currentY = e.clientY - thermometerRect.top;
    
    // Calculate height percentage from bottom (0 to 1)
    const heightPercentage = Math.max(0, Math.min(1, (thermometerHeight - currentY) / thermometerHeight));
    
    // Calculate temperature (range is from 0°C to 50°C)
    const newTemp = Math.round(heightPercentage * 50);
    
    // Update temperature if changed and within valid range (min 0)
    if (newTemp !== temperature && newTemp >= 0) {
      setTemperature(newTemp);
    }
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Handle mouse up - end drag operation
  const handleMouseUp = () => {
    // End drag operation
    if (isDragging) {
      setIsDragging(false);
      setShakeKey(prevKey => prevKey + 1); // Trigger animation for final temperature
    }
  };

  // Function to use current location
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Reverse geocode to get location name
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
              const place = data[0];
              // Check if in Australia (can be expanded to include more precise check)
              if (place.country === "AU") {
                setCurrentLocation(`${place.name}, ${place.state || "AU"}`);
              }
              else {
                alert("This application is designed for Australian locations only.");
              }
            }
          } catch (error) {
            console.error("Error getting location name:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not access your location. Please make sure you've granted permission.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.length > 0) {
      fetchLocationSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Fetch location suggestions from API
  const fetchLocationSuggestions = async (input) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input},Australia&limit=10&appid=${API_KEY}`
      );
      const data = await response.json();
      
      // Filter to only Australian locations
      const ausLocations = data.filter(loc => 
        loc.country === "AU" || loc.country === "Australia"
      );

      const uniqueLocations = [];
      const seenLocations = new Set();
      
      // Create better suburb display format
      ausLocations.forEach(loc => {
        // Get name and state
        const name = loc.name;
        const state = loc.state || "";
        
        // Create display format
        let display = name;
        if (state) {
          display = `${name}, ${state}`;
        }
        
        // Add to uniqueLocations only if we haven't seen this display name before
        if (!seenLocations.has(display)) {
          seenLocations.add(display);
          uniqueLocations.push({
            name: name,
            state: state,
            display: display,
            lat: loc.lat,
            lon: loc.lon
          });
        }
      });
      
      setSuggestions(uniqueLocations);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Select location from suggestions
  const handleSelectLocation = (location) => {
    setCurrentLocation(location.display);
    setSearchInput(location.display);
    setShowSuggestions(false);
  };

  // Toggle expanded details for a section
  const toggleExpandedDetails = (detailKey) => {
    setExpandedDetails(prev => ({
      ...prev,
      [detailKey]: !prev[detailKey]
    }));
  };

  // Handle clicking on a sensitivity area
  const handleAreaClick = (areaId) => {
    setActiveArea(areaId);
    setShowDetails(true);
    
    // Reset expanded sections when area changes
    setExpandedDetails({});
    
    // Delay the scroll a bit to allow the area details to render
    setTimeout(() => {
      // Find the area details section after it's rendered
      const areaDetails = document.querySelector('.area-details-section');
      if (areaDetails) {
        const targetPosition = areaDetails.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
        
        // Smooth scroll to the position
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Handle trimester tab click with improved guidance
  const handleTrimesterTabClick = (trimester) => {
    // Update the active trimester
    setActiveTrimester(trimester);
    
    // Close any active area details when switching trimesters
    setActiveArea(null);
    setShowDetails(false);
    
    // After a short delay to allow state update and re-render
    setTimeout(() => {
      // Scroll to the development section to show the video
      const developmentSection = document.querySelector('.development-overview-section');
      if (developmentSection) {
        const targetPosition = developmentSection.getBoundingClientRect().top + 
                             window.pageYOffset - scrollOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Handle clicking the "View Trimester Video" button
  const handleViewVideoClick = () => {
    // Close the area details
    setActiveArea(null);
    setShowDetails(false);
    
    // After a small delay to allow state update
    setTimeout(() => {
      // Scroll to the development section
      const developmentSection = document.querySelector('.development-overview-section');
      if (developmentSection) {
        const targetPosition = developmentSection.getBoundingClientRect().top + 
                               window.pageYOffset - scrollOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Get development title based on active trimester
  const getDevelopmentTitle = () => {
    if (activeTrimester === 'first') return "First Trimester (Weeks 1-13)";
    if (activeTrimester === 'second') return "Second Trimester (Weeks 14-26)";
    return "Third Trimester (Weeks 27-40)";
  };

  // Get development description based on active trimester
  const getDevelopmentDescription = () => {
    if (activeTrimester === 'first') {
      return "The first trimester is a critical period for embryonic development, when all major organ systems begin to form. Extreme heat exposure can disrupt cellular division, gene expression, and may affect neural tube formation, heart development, and increase miscarriage risk.";
    } else if (activeTrimester === 'second') {
      return "During the second trimester, the fetus grows rapidly and organ systems continue to develop. Heat exposure can affect placental blood flow, fetal growth patterns, amniotic fluid levels, and may increase the risk of maternal hypertension and preeclampsia.";
    } else {
      return "The third trimester is crucial for final development and weight gain before birth. Heat exposure during this period may increase the risk of preterm birth, affect placental oxygen supply, and can lead to maternal heat illness with serious consequences for both mother and baby.";
    }
  };

  // Toggle info bubble visibility
  const toggleInfoBubble = () => {
    setShowInfoBubble(!showInfoBubble);
  };

  // Get area risk description based on area ID and temperature
  const getAreaRiskDescription = (areaId, temp) => {
    const riskLevel = getAreaRiskLevel(areaId, temp).level.toLowerCase();
    
    // Default generic responses if specific area description not found
    const defaultDescriptions = {
      low: "Normal development expected at this temperature",
      moderate: "Moderate risk at 30-33°C - stay in cooler environments when possible",
      high: "High risk at 33-36°C - avoid outdoor exposure during peak heat",
      extreme: "Extreme risk 36-39°C - stay in air-conditioned spaces and monitor for symptoms",
      critical: "Critical danger above 40°C - emergency measures needed to reduce temperature exposure"
    };

    // Get specifics based on area and temperature
    if (activeTrimester === 'first') {
      if (areaId === 'neural-tube-development') {
        if (riskLevel === 'low') return "Normal neural tube development expected";
        if (riskLevel === 'moderate') return "Moderate risk to neural development - consider limiting heat exposure";
        if (riskLevel === 'high') return "High risk for neural tube formation - avoid temperatures above 36°C";
        if (riskLevel === 'extreme') return "Extreme risk at 39°C - urgent measures needed to reduce exposure";
        return "Critical danger to neural tube development - emergency cooling needed";
      }
      if (areaId === 'heart-formation') {
        if (riskLevel === 'low') return "Normal heart development expected";
        if (riskLevel === 'moderate') return "Moderate risk at 30°C - potential impact on heart development";
        if (riskLevel === 'high') return "High risk - heat above 33°C may affect cardiac structure formation";
        if (riskLevel === 'extreme') return "Extreme risk - temperatures above 36°C significantly impact heart development";
        return "Critical danger - immediate measures needed to protect cardiac development";
      }
      if (areaId === 'cell-division') {
        if (riskLevel === 'low') return "Normal cellular division and placenta formation expected";
        if (riskLevel === 'moderate') return "Moderate risk at 32°C - may affect early placental development";
        if (riskLevel === 'high') return "High risk - increased chance of early pregnancy complications";
        if (riskLevel === 'extreme') return "Extreme risk - significantly increased miscarriage risk at these temperatures";
        return "Critical danger - emergency measures needed to protect pregnancy";
      }
    }
    
    return defaultDescriptions[riskLevel];
  };

  // Toggle health data chart visibility
  const toggleHealthDataChart = () => {
    setShowHealthDataChart(!showHealthDataChart);
  };

  const riskInfo = getRiskLevel(temperature);

  return (
    <div className={`heat-impact-page ${showContent ? 'content-visible' : ''}`} style={{
      background: "linear-gradient(to bottom right, #312e81, #581c87, #831843)"
    }}>
      {/* Background Effects */}
      <div className="heat-glow-container">
        <div className="heat-glow"></div>
        <div className="heat-glow"></div>
      </div>
      
      <div className="temperature-content-container">
        <div className={`heat-header ${animateIn ? 'animate-in' : ''}`}>
          <h1 className="heat-title">Impact of Heat on Pregnancy</h1>
          <div className="heat-title-underline"></div>
          <p className="page-subtitle">Explore how high temperatures affect different stages of fetal development</p>
        </div>
        
        {/* Location Bar - Now with better styling and gradual reveal */}
        <div className={`location-bar ${animateIn ? 'animate-in' : ''}`} style={{ animationDelay: '0.2s' }}>
          <div className="location-info">
            <div className="location-icon">
              <MapPin size={18} />
            </div>
            <div>Current Location: {currentLocation}</div>
          </div>
          
          <div className="location-search">
            <div className="search-input-wrapper">
              <input 
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search for Australian suburb or city..."
                ref={searchInputRef}
                onClick={() => {
                  // Show suggestions immediately if there's already text in the input
                  if (searchInput.length > 1) {
                    fetchLocationSuggestions(searchInput);
                    setShowSuggestions(true);
                  }
                }}
              />
              {searchInput && (
                <button className="clear-search-button" onClick={handleClearSearch}>
                  <X size={16} />
                </button>
              )}
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="location-suggestions" ref={suggestionsRef}>
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="location-suggestion-item"
                    onClick={() => handleSelectLocation(suggestion)}
                  >
                    {suggestion.display}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button className="use-location-btn" onClick={handleUseMyLocation}>
            <MapPin size={16} className="button-icon" />
            Use My Location
          </button>
          
          <div className="current-temp-display">
            {isLoadingWeather ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <>
                <div className="temp-value-container">
                  Temperature: <span className="temp-value" style={{color: riskInfo.color}}>{temperature}°C</span>
                </div>
                {isHighTemperature && (
                  <span className="heat-alert-indicator">
                    <AlertTriangle size={12} className="alert-icon" />
                    EXTREME HEAT ALERT
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Interactive Main Content */}
        <div className={`temperature-main-content ${animateIn ? 'animate-in' : ''}`} style={{ animationDelay: '0.4s' }}>
          {/* Top Row with Temperature Visualization and Sensitivity areas */}
          <div className="temperature-top-row">
            {/* 1. Temperature Visualization Section */}
            <div className="temp-control-section">
              <h2 className="section-title">Temperature Impact Visualizer</h2>
              
              <div className="temperature-visualization-area">
                {/* IMPROVED Thermometer Visualization with Better Drag Control */}
                <div className="thermometer-container">
                  <div 
                    key={`thermometer-${shakeKey}`}
                    className={`thermometer-wrapper ${getThermometerShakeClass(temperature)}`}
                    ref={thermometerRef}
                    style={{
                      '--temp-color': riskInfo.color,
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onClick={handleThermometerClick}
                    onMouseDown={handleThermometerMouseDown}
                    onMouseMove={handleThermometerMouseMove}
                  >
                    <div className="thermometer">
                      <div className="thermometer-scale">
                        {[50, 40, 30, 20, 10, 0].map((temp) => (
                          <div key={temp} className="thermometer-mark threshold-mark">
                            <span className="temp-label threshold-label">
                              {temp}°C
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="thermometer-stem">
                        <div 
                          className="thermometer-fill" 
                          style={{ 
                            height: `${Math.min(100, Math.max(0, (temperature / 50) * 100))}%`,
                            backgroundColor: riskInfo.color 
                          }}
                        ></div>
                      </div>
                      
                      <div 
                        className="thermometer-bulb" 
                        style={{
                          backgroundColor: riskInfo.color,
                          boxShadow: `0 0 15px ${riskInfo.color}80`
                        }}
                      >
                        <div className="thermometer-bulb-shine"></div>
                      </div>
                      
                      {/* Current temperature indicator - shown only while dragging */}
                      {isDragging && (
                        <div 
                          className="thermometer-current"
                          style={{
                            bottom: `${Math.min(300, Math.max(0, (temperature / 50) * 300))}px`,
                            right: '-65px'
                          }}
                        >
                          <div className="current-marker"></div>
                          <div className="current-value">{temperature}°C</div>
                        </div>
                      )}
                      
                      {/* Interactive helper prompt */}
                      <div className="thermometer-helper-prompt">
                        Click or drag to adjust temperature
                      </div>
                    </div>
                  </div>
                </div>
              
                {/* Risk Level Display */}
                <div className="risk-level-display">
                  <div 
                    className={`risk-level ${riskInfo.level.toLowerCase()}`}
                    style={{
                      backgroundColor: `${riskInfo.color}33`, 
                      borderColor: riskInfo.color,
                      color: riskInfo.level === "Critical" ? "#ffffff" : "inherit"
                    }}
                  >
                    {riskInfo.level} Risk Level
                  </div>
                </div>
              </div>
            </div>
            
            {/* 2. Heat Sensitivity Areas */}
            <div className="temperature-sensitivity-section">
              <h2 className="section-title">Heat Sensitivity Areas</h2>
              
              {/* Trimester tabs with simpler design */}
              <div className="trimester-tabs">
                <div 
                  className={`trimester-tab ${activeTrimester === 'first' ? 'active' : ''}`}
                  onClick={() => handleTrimesterTabClick('first')}
                >
                  <span className="trimester-tab-text">First Trimester</span>
                </div>
                
                <div 
                  className={`trimester-tab ${activeTrimester === 'second' ? 'active' : ''}`}
                  onClick={() => handleTrimesterTabClick('second')}
                >
                  <span className="trimester-tab-text">Second Trimester</span>
                </div>
                
                <div 
                  className={`trimester-tab ${activeTrimester === 'third' ? 'active' : ''}`}
                  onClick={() => handleTrimesterTabClick('third')}
                >
                  <span className="trimester-tab-text">Third Trimester</span>
                </div>
              </div>
              
              {/* Sensitivity Items Grid - Dynamically populated based on trimester */}
              <div className="sensitivity-grid">
                {trimesterAreas[activeTrimester].map((area, index) => {
                  // Get area-specific risk level
                  const areaRiskInfo = getAreaRiskLevel(area.id, temperature);
                  
                  return (
                    <div 
                      key={area.id}
                      className={`sensitivity-item ${areaRiskInfo.level.toLowerCase()}`}
                      onClick={() => handleAreaClick(area.id)}
                      style={{
                        '--risk-color': areaRiskInfo.color,
                        animationDelay: `${0.2 + index * 0.1}s`
                      }}
                    >
                      <div className="sensitivity-item-header">
                        <h4>{area.name}</h4>
                        <span 
                          className="risk-badge" 
                          style={{ 
                            backgroundColor: areaRiskInfo.color,
                            color: areaRiskInfo.level === "Critical" ? "#ffffff" : "inherit"
                          }}
                        >
                          {areaRiskInfo.level}
                        </span>
                      </div>
                      <p className="sensitivity-item-description">{area.description}</p>
                      <div className="sensitivity-item-content">
                        <div className="risk-level-indicator">
                          <div className="risk-level-track">
                            <div 
                              className="risk-level-fill" 
                              style={{
                                width: `${Math.min(100, ((temperature) / 50) * 100)}%`,
                                backgroundColor: areaRiskInfo.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="view-details-prompt">
                        <span>Click for details</span>
                        <ChevronRight size={16} className="details-icon" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Area Details Section - Appears when an area is clicked */}
          {activeArea && showDetails && (
            <div className="area-details-section">
              <div className="area-details-header">
                <h2>{areaDetails[activeArea].title}</h2>
                <button className="close-details" onClick={() => { setActiveArea(null); setShowDetails(false); }}>
                  <X size={18} />
                </button>
              </div>
              
              <div className="area-details-content">
                <div className="area-info-container">
                  <div 
                    className={`area-info-section ${expandedDetails['heatImpact'] ? 'expanded' : ''}`}
                    onClick={() => toggleExpandedDetails('heatImpact')}
                  >
                    <div className="expandable-header">
                      <h3>Heat Impact</h3>
                      <ChevronDown 
                        size={20} 
                        className={`expand-icon ${expandedDetails['heatImpact'] ? 'rotated' : ''}`} 
                      />
                    </div>
                    
                    <div className="expandable-content">
                      <p>{areaDetails[activeArea].heatImpact}</p>
                      
                      <div 
                        className={`heat-warning ${getAreaRiskLevel(activeArea, temperature).level.toLowerCase()}`}
                        style={{
                          borderColor: getAreaRiskLevel(activeArea, temperature).color,
                          backgroundColor: `${getAreaRiskLevel(activeArea, temperature).color}15`,
                          color: getAreaRiskLevel(activeArea, temperature).level === "Critical" ? "#ffffff" : "inherit"
                        }}
                      >
                        <div className="warning-header">
                          <AlertTriangle size={18} className="warning-icon" />
                          <span className="warning-title">Current Risk Assessment at {temperature}°C:</span>
                        </div>
                        <p>{getAreaRiskDescription(activeArea, temperature)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`area-info-section ${expandedDetails['recommendation'] ? 'expanded' : ''}`}
                    onClick={() => toggleExpandedDetails('recommendation')}
                  >
                    <div className="expandable-header">
                      <h3>Recommendation</h3>
                      <ChevronDown 
                        size={20} 
                        className={`expand-icon ${expandedDetails['recommendation'] ? 'rotated' : ''}`} 
                      />
                    </div>
                    
                    <div className="expandable-content">
                      <div className="recommendation-content">
                        <div className="recommendation-icon">💡</div>
                        <p>{areaDetails[activeArea].recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add simpler Video button at the bottom */}
              <div className="view-video-button-container">
                <button 
                  className="view-video-button" 
                  onClick={handleViewVideoClick}
                >
                  View Video
                </button>
              </div>
              
              <div className="scroll-hint">
                <span className="scroll-hint-icon">↑</span>
                <span>Return to sensitivity areas by closing this panel</span>
              </div>
            </div>
          )}
          
          {/* Development Overview Section - Only shown when no area is selected */}
          {(!activeArea || !showDetails) && (
            <div className="development-overview-section">
              <div className="development-content">
                <div className="development-video-container">
                  <video 
                    className="development-video" 
                    controls
                    autoPlay
                    loop
                    muted
                    poster={`../assets/${activeTrimester}-trimester-heat-poster.jpg`}
                    key={`video-${activeTrimester}`}  // Add key to force video refresh on trimester change
                  >
                    <source src={`../assets/${activeTrimester}-trimester-heat-overview.mp4`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="development-info">
                  <h2>{getDevelopmentTitle()}</h2>
                  <p>{getDevelopmentDescription()}</p>
                  
                  <div className="current-temp-impact">
                    <h3>Current Temperature Risk Level: <span style={{ color: riskInfo.color }}>{riskInfo.level}</span></h3>
                    <p className="impact-summary">
                      At {temperature}°C, developing fetuses in the {getDevelopmentTitle().toLowerCase()} face {riskInfo.level.toLowerCase()} 
                      risks to their development. Please review the specific sensitivity areas above for detailed impact information.
                    </p>
                  </div>
                  
                  {/* Add sensitivity reference to link back to sensitivity areas */}
                  <div className="sensitivity-reference">
                    <Info size={20} className="reference-icon" />
                    <p>For more specific health impacts, click on any of the sensitivity areas above to see detailed information.</p>
                  </div>

                  {/* Health data visualization button - only in "maternal-blood-pressure" area in second trimester */}
                  {activeTrimester === 'second' && (
                    <div className="health-data-button-container">
                      <button 
                        className="health-data-button" 
                        onClick={toggleHealthDataChart}
                      >
                        View National Trends in Gestational Diabetes and Hypertension
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="interactive-guidance">
                <button className="personalization-button" onClick={navigateToPersonalizationHub}>
                  <Users size={20} className="personalization-icon" />
                  Get Your Personalized Protection Plan
                  <ChevronRight size={16} className="arrow-icon" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Info Button */}
        <div className="info-button" onClick={toggleInfoBubble}>
          <div className="info-icon">i</div>
        </div>
        
        {/* Interactive guidance bubble - now shown/hidden by clicking the info button */}
        {showInfoBubble && (
          <div className="info-bubble">
            <div className="info-bubble-icon">i</div>
            <div className="info-bubble-content">
              <h3>Interactive Visualization</h3>
              <p>Click and drag the thermometer to adjust temperature and see how different levels affect fetal development.</p>
              <p>Click on a trimester tab to see developmental information and video for that stage.</p>
            </div>
            <button className="close-info-bubble" onClick={toggleInfoBubble}>×</button>
          </div>
        )}
        
      </div>

      {/* Background Heat Gradients */}
      <div className="heat-orb orb1"></div>
      <div className="heat-orb orb2"></div>

      {/* Pregnancy Health Data Chart Modal */}
      <PregnancyHealthDataChart 
        isOpen={showHealthDataChart} 
        onClose={() => setShowHealthDataChart(false)} 
      />
    </div>
  );
};

export default HeatImpact;