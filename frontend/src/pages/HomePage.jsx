// src/pages/HomePage.jsx
import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const featureRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkInitialScroll = () => {
      const scrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      if (scrollY > screenHeight / 2) {
        setStartAnimation(true);
      }
    };

    checkInitialScroll();
    window.addEventListener("scroll", checkInitialScroll);
    return () => window.removeEventListener("scroll", checkInitialScroll);
  }, []);

  // const handleCardClick = (feature) => {
  //   if (feature === "day-in-her-shoes") {
  //     navigate("/day-in-her-shoes");
  //   }
  // };
  const handleCardClick = (featureRoute) => {
    navigate(`/${featureRoute}`);
  };

  return (
    <div className="homepage">
      <Navbar
        scrollToFeatures={() =>
          featureRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <HeroSection
        scrollToRef={featureRef}
        onTriggerAnimation={setStartAnimation}
      />
      <FeatureSection
        innerRef={featureRef}
        startAnimation={startAnimation}
        onCardClick={handleCardClick}
      />
      {/* <Footer /> */}
    </div>
  );
}
