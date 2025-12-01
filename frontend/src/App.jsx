import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DayInHerShoes from "./pages/DayInHerShoes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; 
import "./App.css";

import StoryProgress from "./pages/StoryProgress";
import HeatImpact from "./pages/HeatImpact";
import AirPollutionImpact from "./pages/AirPollutionImpact";
import KnowledgeGarden from "./pages/KnowledgeGarden";

import PM25Education from './pages/PM25Education';
import HeatwaveEducation from './pages/HeatwaveEducation';
import PersonalizationHub from './pages/PersonalizationHub'; 
import SymptomTracker from './pages/SymptomTracker'; 
import AcrosticPuzzlePage from './pages/AcrosticPuzzlePage';

// Custom wrapper to handle authentication persistence
const AuthenticationPersistence = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Re-check authentication on route changes
    const isAuthenticated = sessionStorage.getItem("access_granted") === "true";
    if (!isAuthenticated) {
      // If session storage is cleared but we're here, handle gracefully
      // This is a fallback and shouldn't usually happen
      sessionStorage.setItem("access_granted", "true");
    }
  }, [location.pathname]);
  
  return null;
};

function App() {
  return (
    <Router>
      <div className="page-container">
        <ScrollToTop />
        <AuthenticationPersistence />
        <Navbar />
        
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/day-in-her-shoes" element={<DayInHerShoes />} />
            <Route
              path="/a-day-in-her-shoes/:storyId"
              element={<StoryProgress />}
            />
            <Route path="/heat-impact" element={<HeatImpact />} />
            <Route path="/heatwave" element={<HeatwaveEducation />} />
            <Route path="/air-pollution-impact" element={<AirPollutionImpact />} />
            <Route path="/knowledge-garden" element={<KnowledgeGarden />} /> 
            <Route path="/pm25" element={<PM25Education />} />
            <Route path="/personalization-hub" element={<PersonalizationHub />} />
            <Route path="/symptom-tracker" element={<SymptomTracker />} /> {/* Add Symptom Tracker route */}
            <Route path="/acrostic-puzzles" element={<AcrosticPuzzlePage />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;