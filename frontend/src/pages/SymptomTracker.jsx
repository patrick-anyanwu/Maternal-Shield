// KnowledgeGarden.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Search, AlertTriangle, ArrowRight, ChevronLeft, Calendar, PieChart, FileText, ArrowLeft, ArrowUp, Check, AlertCircle, Info, Download, BarChart } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import "../styles/SymptomTracker.css";
import SymptomCharts from "./SymptomCharts";

// Enhanced Notification Component
const Notification = ({ 
  isOpen, 
  onClose, 
  message, 
  title = "", 
  type = "info", // "info", "success", "error", "warning"
  confirmButtonText = "OK",
  showConfirmButton = true,
  showCancelButton = false,
  cancelButtonText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {},
  autoClose = false,
  autoCloseTime = 3000
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [exitAnimation, setExitAnimation] = useState(false);


  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setExitAnimation(false);
    }
    
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseTime]);
  
  const handleClose = () => {
    setExitAnimation(true);
    
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };
  
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };
  
  const handleCancel = () => {
    onCancel();
    handleClose();
  };
  
  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay (not its children)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  if (!isVisible) return null;
  
  // Define type-specific styles and icons
  const getIcon = () => {
    switch(type) {
      case "success":
        return <Check className="notification-icon success" />;
      case "error":
        return <AlertCircle className="notification-icon error" />;
      case "warning":
        return <AlertTriangle className="notification-icon warning" />;
      case "info":
      default:
        return <Info className="notification-icon info" />;
    }
  };
  
  return (
    <div 
      className={`notification-overlay ${exitAnimation ? 'fade-out' : 'fade-in'}`}
      onClick={handleOverlayClick}
    >
      <div className={`notification-box notification-${type} ${exitAnimation ? 'slide-out' : 'slide-in'}`}>
        <div className="notification-header">
          <div className="notification-title-container">
            {getIcon()}
            <h2 className="notification-title">{title}</h2>
          </div>
          <button className="close-button" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="notification-content">
          <p>{message}</p>
        </div>
        
        <div className="notification-actions">
          {showCancelButton && (
            <button className="cancel-button" onClick={handleCancel}>
              {cancelButtonText}
            </button>
          )}
          {showConfirmButton && (
            <button className="confirm-button" onClick={handleConfirm}>
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Symptom Rating Component for the step-by-step flow
const SymptomRating = ({ symptom, onRate, onNext, onPrevious, isFirst, isLast, value, notes, onNotesChange }) => {
  return (
    <div className="symptom-rating-card">
      <h3 className="symptom-name">{symptom.name}</h3>
      
      <div className="symptom-question">
        <p>How would you rate your {symptom.name.toLowerCase()} today?</p>
      </div>
      
      <div className="severity-selector">
        <div className="severity-options">
          {[0, 1, 2, 3, 4, 5].map(level => (
            <button 
              key={level}
              className={`severity-btn ${value === level ? 'selected' : ''} severity-${level}`}
              onClick={() => onRate(level)}
              aria-label={`Severity level ${level}`}
            >
              {level === 0 ? 'None' : level}
              {value === level && <span className="selected-indicator"></span>}
            </button>
          ))}
        </div>
        <div className="severity-labels">
          <span>None</span>
          <span>Severe</span>
        </div>
      </div>
      
      <div className="symptom-notes">
        <label htmlFor={`notes-${symptom.id}`}>Additional notes (optional):</label>
        <textarea 
          id={`notes-${symptom.id}`} 
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add details about timing, triggers, etc."
        />
      </div>
      
      <div className="navigation-buttons">
        {!isFirst && (
          <button className="previous-btn" onClick={onPrevious} aria-label="Previous symptom">
            <ArrowLeft size={16} />
            Previous
          </button>
        )}
        
        <button 
          className="next-btn" 
          onClick={onNext}
          aria-label={isLast ? "Complete" : "Next symptom"}
        >
          {isLast ? 'Complete' : 'Next'}
          {isLast ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
      
      <div className="progress-indicator">
        <div className="progress-label">
          <span>Symptom {symptom.id} of 6</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(symptom.id / 6) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Summary Card Component to show after completing all symptoms
const SymptomSummary = ({ symptoms, onEdit, onSave, onReset }) => {
  const hasSymptoms = symptoms.some(s => s.severity > 0);
  
  
  return (
    <div className="symptom-summary-card">
      <h3>Symptom Summary</h3>
      
      {hasSymptoms ? (
        <div className="symptoms-summary">
          <p>You've reported the following symptoms:</p>
          <ul className="summary-list">
            {symptoms
              .filter(s => s.severity > 0)
              .map(s => (
                <li key={s.id} className={`severity-${s.severity}`}>
                  <strong>{s.name}:</strong> {s.severity}/5
                  {s.notes && <div className="summary-notes">{s.notes}</div>}
                </li>
              ))
            }
          </ul>
        </div>
      ) : (
        <div className="no-symptoms">
          <p>You haven't reported any symptoms today.</p>
        </div>
      )}
      
      <div className="summary-actions">
        <button className="edit-btn" onClick={onEdit}>
          <ArrowLeft size={16} />
          Edit Responses
        </button>
        <button className="save-btn" onClick={onSave}>
          Save
          <Check size={16} />
        </button>
        <button className="reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

const SymptomTracker = () => {
  // Get API keys from environment variables
  const WEATHER_API_KEY = process.env.REACT_APP_HEAT_API_KEY;
  const AIR_API_KEY = process.env.REACT_APP_AIR_API_KEY;
  
  // State for flow control
  const [currentStep, setCurrentStep] = useState('location');
  const [activeView, setActiveView] = useState('logger');
  
  // State for location and environmental data
  const [location, setLocation] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [isLoadingEnvData, setIsLoadingEnvData] = useState(false);
  
  // State for notification
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: () => {},
    showCancelButton: false
  });
  
  // State for symptoms tracking
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [symptoms, setSymptoms] = useState([
    { id: 1, name: 'Headache', severity: 0, notes: '' },
    { id: 2, name: 'Fatigue', severity: 0, notes: '' },
    { id: 3, name: 'Swelling', severity: 0, notes: '' },
    { id: 4, name: 'Breathing Issues', severity: 0, notes: '' },
    { id: 5, name: 'Nausea', severity: 0, notes: '' },
    { id: 6, name: 'Dizziness', severity: 0, notes: '' }
  ]);
  
  // State for step-by-step symptom logging
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  // State for tracking history
  const [symptomHistory, setSymptomHistory] = useState({});
  const [correlationInsights, setCorrelationInsights] = useState([]);
  const [activeVisualOption, setActiveVisualOption] = useState('overview');

  // Refs for search functionality
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Function to show notification
  const showNotification = (type, title, message, onConfirm = () => {}, showCancelButton = false) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      showCancelButton
    });
  };
  
  // Function to close notification
  const closeNotification = () => {
    setNotification({...notification, isOpen: false});
  };
  
  // Load symptoms history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('symptomHistory');
    if (savedHistory) {
      setSymptomHistory(JSON.parse(savedHistory));
    }
    
    // Check if user has already logged symptoms today
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[currentDate]) {
        setSymptoms(history[currentDate].symptoms);
      } else {
        // Reset symptoms for a new day
        resetSymptoms();
      }
    }

    // Set default location if saved in localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
      setSearchInput(savedLocation);
      // Move to main interface if we have a saved location
      setCurrentStep('main');
    }
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

  // Function to fetch weather data when location changes
  useEffect(() => {
    if (location && currentStep === 'main') {
      fetchWeatherData();
    }
  }, [location, currentStep]);
  
  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async () => {
    setIsLoadingEnvData(true);
    
    try {
      // First, geocode the location to get coordinates
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location},AU&limit=1&appid=${WEATHER_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.length) {
        console.error("Location not found");
        showNotification('error', 'Location Error', "Location not found. Please try another Australian suburb or city.");
        setIsLoadingEnvData(false);
        return;
      }

      const { lat, lon } = geocodeData[0];

      // Get current weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      
      // Get air quality data
      const airQualityResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AIR_API_KEY}`
      );
      const airQualityData = await airQualityResponse.json();

      if (weatherData && airQualityData) {
        setEnvironmentalData({
          temperature: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          pm25: airQualityData.list[0].components.pm2_5,
          aqi: airQualityData.list[0].main.aqi,
          date: currentDate
        });
      }
      
      setIsLoadingEnvData(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      showNotification('error', 'Data Error', "Error fetching weather data. Please check your connection and try again.");
      setIsLoadingEnvData(false);
    }
  };
  
  // Get user location from browser
  const getUserLocation = () => {
    setIsLoadingEnvData(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Reverse geocode to get location name
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
              const place = data[0];
              // Check if in Australia
              if (place.country === "AU") {
                const locationName = `${place.name}, ${place.state || "AU"}`;
                setLocation(locationName);
                setSearchInput(locationName);
                // Save to localStorage
                localStorage.setItem('userLocation', locationName);
                // Move to main interface
                setCurrentStep('main');
              }
              else {
                showNotification('warning', 'Location Notice', "This application is designed for Australian locations only.");
              }
            }
          } catch (error) {
            console.error("Error getting location name:", error);
            showNotification('error', 'Location Error', "Error getting location name. Please try entering your location manually.");
          } finally {
            setIsLoadingEnvData(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          showNotification('error', 'Permission Error', "Could not access your location. Please make sure you've granted permission.");
          setIsLoadingEnvData(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      showNotification('error', 'Browser Error', "Geolocation is not supported by your browser. Please enter your location manually.");
      setIsLoadingEnvData(false);
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
        `https://api.openweathermap.org/geo/1.0/direct?q=${input},Australia&limit=10&appid=${WEATHER_API_KEY}`
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
    setLocation(location.display);
    setSearchInput(location.display);
    setShowSuggestions(false);
    
    // Save to localStorage
    localStorage.setItem('userLocation', location.display);
  };
  
  // Continue to main interface
  const handleContinueToMain = () => {
    if (!location) {
      showNotification('warning', 'Location Required', "Please enter or select your location before continuing.");
      return;
    }
    
    setCurrentStep('main');
    fetchWeatherData();
  };
  
  // Step-by-step symptom logging handlers
  const handleNextSymptom = () => {
    if (currentSymptomIndex < symptoms.length - 1) {
      setCurrentSymptomIndex(currentSymptomIndex + 1);
    } else {
      setShowSummary(true);
    }
  };
  
  const handlePreviousSymptom = () => {
    if (currentSymptomIndex > 0) {
      setCurrentSymptomIndex(currentSymptomIndex - 1);
    }
    // If we're in the summary view, go back to the last symptom
    if (showSummary) {
      setShowSummary(false);
      setCurrentSymptomIndex(symptoms.length - 1);
    }
  };
  
  const handleSeverityChange = (id, value) => {
    setSymptoms(symptoms.map(symptom => 
      symptom.id === id ? { ...symptom, severity: parseInt(value) } : symptom
    ));
  };
  
  const handleNotesChange = (id, notes) => {
    setSymptoms(symptoms.map(symptom => 
      symptom.id === id ? { ...symptom, notes } : symptom
    ));
  };
  
  // Reset symptoms to default state
  const resetSymptoms = () => {
    setSymptoms(symptoms.map(symptom => ({ ...symptom, severity: 0, notes: '' })));
    setCurrentSymptomIndex(0);
    setShowSummary(false);
  };
  
  // Save today's symptoms
  const saveSymptoms = () => {
    if (!environmentalData) {
      showNotification('warning', 'Data Required', 'Please wait for environmental data to load before saving symptoms.');
      return;
    }
    
    // Create updated history object
    const updatedHistory = {
      ...symptomHistory,
      [currentDate]: {
        symptoms: symptoms,
        environmentalData: environmentalData
      }
    };
    
    // Save to localStorage
    localStorage.setItem('symptomHistory', JSON.stringify(updatedHistory));
    setSymptomHistory(updatedHistory);
    
    // Generate insights if we have multiple days of data
    if (Object.keys(updatedHistory).length > 1) {
      generateCorrelationInsights(updatedHistory);
    }
    
    // Reset to first symptom for next time
    setCurrentSymptomIndex(0);
    setShowSummary(false);
    
    // Show confirmation
    showNotification('success', 'Symptoms Saved', 'Your symptoms have been saved successfully!', () => {
      // After saving, you could navigate to history view
      setActiveView('history');
    });
  };
  
  // Change the date for logging or viewing
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setCurrentDate(newDate);
    
    // Check if we have data for this date
    if (symptomHistory[newDate]) {
      setSymptoms(symptomHistory[newDate].symptoms);
    } else {
      resetSymptoms();
    }
    
    // Reset to first symptom when changing date
    setCurrentSymptomIndex(0);
    setShowSummary(false);
  };
  
  // Generate insights based on historical data
  const generateCorrelationInsights = (history) => {
    const insights = [];
    
    // Check if there are any high severity symptoms
    const highSeverityDays = Object.entries(history).filter(([date, data]) => 
      data.symptoms.some(s => s.severity >= 4)
    );
    
    if (highSeverityDays.length > 0) {
      // Check for PM2.5 correlation
      const highPM25Days = highSeverityDays.filter(([date, data]) => 
        data.environmentalData && data.environmentalData.pm25 > 10
      );
      
      if (highPM25Days.length / highSeverityDays.length > 0.5) {
        insights.push("Your symptoms appear to worsen on days with higher PM2.5 levels.");
      }
      
      // Check for temperature correlation
      const highTempDays = highSeverityDays.filter(([date, data]) => 
        data.environmentalData && data.environmentalData.temperature > 30
      );
      
      if (highTempDays.length / highSeverityDays.length > 0.5) {
        insights.push("Your symptoms appear to be stronger on hotter days.");
      }
    }
    
    // Check which symptoms commonly occur together
    const symptomPairs = {};
    Object.values(history).forEach(day => {
      const activeSymptomsToday = day.symptoms.filter(s => s.severity >= 3);
      
      for (let i = 0; i < activeSymptomsToday.length; i++) {
        for (let j = i + 1; j < activeSymptomsToday.length; j++) {
          const pair = [activeSymptomsToday[i].name, activeSymptomsToday[j].name].sort().join('-');
          symptomPairs[pair] = (symptomPairs[pair] || 0) + 1;
        }
      }
    });
    
    // Find frequent symptom pairs
    const frequentPairs = Object.entries(symptomPairs)
      .filter(([pair, count]) => count > 1)
      .map(([pair, count]) => pair.split('-'));
      
    if (frequentPairs.length > 0) {
      const [symp1, symp2] = frequentPairs[0];
      insights.push(`${symp1} and ${symp2} often occur together for you.`);
    }
    
    // Add general insights if we don't have specific correlations yet
    if (insights.length === 0) {
      insights.push("Continue tracking to discover environmental patterns that may affect your symptoms.");
    }
    
    setCorrelationInsights(insights);
  };
  
  // Helper function to calculate average severity for a symptom
  const calculateAvgSeverity = (symptomId) => {
    const entries = Object.values(symptomHistory)
      .map(day => day.symptoms.find(s => s.id === symptomId))
      .filter(s => s && s.severity > 0);
      
    if (entries.length === 0) return 0;
    
    const sum = entries.reduce((total, s) => total + s.severity, 0);
    return sum / entries.length;
  };
  

