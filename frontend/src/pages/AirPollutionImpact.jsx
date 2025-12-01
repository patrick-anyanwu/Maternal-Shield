import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Info, MapPin, X, ThermometerSun } from "lucide-react";
import "../styles/AirPollutionImpact.css";

export default function AirPollutionImpact() {
  // Get API key from environment variables
  const API_KEY = process.env.REACT_APP_AIR_API_KEY;

  // State for PM2.5 and location
  const [pmValue, setPmValue] = useState(15);
  const [currentLocation, setCurrentLocation] = useState("Melbourne, VIC");
  const [activeTrimester, setActiveTrimester] = useState("first");
  const [activeArea, setActiveArea] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  const [isHighPollution, setIsHighPollution] = useState(false);
  const [isLoadingPollution, setIsLoadingPollution] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLegend, setActiveLegend] = useState(null);
  const [showInfoBubble, setShowInfoBubble] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [videoAvailable, setVideoAvailable] = useState(true);
  
  // Animation states
  const [showContent, setShowContent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [animateIn, setAnimateIn] = useState(false);

  // Refs
  const videoSectionRef = useRef(null);
  const cloudRef = useRef(null);
  const areaDetailsRef = useRef(null);
  const developmentSectionRef = useRef(null);

  // Navigate to heatwave page
  const navigateToHeatwave = () => {
    window.location.href = "/heatwave";
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

  // Fetch pollution data when location changes
  useEffect(() => {
    if (currentLocation) {
      fetchPollutionData();
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

  // Trimester sensitivity areas mapping based on research data from images
  const trimesterAreas = {
    first: [
      { id: "neurological-development", name: "Neurological Development", description: "Brain and neural system formation during weeks 3-25." },
      { id: "lung-development", name: "Lung Development", description: "Airways and alveoli begin forming." },
      { id: "placental-function", name: "Placental Function", description: "PM2.5 exposure can reduce placental blood flow." },
      { id: "miscarriage", name: "Miscarriage Risk", description: "Pollution exposure increases risk of early pregnancy loss." }
    ],
    second: [
      { id: "fetal-growth", name: "Fetal Growth", description: "PM2.5 exposure can impair growth rate." },
      { id: "immune-development", name: "Immune Development", description: "Exposure can alter immune system development." },
      { id: "organ-maturation", name: "Organ Maturation", description: "Critical time for development of lungs, liver, and kidneys." },
      { id: "gestational-diabetes", name: "Gestational Diabetes", description: "Air pollution can affect maternal glucose metabolism." }
    ],
    third: [
      { id: "preterm-birth", name: "Preterm Birth", description: "PM2.5 exposure increases risk of premature birth." },
      { id: "fetal-distress", name: "Fetal Distress", description: "Air pollution can lead to reduced oxygen supply." },
      { id: "placental-dysfunction", name: "Placental Dysfunction", description: "PM2.5 can compromise placenta's ability to function." },
      { id: "birth-weight", name: "Low Birth Weight", description: "Prolonged exposure can result in low birth weight." }
    ]
  };

  // Area details mapping based on research
  const areaDetails = {
    // First Trimester
    "neurological-development": {
      title: "Neurological Development (Weeks 3-25)",
      description: "During early pregnancy, the neural tube forms and develops into the brain and spinal cord. This is followed by extensive neuronal growth, migration, and connectivity formation that continues throughout pregnancy.",
      pollutionImpact: "Exposure to PM2.5 can disrupt neurodevelopmental processes by causing inflammation, oxidative stress, and potential epigenetic changes. Studies show that maternal exposure to air pollution is associated with neurodevelopmental disorders, reduced cognitive function, and behavioral issues in children.",
      recommendation: "During neurological development, it's critical to minimize exposure to PM2.5 levels above 12 µg/m³. Research indicates increased risk of autism spectrum disorders and reduced cognitive scores with exposures above this threshold during pregnancy."
    },
    "lung-development": {
      title: "Lung Development (First Trimester)",
      description: "The lungs begin to develop from the embryonic foregut around week 4, with airway branching patterns established during the first trimester. This sets the foundation for later alveolar development.",
      pollutionImpact: "PM2.5 particles can cross the placental barrier and affect developing lung tissues. Exposure during lung development can lead to reduced lung function, increased risk of asthma, and respiratory issues later in life. Cellular damage from pollution may alter normal branching patterns of developing airways.",
      recommendation: "Keep PM2.5 exposure below 12 µg/m³ during this critical period. Studies link maternal exposure to PM2.5 above 20 µg/m³ with a 20-30% increased risk of childhood asthma and reduced lung function at birth."
    },
    "placental-function": {
      title: "Placental Function (First Trimester)",
      description: "The placenta forms during the first trimester and is crucial for supplying oxygen and nutrients to the developing embryo. It also removes waste products and produces hormones necessary for pregnancy.",
      pollutionImpact: "PM2.5 exposure can cause placental inflammation and oxidative stress, impairing blood flow and nutrient transfer. This can lead to placental insufficiency and restricted fetal growth. Studies show that air pollution particles can be detected in placental tissues, potentially directly affecting placental function.",
      recommendation: "Even moderate PM2.5 levels (12-20 µg/m³) over several weeks can impair placental function. Research indicates that each 10 µg/m³ increase in PM2.5 exposure is associated with a 13% increase in risk of placental dysfunction."
    },
    "miscarriage": {
      title: "Miscarriage Risk (First Trimester)",
      description: "Early pregnancy is particularly vulnerable to environmental stressors. The embryo is undergoing rapid cell division and differentiation during this time.",
      pollutionImpact: "PM2.5 exposure during the first trimester is associated with increased risk of spontaneous abortion. The particles can cause systemic inflammation and oxidative stress, which may interfere with embryo implantation and development. High pollution levels have been linked to chromosome abnormalities and disrupted placental formation.",
      recommendation: "Avoid PM2.5 levels above 25 µg/m³, especially in early pregnancy. Studies suggest that each 10 µg/m³ increase in PM2.5 exposure during the first trimester is associated with an 8-16% increase in miscarriage risk."
    },
    
    // Second Trimester
    "fetal-growth": {
      title: "Fetal Growth (Weeks 14-26)",
      description: "The fetus undergoes significant growth during the second trimester, with rapid development in size and weight. This is a critical period for overall growth and organ development.",
      pollutionImpact: "Exposure to PM2.5 can impact growth rate by disrupting placental function and reducing oxygen and nutrient delivery to the fetus. Air pollution exposure has been consistently linked to intrauterine growth restriction (IUGR) and lower birth weight, with effects becoming more apparent during the second and third trimesters.",
      recommendation: "Try to stay in areas with PM2.5 below 12 µg/m³. Research shows that each 10 µg/m³ increase in PM2.5 exposure throughout pregnancy is associated with a 15-20g reduction in birth weight."
    },
    "immune-development": {
      title: "Immune System Development (Weeks 14-26)",
      description: "The fetal immune system begins developing during the first trimester, but significant maturation occurs during the second trimester, with the thymus expanding and T cells beginning to mature.",
      pollutionImpact: "PM2.5 exposure can alter immune system development through systemic inflammation and oxidative stress. This may lead to immune dysregulation and increased susceptibility to allergies, asthma, and autoimmune conditions later in life. Studies show that maternal air pollution exposure is associated with altered immune markers in cord blood.",
      recommendation: "Maintain PM2.5 exposure below 12 µg/m³ during this crucial developmental window. Research indicates that maternal exposure above 35 µg/m³ is associated with significant alterations in neonatal immune function."
    },
    "organ-maturation": {
      title: "Organ Maturation (Weeks 14-26)",
      description: "The second trimester is crucial for the development of organs such as the lungs, liver, and kidneys, which are developing functional structures. These organs are undergoing specialized development that prepares them for postnatal life.",
      pollutionImpact: "PM2.5 exposure can interfere with normal organ development through direct toxicity, inflammation, and oxidative stress. The particles may cross the placenta and directly impact developing tissues. Studies have linked maternal air pollution exposure to altered kidney development, reduced lung function, and metabolic disruptions in offspring.",
      recommendation: "Limit exposure to PM2.5 levels above 12 µg/m³, particularly during the second trimester. Research shows that high exposure (above 45 µg/m³) is associated with measurable changes in organ structure and function at birth."
    },
    "gestational-diabetes": {
      title: "Gestational Diabetes Risk (Weeks 14-26)",
      description: "During the second trimester, maternal insulin resistance naturally increases to ensure adequate glucose supply to the developing fetus. This metabolic adaptation can be disrupted by environmental factors.",
      pollutionImpact: "PM2.5 exposure can exacerbate insulin resistance and impair glucose metabolism through systemic inflammation and oxidative stress. Studies show associations between air pollution exposure during pregnancy and increased risk of gestational diabetes mellitus (GDM), particularly during the second trimester when insulin demands increase.",
      recommendation: "Aim for PM2.5 exposure below 12 µg/m³. Research indicates that each 10 µg/m³ increase in PM2.5 exposure during the second trimester is associated with a 10-25% increased risk of developing gestational diabetes."
    },
    
    // Third Trimester
    "preterm-birth": {
      title: "Preterm Birth Risk (Weeks 27-40)",
      description: "Preterm birth occurs when delivery happens before 37 weeks of pregnancy. This is one of the most significant risks of air pollution exposure in late pregnancy.",
      pollutionImpact: "PM2.5 exposure can trigger inflammatory processes that may lead to premature cervical ripening, membrane rupture, and onset of labor. Studies consistently show associations between air pollution exposure, particularly in the third trimester, and increased risk of preterm birth. The particles can induce systemic and placental inflammation, oxidative stress, and endothelial dysfunction.",
      recommendation: "Minimize exposure to PM2.5 levels above 12 µg/m³ in late pregnancy. Research indicates that each 10 µg/m³ increase in PM2.5 exposure during the third trimester is associated with a 15-30% increased risk of preterm birth."
    },
    "fetal-distress": {
      title: "Fetal Distress and Oxygen Supply (Weeks 27-40)",
      description: "Fetal distress occurs when the fetus does not receive adequate oxygen during pregnancy or labor. In severe cases, prolonged oxygen deprivation can lead to stillbirth.",
      pollutionImpact: "PM2.5 particles can reduce the oxygen-carrying capacity of maternal blood and impair placental oxygen transfer. High levels of air pollution exposure have been linked to fetal hypoxia, altered fetal heart rate patterns, and in severe cases, increased risk of stillbirth. The particles can damage placental blood vessels and reduce blood flow to the fetus.",
      recommendation: "Try to keep PM2.5 exposure below 12 µg/m³ during the third trimester. Research shows that exposure to levels above 35 µg/m³ has been associated with a 42% increased risk of stillbirth in some studies."
    },
    "placental-dysfunction": {
      title: "Placental Dysfunction (Weeks 27-40)",
      description: "The placenta is critical in supporting the fetus by supplying nutrients and oxygen, especially in the later stages of pregnancy when fetal demands are highest.",
      pollutionImpact: "PM2.5 exposure can lead to placental inflammation, oxidative stress, and vascular damage, compromising placental function. Studies have found air pollution particles embedded in placental tissues and associated with markers of placental insufficiency. This can reduce nutrient and oxygen transfer to the fetus, particularly problematic in late pregnancy when fetal demands are greatest.",
      recommendation: "Keep PM2.5 exposure below 12 µg/m³ in the third trimester. Research indicates that exposure to levels above 35 µg/m³ is associated with measurable changes in placental morphology and function, including reduced blood flow and increased markers of inflammation."
    },
    "birth-weight": {
      title: "Low Birth Weight (Weeks 27-40)",
      description: "Birth weight is a critical indicator of newborn health. The majority of fetal weight gain occurs during the third trimester, making this period especially important for growth.",
      pollutionImpact: "PM2.5 exposure in late pregnancy can significantly impact final birth weight through reduced placental function, impaired nutrient transfer, and direct effects on fetal metabolism. Numerous studies show dose-dependent relationships between maternal air pollution exposure and reduced birth weight, with the third trimester being particularly sensitive.",
      recommendation: "Try to maintain PM2.5 exposure below 12 µg/m³ during the third trimester. Meta-analyses indicate that each 10 µg/m³ increase in PM2.5 exposure throughout pregnancy is associated with a 15-20g reduction in birth weight, with stronger effects seen for third-trimester exposure."
    }
  };

  // Risk thresholds from the provided images data
  const riskThresholds = {
    first: {
      'neurological-development': { low: 12, moderate: 25, high: 35, extreme: 150, critical: 150 },
      'lung-development': { low: 12, moderate: 25, high: 35, extreme: 150, critical: 150 },
      'placental-function': { low: 12, moderate: 20, high: 35, extreme: 100, critical: 100 },
      'miscarriage': { low: 12, moderate: 25, high: 35, extreme: 150, critical: 150 }
    },
    second: {
      'fetal-growth': { low: 12, moderate: 25, high: 35, extreme: 150, critical: 150 },
      'immune-development': { low: 12, moderate: 20, high: 35, extreme: 100, critical: 100 },
      'organ-maturation': { low: 12, moderate: 25, high: 45, extreme: 150, critical: 150 },
      'gestational-diabetes': { low: 12, moderate: 25, high: 40, extreme: 150, critical: 150 }
    },
    third: {
      'preterm-birth': { low: 12, moderate: 20, high: 35, extreme: 100, critical: 100 },
      'fetal-distress': { low: 12, moderate: 25, high: 35, extreme: 100, critical: 100 },
      'placental-dysfunction': { low: 12, moderate: 20, high: 35, extreme: 100, critical: 100 },
      'birth-weight': { low: 12, moderate: 25, high: 35, extreme: 150, critical: 150 }
    }
  };

  // Fetch pollution data from OpenWeatherMap API
  const fetchPollutionData = async () => {
    setIsLoadingPollution(true);
    try {
      // First, geocode the location to get coordinates
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${currentLocation},AU&limit=1&appid=${API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.length) {
        console.error("Location not found");
        alert("Location not found. Please try another Australian suburb or city.");
        setIsLoadingPollution(false);
        return;
      }

      const { lat, lon } = geocodeData[0];

      // Get current air pollution data
      const pollutionResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const pollutionData = await pollutionResponse.json();

      if (pollutionData.list && pollutionData.list.length > 0) {
        const pm25Value = pollutionData.list[0].components.pm2_5;
        setPollutionData(pollutionData);
        setPmValue(Math.round(pm25Value));
        
        // Check for high pollution (PM2.5 > 35 µg/m³ is considered unhealthy)
        setIsHighPollution(pm25Value > 35);
      }
      
      setIsLoadingPollution(false);
    } catch (error) {
      console.error("Error fetching pollution data:", error);
      alert("Error fetching pollution data. Please check your connection and try again.");
      setIsLoadingPollution(false);
    }
  };

  // Get risk level and color based on PM2.5 value
  const getRiskLevel = (pm) => {
    if (pm <= 12) return { level: "Low", color: "#22c55e" }; // Green for safe level
    if (pm <= 25) return { level: "Moderate", color: "#f97316" }; // Orange
    if (pm <= 35) return { level: "High", color: "#ef4444" }; // Red
    if (pm <= 100) return { level: "Extreme", color: "#7f1d1d" }; // Dark red
    return { level: "Critical", color: "#450a0a", textColor: "#ffffff" }; // Very dark red with white text
  };
  
  // Get area-specific risk level based on PM2.5 and area ID
  const getAreaRiskLevel = (areaId, pm) => {
    // Get thresholds for this area from our tabular data
    const thresholds = riskThresholds[activeTrimester]?.[areaId];
    
    if (!thresholds) {
      // Default thresholds if area-specific not found
      if (pm <= 12) return { level: "Low", color: "#22c55e" };
      if (pm <= 25) return { level: "Moderate", color: "#f97316" };
      if (pm <= 35) return { level: "High", color: "#ef4444" };
      if (pm <= 100) return { level: "Extreme", color: "#7f1d1d" };
      return { level: "Critical", color: "#450a0a", textColor: "#ffffff" };
    }
    
    // Determine risk level based on PM value and thresholds
    if (pm <= thresholds.low) return { level: "Low", color: "#22c55e" };
    if (pm <= thresholds.moderate) return { level: "Moderate", color: "#f97316" };
    if (pm <= thresholds.high) return { level: "High", color: "#ef4444" };
    if (pm <= thresholds.extreme) return { level: "Extreme", color: "#7f1d1d" };
    return { level: "Critical", color: "#450a0a", textColor: "#ffffff" };
  };

  // Get cloud animation class based on PM2.5 value
  const getCloudAnimationClass = (pm) => {
    if (pm <= 12) return "cloud-pulse-clean";  // Clean air gentle pulse
    if (pm <= 25) return "cloud-pulse-moderate";
    if (pm <= 35) return "cloud-pulse-high";
    if (pm <= 100) return "cloud-pulse-extreme";
    return "cloud-pulse-critical";  // Strong pulsing for critical air quality
  };

  // Helper function to update PM2.5 value based on cursor position for slider
  const updatePmValueFromPosition = (clientX, rect) => {
    const barWidth = rect.width;
    const clickX = clientX - rect.left;
    
    // Constrain clickX to be within the bar
    const constrainedClickX = Math.max(0, Math.min(clickX, barWidth));
    
    // Convert the click position to a PM2.5 value (0 to 300 µg/m³)
    const percentFromLeft = constrainedClickX / barWidth;
    let newPm = Math.round(percentFromLeft * 300); // 0-300 µg/m³ range
    
    // Update PM value if changed
    if (newPm !== pmValue) {
      setPmValue(newPm);
      setShakeKey(prevKey => prevKey + 1); // Trigger animation
    }
  };

  // Improved pollution bar interaction with dragging capability
  const handlePollutionBarInteraction = (e) => {
    e.preventDefault(); // Prevent default behavior
    setIsDragging(true);
    
    const pollutionBar = document.querySelector('.pollution-slider');
    const rect = pollutionBar.getBoundingClientRect();
    
    // Initial PM update from start position
    if (e.type === 'touchstart') {
      if (e.touches && e.touches[0]) {
        updatePmValueFromPosition(e.touches[0].clientX, rect);
      }
    } else {
      updatePmValueFromPosition(e.clientX, rect);
    }
    
    // Setup handlers for movement
    const handleMouseMove = (moveEvent) => {
      updatePmValueFromPosition(moveEvent.clientX, rect);
      moveEvent.preventDefault();
    };
    
    const handleTouchMove = (moveEvent) => {
      if (moveEvent.touches && moveEvent.touches[0]) {
        updatePmValueFromPosition(moveEvent.touches[0].clientX, rect);
        moveEvent.preventDefault();
      }
    };
    
    // Clean up function for removing event listeners
    const cleanUpEvents = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', cleanUpEvents);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', cleanUpEvents);
    };
    
    // Add event listeners for dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', cleanUpEvents);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', cleanUpEvents);
  };
  
  const riskInfo = getRiskLevel(pmValue);

  // Get area risk description based on area ID and PM2.5 value
  const getAreaRiskDescription = (areaId, pm) => {
    const riskLevel = getAreaRiskLevel(areaId, pm).level.toLowerCase();
    
    // Area-specific descriptions based on research
    const descriptions = {
      // First Trimester
      'neurological-development': {
        low: "Normal neurological development expected",
        moderate: "Mild risk to neural development - exposure at 12-25 µg/m³ requires monitoring",
        high: "Significantly increased risk of neurodevelopmental issues - 26-35 µg/m³ can disrupt proper formation",
        extreme: "Critical risk to brain development - PM2.5 levels 36-150 µg/m³ can severely impair development",
        critical: "Severe danger to neurological development - levels above 150 µg/m³ can cause catastrophic effects"
      },
      'lung-development': {
        low: "Normal lung development expected",
        moderate: "Slight impact on lung formation - PM2.5 at 13-25 µg/m³ requires caution",
        high: "Increased risk of respiratory issues - 26-35 µg/m³ may affect airway development",
        extreme: "Severe risk to lung development - levels 36-150 µg/m³ can significantly disrupt formation",
        critical: "Catastrophic risk to pulmonary development - levels above 150 µg/m³ can cause major defects"
      },
      'placental-function': {
        low: "Normal placental function expected",
        moderate: "Minor impact on placental development - 13-20 µg/m³ can slightly impair function",
        high: "Reduced placental efficiency - 21-35 µg/m³ can set stage for later complications",
        extreme: "Severe placental insufficiency risk - levels 36-100 µg/m³ can critically impair function",
        critical: "Catastrophic placental failure risk - levels above 100 µg/m³ can cause irreparable damage"
      },
      'miscarriage': {
        low: "Baseline miscarriage risk",
        moderate: "Slightly elevated miscarriage risk - 13-25 µg/m³ exposure requires monitoring",
        high: "Significantly higher risk of pregnancy loss - 26-35 µg/m³ linked to embryonic stress",
        extreme: "Critical risk of spontaneous abortion - levels 36-150 µg/m³ can severely disrupt growth",
        critical: "Emergency risk of pregnancy loss - levels above 150 µg/m³ present immediate danger"
      },
      
      // Second Trimester
      'fetal-growth': {
        low: "Normal fetal growth expected",
        moderate: "Mild impact on growth rate - 13-25 µg/m³ over several days may affect weight gain",
        high: "Moderate risk of growth restriction - 26-35 µg/m³ can reduce nutrient transfer",
        extreme: "Severe growth restriction likely - levels 36-150 µg/m³ significantly impair development",
        critical: "Critical growth restriction - levels above 150 µg/m³ can cause severe developmental delays"
      },
      'immune-development': {
        low: "Normal immune development expected",
        moderate: "Mild stress on immune system formation - 13-20 µg/m³ may affect immune cell development",
        high: "Increased risk of immune dysregulation - 21-35 µg/m³ linked to altered immune markers",
        extreme: "Critical immune system dysfunction - levels 36-100 µg/m³ severely compromise development",
        critical: "Catastrophic immune programming risk - levels above 100 µg/m³ may cause permanent alterations"
      },
      'organ-maturation': {
        low: "Normal organ development expected",
        moderate: "Slight impact on organ maturation - 13-25 µg/m³ requires monitoring",
        high: "Potential developmental delays - 26-45 µg/m³ can affect lung and kidney formation",
        extreme: "Severe risk to organ function - levels 46-150 µg/m³ can cause permanent damage",
        critical: "Catastrophic risk to organ systems - levels above 150 µg/m³ can cause irreversible damage"
      },
      'gestational-diabetes': {
        low: "Normal glucose metabolism expected",
        moderate: "Slightly increased GDM risk - 13-25 µg/m³ may affect insulin sensitivity",
        high: "Significant risk of gestational diabetes - 26-40 µg/m³ disrupts glucose regulation",
        extreme: "Critical metabolic disruption - levels 41-150 µg/m³ severely affect metabolism",
        critical: "Severe metabolic crisis risk - levels above 150 µg/m³ can cause acute maternal issues"
      },
      
      // Third Trimester
      'preterm-birth': {
        low: "Normal term pregnancy likely",
        moderate: "Slightly increased preterm birth risk - monitor at 13-20 µg/m³",
        high: "High risk of preterm birth - 21-35 µg/m³ increases risk by up to 30%",
        extreme: "Critical risk of premature birth - levels 36-100 µg/m³ significantly impact gestational length",
        critical: "Emergency risk of very premature birth - levels above 100 µg/m³ require medical attention"
      },
      'fetal-distress': {
        low: "Normal fetal oxygenation expected",
        moderate: "Mild risk of reduced oxygen transfer - 13-25 µg/m³ requires monitoring",
        high: "Significant risk of fetal distress - 26-35 µg/m³ affects placental blood flow",
        extreme: "Critical risk of fetal hypoxia - levels 36-100 µg/m³ severely compromise oxygen supply",
        critical: "Imminent danger to fetal survival - levels above 100 µg/m³ require emergency intervention"
      },
      'placental-dysfunction': {
        low: "Normal placental function expected",
        moderate: "Mild placental stress - 13-20 µg/m³ may reduce efficiency",
        high: "Significant placental insufficiency - 21-35 µg/m³ compromises nutrient delivery",
        extreme: "Critical risk of placental dysfunction - levels 36-100 µg/m³ can cause severe complications",
        critical: "Severe risk of complete placental failure - levels above 100 µg/m³ require emergency care"
      },
      'birth-weight': {
        low: "Normal birth weight expected",
        moderate: "Slight impact on final weight - 13-25 µg/m³ may reduce growth",
        high: "Significant risk of low birth weight - 26-35 µg/m³ restricts nutrient transfer",
        extreme: "Severe growth restriction - levels 36-150 µg/m³ critically impair weight gain",
        critical: "Critical risk of extremely low birth weight - levels above 150 µg/m³ can be life-threatening"
      }
    };
  
    // Default generic responses if specific area description not found
    const defaultDescriptions = {
      low: "Normal development expected at this air quality level",
      moderate: "Moderate risk at 13-25 µg/m³ - stay indoors and use air purifiers when possible",
      high: "High risk at 26-35 µg/m³ - avoid outdoor exposure when possible",
      extreme: "Extreme risk 36-100 µg/m³ - stay in filtered air and seek medical advice",
      critical: "Critical danger above 100 µg/m³ - emergency measures needed to minimize exposure"
    };
    
    return descriptions[areaId]?.[riskLevel] || defaultDescriptions[riskLevel];
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
    
    // When trimester changes, make sure the area details are closed and video is shown
    setActiveArea(null);
    setShowDetails(false);
    
    // Force the video to reload by setting a random key or changing the videoAvailable state
    // This ensures the new trimester video loads immediately
    setVideoAvailable(false);
    setTimeout(() => {
      setVideoAvailable(true);
    }, 50);
    
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
      return "The first trimester is a critical period for embryonic development, as the primary organs and structures are forming. Neural development, lung formation, early pregnancy stability, and placental development are particularly vulnerable to PM2.5 exposure.";
    } else if (activeTrimester === 'second') {
      return "During the second trimester, the fetus continues to grow rapidly and undergoes critical development in various organ systems. PM2.5 exposure in this period can affect fetal growth, immune system development, and increase the risk of complications like gestational diabetes.";
    } else {
      return "The third trimester is crucial for the final development and maturation of the fetus. PM2.5 exposure can lead to serious complications including preterm birth, fetal distress, placental dysfunction, and low birth weight.";
    }
  };

  // Handle mouse over for legend items
  const handleLegendHover = (threshold) => {
    setActiveLegend(threshold);
  };

  // Handle mouse leave for legend items
  const handleLegendLeave = () => {
    setActiveLegend(null);
  };

  // Toggle info bubble visibility
  const toggleInfoBubble = () => {
    setShowInfoBubble(!showInfoBubble);
  };

  return (
    <div className={`air-impact-page ${showContent ? 'content-visible' : ''}`}>
      {/* Background Effects */}
      <div className="air-aurora-container">
        <div className="air-aurora"></div>
        <div className="air-aurora"></div>
      </div>
      
      <div className="pollution-content-container">
        <div className={`air-header ${animateIn ? 'animate-in' : ''}`}>
          <h1 className="air-title">Impact of Air Pollution on Pregnancy</h1>
          <div className="air-title-underline"></div>
          <p className="page-subtitle">Explore how PM<sub>2.5</sub> affects different stages of fetal development</p>
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
            <input 
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="Search for Australian suburb or city..."
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
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="location-suggestions">
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
          
          <div className="current-pm-display">
            {isLoadingPollution ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <>
                <div className="pm-value-container">
                  PM<sub>2.5</sub>: <span className="pm-value" style={{color: riskInfo.color}}>{pmValue} µg/m³</span>
                </div>
                {isHighPollution && (
                  <span className="pollution-alert-indicator">
                    <AlertTriangle size={12} className="alert-icon" />
                    HIGH POLLUTION ALERT
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Interactive Main Content */}
        <div className={`pollution-main-content ${animateIn ? 'animate-in' : ''}`} style={{ animationDelay: '0.4s' }}>
          {/* Top Row with Pollution Visualization and Sensitivity areas */}
          <div className="pollution-top-row">
            {/* 1. PM2.5 Visualization Section */}
            <div className="pm-control-section">
              <h2 className="section-title">PM<sub>2.5</sub> Impact Visualizer</h2>
              
              <div className="pollution-visualization-area">
                {/* Improved Cloud Visualization */}
                <div className="cloud-container">
                  <div 
                    className={`cloud-wrapper ${getCloudAnimationClass(pmValue)}`}
                    style={{
                      '--cloud-color': riskInfo.color
                    }}
                  >
                    <div className="cloud">
                      <div className="cloud-body"></div>
                      <div className="cloud-particles">
                        {Array.from({ length: Math.min(30, Math.max(5, Math.floor(pmValue / 10))) }).map((_, i) => (
                          <div 
                            key={i}
                            className="particle"
                            style={{
                              '--particle-size': `${Math.random() * 3 + 1}px`,
                              '--particle-opacity': Math.random() * 0.7 + 0.3,
                              '--x-pos': `${Math.random() * 100}%`,
                              '--y-pos': `${Math.random() * 100}%`,
                              '--delay': `${Math.random() * 5}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="pm-value-floating">
                      {pmValue} <span className="pm-unit">µg/m³</span>
                    </div>
                  </div>
                </div>
              
                {/* Improved Pollution Slider */}
                <div className="pollution-controls">
                  <div className="pollution-slider-container">
                    <div className="slider-label">Air Quality (PM<sub>2.5</sub> µg/m³)</div>
                    
                    <div 
                      className="pollution-slider" 
                      onMouseDown={handlePollutionBarInteraction}
                      onTouchStart={handlePollutionBarInteraction}
                    >
                      <div className="slider-track"></div>
                      <div 
                        className="slider-fill" 
                        style={{ 
                          width: `${(pmValue / 300) * 100}%`,
                          backgroundColor: riskInfo.color 
                        }}
                      ></div>
                      <div 
                        className="slider-thumb"
                        style={{ 
                          left: `${(pmValue / 300) * 100}%`,
                          backgroundColor: riskInfo.color,
                          boxShadow: `0 0 8px ${riskInfo.color}`
                        }}
                      ></div>
                    </div>
                    
                    {/* Improved legends with interactive hover */}
                    <div className="pollution-legend">
                      <div 
                        className={`legend-item ${activeLegend === 'low' || (!activeLegend && pmValue <= 12) ? 'active' : ''}`}
                        onMouseEnter={() => handleLegendHover('low')}
                        onMouseLeave={handleLegendLeave}
                      >
                        <div className="legend-color" style={{ backgroundColor: "#22c55e" }}></div>
                        <div className="legend-text">
                          <span className="legend-title">Good</span>
                          <span className="legend-range">0-12</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`legend-item ${activeLegend === 'moderate' || (!activeLegend && pmValue > 12 && pmValue <= 25) ? 'active' : ''}`}
                        onMouseEnter={() => handleLegendHover('moderate')}
                        onMouseLeave={handleLegendLeave}
                      >
                        <div className="legend-color" style={{ backgroundColor: "#f97316" }}></div>
                        <div className="legend-text">
                          <span className="legend-title">Moderate</span>
                          <span className="legend-range">13-25</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`legend-item ${activeLegend === 'high' || (!activeLegend && pmValue > 25 && pmValue <= 35) ? 'active' : ''}`}
                        onMouseEnter={() => handleLegendHover('high')}
                        onMouseLeave={handleLegendLeave}
                      >
                        <div className="legend-color" style={{ backgroundColor: "#ef4444" }}></div>
                        <div className="legend-text">
                          <span className="legend-title">High</span>
                          <span className="legend-range">26-35</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`legend-item ${activeLegend === 'extreme' || (!activeLegend && pmValue > 35 && pmValue <= 100) ? 'active' : ''}`}
                        onMouseEnter={() => handleLegendHover('extreme')}
                        onMouseLeave={handleLegendLeave}
                      >
                        <div className="legend-color" style={{ backgroundColor: "#7f1d1d" }}></div>
                        <div className="legend-text">
                          <span className="legend-title">Extreme</span>
                          <span className="legend-range">36-100</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`legend-item ${activeLegend === 'critical' || (!activeLegend && pmValue > 100) ? 'active' : ''}`}
                        onMouseEnter={() => handleLegendHover('critical')}
                        onMouseLeave={handleLegendLeave}
                      >
                        <div className="legend-color" style={{ backgroundColor: "#450a0a" }}></div>
                        <div className="legend-text">
                          <span className="legend-title">Critical</span>
                          <span className="legend-range">101+</span>
                          <span className="critical-text-indicator">(High Risk)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
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
            </div>
            
            {/* 2. Air Pollution Sensitivity Areas */}
            <div className="pollution-sensitivity-section">
              <h2 className="section-title">PM<sub>2.5</sub> Sensitivity Areas</h2>
              
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
                  const areaRiskInfo = getAreaRiskLevel(area.id, pmValue);
                  
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
                                width: `${Math.min(100, (pmValue / 300) * 100)}%`,
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
            <div className="area-details-section" ref={areaDetailsRef}>
              <div className="area-details-header">
                <h2>{areaDetails[activeArea].title}</h2>
                <button className="close-details" onClick={() => { setActiveArea(null); setShowDetails(false); }}>
                  <X size={18} />
                </button>
              </div>
              
              <div className="area-details-content">
                <div className="area-info-container">
                  <div 
                    className={`area-info-section ${expandedDetails['pollutionImpact'] ? 'expanded' : ''}`}
                    onClick={() => toggleExpandedDetails('pollutionImpact')}
                  >
                    <div className="expandable-header">
                      <h3>PM<sub>2.5</sub> Impact</h3>
                      <ChevronDown 
                        size={20} 
                        className={`expand-icon ${expandedDetails['pollutionImpact'] ? 'rotated' : ''}`} 
                      />
                    </div>
                    
                    <div className="expandable-content">
                      <p>{areaDetails[activeArea].pollutionImpact}</p>
                      
                      <div 
                        className={`pollution-warning ${getAreaRiskLevel(activeArea, pmValue).level.toLowerCase()}`}
                        style={{
                          borderColor: getAreaRiskLevel(activeArea, pmValue).color,
                          backgroundColor: `${getAreaRiskLevel(activeArea, pmValue).color}15`,
                          color: getAreaRiskLevel(activeArea, pmValue).level === "Critical" ? "#ffffff" : "inherit"
                        }}
                      >
                        <div className="warning-header">
                          <AlertTriangle size={18} className="warning-icon" />
                          <span className="warning-title">Current Risk Assessment at {pmValue} µg/m³:</span>
                        </div>
                        <p>{getAreaRiskDescription(activeArea, pmValue)}</p>
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
            <div className="development-overview-section" ref={developmentSectionRef}>
              <div className="development-content">
                <div className={`development-video-container ${!videoAvailable ? 'loading' : ''}`}>
                  {videoAvailable && (
                    <video 
                      className="development-video" 
                      controls
                      autoPlay
                      loop
                      muted
                      key={`${activeTrimester}-video-${Date.now()}`} // Adding a unique key to force re-render
                      poster={`../assets/${activeTrimester}-trimester-poster.jpg`}
                      onLoadStart={() => console.log(`Loading ${activeTrimester} trimester video`)}
                    >
                      <source src={`../assets/${activeTrimester}-trimester-overview.mp4`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                
                <div className="development-info">
                  <h2>{getDevelopmentTitle()}</h2>
                  <p>{getDevelopmentDescription()}</p>
                  
                  <div className="current-pm-impact">
                    <h3>Current PM<sub>2.5</sub> Risk Level: <span style={{ color: riskInfo.color }}>{riskInfo.level}</span></h3>
                    <p className="impact-summary">
                      At {pmValue} µg/m³, developing fetuses in the {getDevelopmentTitle().toLowerCase()} face {riskInfo.level.toLowerCase()} 
                      risks to their development. Please review the specific sensitivity areas above for detailed impact information.
                    </p>
                  </div>
                  
                  {/* Add sensitivity reference to link back to sensitivity areas */}
                  <div className="sensitivity-reference">
                    <Info size={20} className="reference-icon" />
                    <p>For more specific health impacts, click on any of the sensitivity areas above to see detailed information.</p>
                  </div>
                </div>
              </div>
              
              <div className="interactive-guidance">
                <button className="heatwave-button" onClick={navigateToHeatwave}>
                  <ThermometerSun size={20} className="heatwave-icon" />
                  Learn About Heatwave Effects
                  <ChevronRight size={16} className="arrow-icon" />
                </button>
              </div>
            </div>
          )}
          
          {/* Remove duplicate Heatwave Button Section */}
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
              <p>Drag the slider to see how different PM<sub>2.5</sub> levels affect fetal development at each stage of pregnancy.</p>
              <p>Click on a trimester tab to see developmental information and video for that stage.</p>
            </div>
            <button className="close-info-bubble" onClick={toggleInfoBubble}>×</button>
          </div>
        )}
        
      </div>

      {/* Background Orbs */}
      <div className="air-orb orb1"></div>
      <div className="air-orb orb2"></div>
    </div>
  );
};