// This function replaces the generateReport function in your code
const generateReport = () => {
    // Check if we have data
    if (Object.keys(symptomHistory).length === 0) {
      showNotification('warning', 'No Data', "You need to log symptoms before generating a report.");
      return;
    }
    
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Define brand colors
      const brandBlue = [75, 107, 175]; // Main blue color
      const severityColors = [
        [100, 180, 100], // 1 - Mild (green)
        [160, 180, 100], // 2 - Low (yellow-green)
        [220, 180, 100], // 3 - Moderate (yellow)
        [240, 140, 100], // 4 - Significant (orange)
        [240, 100, 100]  // 5 - Severe (red)
      ];
      
      // Helper function to add page header and footer
      const addPageDecoration = (pageNum) => {
        // Add header with logo styling
        doc.setFillColor(...brandBlue);
        doc.rect(0, 0, pageWidth, 18, 'F');
        
        // Add report title
        doc.setTextColor(255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Maternal Shield - Symptom Report", pageWidth / 2, 12, { align: "center" });
        
        // Add page number with improved visibility
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - 30, 6, 20, 12, 2, 2, 'F');
        doc.setTextColor(...brandBlue);
        doc.setFontSize(12);
        doc.text(`Page ${pageNum}`, pageWidth - 20, 14, { align: "center" });
        
        // Reset text color for body content
        doc.setTextColor(0);
        doc.setFont('helvetica', 'normal');
        
        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          'This report is generated for informational purposes only and is not a medical diagnosis.',
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      };
      
      // Add first page header
      addPageDecoration(1);
      
      // Add report metadata
      let currentY = 30;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Report Information", 14, currentY);
      currentY += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-AU', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      })}`, 20, currentY);
      currentY += 8;
      
      doc.text(`Location: ${location}`, 20, currentY);
      currentY += 8;
      
      // Date range of records
      const dates = Object.keys(symptomHistory).sort();
      const startDate = new Date(dates[0]).toLocaleDateString('en-AU', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      });
      const endDate = new Date(dates[dates.length - 1]).toLocaleDateString('en-AU', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      });
      
      doc.text(`Period: ${startDate} to ${endDate} (${dates.length} days)`, 20, currentY);
      currentY += 15;
      
      // Add horizontal separator
      doc.setDrawColor(200);
      doc.line(14, currentY, pageWidth - 14, currentY);
      currentY += 15;
      
      // Symptom summary section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Symptom Summary", 14, currentY);
      currentY += 10;
      
      // Calculate symptom frequencies and severity
      const symptomData = symptoms.map(s => {
        const count = Object.values(symptomHistory)
          .filter(day => day.symptoms.find(ds => ds.id === s.id && ds.severity > 0))
          .length;
          
        const avgSeverity = calculateAvgSeverity(s.id);
        
        return { name: s.name, count, avgSeverity };
      })
      .filter(s => s.count > 0)
      .sort((a, b) => b.avgSeverity - a.avgSeverity);
      
      // Create a table for the symptom summary
      if (symptomData.length > 0) {
        // Table header
        doc.setFillColor(240, 240, 240);
        doc.rect(20, currentY, pageWidth - 40, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text("Symptom", 25, currentY + 5.5);
        doc.text("Days Present", 85, currentY + 5.5);
        doc.text("Avg. Severity", 130, currentY + 5.5);
        currentY += 8;
        
        // Table rows
        doc.setFont('helvetica', 'normal');
        symptomData.forEach((symptom, index) => {
          // Alternate row background for better readability
          if (index % 2 === 0) {
            doc.setFillColor(248, 248, 248);
            doc.rect(20, currentY, pageWidth - 40, 8, 'F');
          }
          
          doc.text(symptom.name, 25, currentY + 5.5);
          doc.text(symptom.count.toString(), 95, currentY + 5.5);
          
          // Color-code the severity
          const severityIndex = Math.min(Math.max(Math.floor(symptom.avgSeverity), 1), 5) - 1;
          doc.setTextColor(...severityColors[severityIndex]);
          doc.setFont('helvetica', 'bold');
          doc.text(symptom.avgSeverity.toFixed(1) + "/5", 140, currentY + 5.5);
          doc.setTextColor(0);
          doc.setFont('helvetica', 'normal');
          
          currentY += 8;
        });
      } else {
        doc.text("No symptoms have been recorded yet.", 20, currentY + 5);
        currentY += 10;
      }
      
      currentY += 15;
      
      // Correlations section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Potential Correlations", 14, currentY);
      currentY += 10;
      
      // Add correlations content
      doc.setFont('helvetica', 'normal');
      if (correlationInsights.length > 0) {
        correlationInsights.forEach(insight => {
          doc.text(`• ${insight}`, 20, currentY);
          currentY += 8;
        });
      } else {
        doc.text("Continue tracking to discover environmental patterns.", 20, currentY);
        currentY += 8;
      }
      
      currentY += 15;
      
      // Daily symptom log section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Daily Symptom Log", 14, currentY);
      currentY += 15;
      
      // Loop through each date
      Object.entries(symptomHistory)
        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB)) // Sort chronologically
        .forEach(([date, data]) => {
          // Check if we need a new page - leave more space for entries with notes
          if (currentY > 230) {
            doc.addPage();
            addPageDecoration(doc.getNumberOfPages());
            currentY = 30;
          }
          
          // Date header with background
          doc.setFillColor(230, 235, 245);
          doc.rect(14, currentY, pageWidth - 28, 8, 'F');
          doc.setFont('helvetica', 'bold');
          doc.text(new Date(date).toLocaleDateString('en-AU', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }), 20, currentY + 5.5);
          currentY += 10; // Increased spacing after date header
          
          // Environmental data
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          const envText = `Temperature: ${data.environmentalData.temperature.toFixed(1)}°C   |   ` +
                          `PM2.5: ${data.environmentalData.pm25.toFixed(1)}   |   ` +
                          `Air Quality: ${getAirQualityText(data.environmentalData.aqi)}`;
          doc.text(envText, 20, currentY + 4);
          currentY += 10;
          
          // Symptoms
          const activeSymptoms = data.symptoms.filter(s => s.severity > 0);
          
          if (activeSymptoms.length > 0) {
            doc.setFontSize(11);
            activeSymptoms.forEach(symptom => {
              // Get severity color
              const severityIndex = symptom.severity - 1;
              const color = severityIndex >= 0 ? severityColors[severityIndex] : [100, 100, 100];
              
              // Check if we need a new page for this symptom entry
              if (currentY > 250) {
                doc.addPage();
                addPageDecoration(doc.getNumberOfPages());
                currentY = 30;
              }
              
              // Draw colored circle for severity indicator
              doc.setFillColor(...color);
              doc.circle(25, currentY, 3, 'F');
              
              // Symptom text with severity colored
              doc.setTextColor(...color);
              doc.setFont('helvetica', 'bold');
              doc.text(`${symptom.name}: ${symptom.severity}/5`, 30, currentY);
              doc.setTextColor(0);
              doc.setFont('helvetica', 'normal');
              currentY += 8; // Increased spacing between symptom and potential notes
              
              // Add notes if any with improved formatting
              if (symptom.notes && symptom.notes.trim() !== '') {
                doc.setFontSize(9);
                
                // Calculate if we need to wrap notes text
                const maxWidth = pageWidth - 60; // Leaving margin on both sides
                const textLines = doc.splitTextToSize(`Notes: ${symptom.notes}`, maxWidth);
                
                // Add each line of the wrapped text
                textLines.forEach((line, i) => {
                  // Check if we need a new page for this note line
                  if (currentY > 260) {
                    doc.addPage();
                    addPageDecoration(doc.getNumberOfPages());
                    currentY = 30;
                  }
                  
                  // Position and indent notes text
                  doc.text(line, 35, currentY);
                  currentY += 5;
                });
                
                doc.setFontSize(11);
                currentY += 3; // Add extra space after notes
              } else {
                currentY += 4; // Less space if no notes
              }
            });
          } else {
            doc.text("No symptoms reported", 30, currentY);
            currentY += 7;
          }
          
          // Add MORE spacing between date entries - this is the key improvement!
          currentY += 20;
        });
      
      // Save the PDF with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      doc.save(`maternal_shield_symptom_report_${timestamp}.pdf`);
      
      showNotification('success', 'Report Generated', 'Your symptom report has been generated and downloaded successfully.');
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification('error', 'Report Error', "There was an error generating your report. Please try again later.");
    }
  };
  
  // Clear all saved data
  const clearAllData = () => {
    setNotification({
      isOpen: true,
      type: 'error',
      title: 'Clear All Data',
      message: "Are you sure you want to clear all your symptom history? This cannot be undone.",
      onConfirm: () => {
        localStorage.removeItem('symptomHistory');
        setSymptomHistory({});
        resetSymptoms();
        setCorrelationInsights([]);
        showNotification('success', 'Data Cleared', "All symptom data has been cleared.");
      },
      showCancelButton: true
    });
  };

  // Get the air quality text representation
  const getAirQualityText = (aqi) => {
    if (aqi === 1) return 'Good';
    if (aqi === 2) return 'Fair';
    if (aqi === 3) return 'Moderate';
    if (aqi === 4) return 'Poor';
    return 'Very Poor';
  };

  // Change location
  const handleChangeLocation = () => {
    setCurrentStep('location');
  };

  // Get current symptom being displayed
  const currentSymptom = symptoms[currentSymptomIndex];

  return (
    <div className="app-container">
      {/* Notification component */}
      <Notification 
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
        onConfirm={notification.onConfirm}
        showCancelButton={notification.showCancelButton}
      />
      
      <div className="maternal-shield-header">
        <div className="logo">
          <span className="logo-maternal">Maternal</span>
          <span className="logo-shield">Shield</span>
        </div>
        <nav className="main-nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Heatwave</a>
          <a href="#" className="nav-link">PM2.5</a>
          <a href="#" className="nav-link active">Symptom Tracker</a>
        </nav>
      </div>

      <div className="symptom-tracker-container">
        <h1>Symptom Tracker</h1>
        <p className="intro-text">
          Track your symptoms alongside environmental conditions to identify potential triggers and share insights with your healthcare provider.
        </p>
        
        {/* Step 1: Location Collection */}
        {currentStep === 'location' && (
          <div className="location-setup-step">
            <div className="location-card">
              <h2>Where are you located?</h2>
              <p>We need your location to provide relevant environmental data that may affect your symptoms.</p>
              
              <div className="location-input">
                <div className="location-search">
                  <div className="search-input-wrapper">
                    <input 
                      type="text"
                      placeholder="Search for Australian suburb or city..."
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      ref={searchInputRef}
                      onClick={() => {
                        if (searchInput.length > 1) {
                          fetchLocationSuggestions(searchInput);
                          setShowSuggestions(true);
                        }
                      }}
                      className="improved-input"
                    />
                    {searchInput && (
                      <button className="clear-search-button" onClick={handleClearSearch} aria-label="Clear search">
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
                
                <div className="location-buttons">
                  <button className="location-btn" onClick={getUserLocation}>
                    <MapPin size={16} className="button-icon" />
                    Use My Location
                  </button>
                  
                  <button 
                    className="continue-btn" 
                    onClick={handleContinueToMain}
                    disabled={!location}
                  >
                    Continue
                    <ArrowRight size={16} className="button-icon" />
                  </button>
                </div>
              </div>
              
              {location && <p className="current-location">Selected Location: {location}</p>}
              {isLoadingEnvData && <p className="loading-indicator">Detecting your location...</p>}
              
              <div className="privacy-note">
              <p>Your location data is only stored on your device and is used solely to provide relevant environmental information.</p>
             </div>
           </div>
         </div>
       )}
       
       {/* Step 2: Main Interface */}
       {currentStep === 'main' && (
         <div className="main-interface">
           {/* Location Bar */}
           <div className="location-bar">
             <div className="location-info">
               <MapPin size={16} className="location-icon" />
               <span>{location}</span>
             </div>
             <button className="change-location-btn" onClick={handleChangeLocation}>
               Change
             </button>
           </div>
           
           {/* Environmental Data Summary */}
           <div className="env-data-summary">
             {isLoadingEnvData ? (
               <p className="loading-indicator">Loading environmental data...</p>
             ) : environmentalData ? (
               <div className="env-data-pills">
                 <div className="env-pill">
                   <span className="env-value">{environmentalData.temperature.toFixed(1)}°C</span>
                   {environmentalData.temperature > 35 && (
                     <span className="heat-alert">
                       <AlertTriangle size={12} className="alert-icon" />
                     </span>
                   )}
                 </div>
                 <div className="env-pill">
                   <span className="env-label">Humidity</span>
                   <span className="env-value">{environmentalData.humidity}%</span>
                 </div>
                 <div className="env-pill">
                   <span className="env-label">PM2.5</span>
                   <span className="env-value">{environmentalData.pm25.toFixed(1)}</span>
                 </div>
                 <div className={`env-pill aqi-${environmentalData.aqi}`}>
                   <span className="env-label">Air</span>
                   <span className="env-value">{getAirQualityText(environmentalData.aqi)}</span>
                 </div>
               </div>
             ) : (
               <p className="no-env-data">Environmental data unavailable</p>
             )}
           </div>
           
           {/* Navigation tabs */}
           <div className="tracker-tabs">
             <button 
               className={activeView === 'logger' ? 'active-tab' : ''} 
               onClick={() => setActiveView('logger')}
             >
               <Calendar size={16} className="tab-icon" />
               Log Symptoms
             </button>
             <button 
               className={activeView === 'history' ? 'active-tab' : ''} 
               onClick={() => setActiveView('history')}
             >
               <PieChart size={16} className="tab-icon" />
               History
             </button>
             <button 
               className={activeView === 'report' ? 'active-tab' : ''} 
               onClick={() => setActiveView('report')}
             >
               <FileText size={16} className="tab-icon" />
               Reports
             </button>
             <button 
              className={activeView === 'visualize' ? 'active-tab' : ''} 
              onClick={() => setActiveView('visualize')}
            >
              <BarChart size={16} className="tab-icon" />
              Visualize
            </button>
           </div>
           
           {/* Conditional content based on active view */}
           <div className="view-content">
             {activeView === 'logger' && (
               <div className="symptoms-logger">
                 <div className="date-selector">
                   <label htmlFor="symptom-date">Date:</label>
                   <input 
                     type="date" 
                     id="symptom-date" 
                     value={currentDate}
                     onChange={handleDateChange}
                     max={new Date().toISOString().split('T')[0]}
                     className="improved-input"
                   />
                 </div>
                 
                 {/* Step-by-step symptom logging interface */}
                 <div className="symptom-step-container">
                   {!showSummary ? (
                     <SymptomRating 
                       symptom={currentSymptom}
                       value={currentSymptom.severity}
                       notes={currentSymptom.notes}
                       onRate={(value) => handleSeverityChange(currentSymptom.id, value)}
                       onNotesChange={(notes) => handleNotesChange(currentSymptom.id, notes)}
                       onNext={handleNextSymptom}
                       onPrevious={handlePreviousSymptom}
                       isFirst={currentSymptomIndex === 0}
                       isLast={currentSymptomIndex === symptoms.length - 1}
                     />
                   ) : (
                     <SymptomSummary 
                       symptoms={symptoms}
                       onEdit={handlePreviousSymptom}
                       onSave={saveSymptoms}
                       onReset={resetSymptoms}
                     />
                   )}
                 </div>
               </div>
             )}
             
             {activeView === 'history' && (
               <div className="history-view">
                 {Object.keys(symptomHistory).length === 0 ? (
                   <div className="empty-state">
                     <div className="empty-icon">📊</div>
                     <h3>No History Yet</h3>
                     <p>You haven't logged any symptoms yet. Start by logging your symptoms for today.</p>
                     <button className="primary-btn" onClick={() => setActiveView('logger')}>
                       Log Symptoms Now
                     </button>
                   </div>
                 ) : (
                   <>
                     <div className="insights-section">
                       <h3>Potential Correlations</h3>
                       <ul className="insights-list">
                         {correlationInsights.map((insight, index) => (
                           <li key={index}>{insight}</li>
                         ))}
                       </ul>
                     </div>
                     
                     <div className="history-calendar">
                       <h3>Symptom Calendar</h3>
                       <div className="calendar-grid">
                         {Object.entries(symptomHistory)
                           .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                           .map(([date, data]) => (
                             <div key={date} className="history-day">
                               <h4>{new Date(date).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
                               <div className="day-symptoms">
                                 {data.symptoms
                                   .filter(s => s.severity > 0)
                                   .map(s => (
                                     <div key={s.id} className={`day-symptom severity-${s.severity}`}>
                                       {s.name}: {s.severity}
                                     </div>
                                   ))}
                               </div>
                               <div className="day-env">
                                 <span>PM2.5: {data.environmentalData.pm25.toFixed(1)}</span>
                                 <span>Temp: {data.environmentalData.temperature.toFixed(1)}°C</span>
                               </div>
                             </div>
                           ))}
                       </div>
                     </div>
                     
                     <button className="danger-btn" onClick={clearAllData}>Clear All Data</button>
                   </>
                 )}
               </div>
             )}
             
             {activeView === 'visualize' && (
              <div className="visualization-view">
                {Object.keys(symptomHistory).length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No Data for Visualizations</h3>
                    <p>You need to log symptoms before visualizing data patterns. Start by logging your symptoms on the first tab.</p>
                    <button className="primary-btn" onClick={() => setActiveView('logger')}>
                      Log Symptoms Now
                    </button>
                  </div>
                ) : (
                  <div className="visualization-content">
                    <div className="visualization-options">
                      <button 
                        className={`visualization-btn ${activeVisualOption === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveVisualOption('overview')}
                      >
                        Overview
                      </button>
                      <button 
                        className={`visualization-btn ${activeVisualOption === 'temperature' ? 'active' : ''}`}
                        onClick={() => setActiveVisualOption('temperature')}
                      >
                        Temperature Impact
                      </button>
                      <button 
                        className={`visualization-btn ${activeVisualOption === 'pm25' ? 'active' : ''}`}
                        onClick={() => setActiveVisualOption('pm25')}
                      >
                        Air Quality Impact
                      </button>
                    </div>
                    <SymptomCharts 
                      symptomHistory={symptomHistory} 
                      activeVisualTab={activeVisualOption}
                    />
                  </div>
                )}
              </div>
            )}

             {activeView === 'report' && (
               <div className="report-view">
                 {Object.keys(symptomHistory).length === 0 ? (
                   <div className="empty-state">
                     <div className="empty-icon">📄</div>
                     <h3>No Data for Reports</h3>
                     <p>You need to log symptoms before generating a report. Start by logging your symptoms on the first tab.</p>
                     <button className="primary-btn" onClick={() => setActiveView('logger')}>
                       Log Symptoms Now
                     </button>
                   </div>
                 ) : (
                   <>
                     <p className="report-intro">
                       Generate a report of your symptoms and environmental correlations to share with your healthcare provider.
                     </p>
                     
                     <div className="report-preview">
                       <h3>Report Preview</h3>
                       <div className="preview-content">
                         <p><strong>Date Range:</strong> {Object.keys(symptomHistory).sort()[0]} to {Object.keys(symptomHistory).sort().slice(-1)[0]}</p>
                         <p><strong>Total Days Recorded:</strong> {Object.keys(symptomHistory).length}</p>
                         
                         <h4>Most Frequent Symptoms:</h4>
                         <ul>
                           {symptoms
                             .map(s => {
                               const count = Object.values(symptomHistory)
                                 .filter(day => day.symptoms.find(ds => ds.id === s.id && ds.severity > 0))
                                 .length;
                               return { name: s.name, count };
                             })
                             .filter(s => s.count > 0)
                             .sort((a, b) => b.count - a.count)
                             .slice(0, 3)
                             .map(s => <li key={s.name}>{s.name} - {s.count} days</li>)
                           }
                         </ul>
                         
                         <h4>Environmental Correlations:</h4>
                         <ul>
                           {correlationInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                         </ul>
                       </div>
                     </div>
                     
                     <button className="generate-report-btn" onClick={generateReport}>
                       <Download size={16} className="button-icon" />
                       Download PDF Report
                     </button>
                   </>
                 )}
               </div>
             )}
           </div>
         </div>
       )}
       
       <div className="privacy-notice">
         <p>
           <strong>Privacy Notice:</strong> All data is stored locally on your device and is not transmitted to any server. 
           You can clear your data at any time from the History tab.
         </p>
       </div>
     </div>
   </div>
 );
};

export default SymptomTracker;