import React, { useState } from "react";
import axios from "axios";
import "../styles/AirPollutionImpact.css";

const API_KEY = "7b7861c260a1275a0e35bedcd3c8ebd9";

export default function AirQualitySearch({ setLocation, setPm }) {
  const [input, setInput] = useState("");

  const fetchAQIByCity = async (city) => {
    try {
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const { lat, lon, name, state, country } = geoRes.data[0];
      setLocation(`${name}, ${state || country}`);

      const aqiRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const pm25 = aqiRes.data.list[0].components.pm2_5;
      setPm(Math.round(pm25));
    } catch (err) {
      alert("Could not find AQI for this location.");
    }
  };

  const fetchAQIByCoords = async (lat, lon) => {
    try {
      const locRes = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const name =
        locRes.data.address.city ||
        locRes.data.address.town ||
        locRes.data.address.state ||
        "Your Area";
      setLocation(name);

      const aqiRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const pm25 = aqiRes.data.list[0].components.pm2_5;
      setPm(Math.round(pm25));
    } catch (err) {
      alert("Failed to get air quality for your location.");
    }
  };

  const handleSearch = () => {
    if (input.trim()) {
      fetchAQIByCity(input.trim());
    }
  };

  const handleUseMyLocation = () => {
    const proceed = window.confirm(
      "We will use your current location to fetch air quality data. Do you want to continue?"
    );
    if (!proceed) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAQIByCoords(latitude, longitude);
      },
      () => alert("Location access denied.")
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="location-search-bar">
      <span className="location-display">📍 Location:</span>
      <input
        type="text"
        placeholder="Enter city (e.g. Melbourne)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        className="search-input"
      />
      <button onClick={handleSearch} className="use-location-btn">
        Search
      </button>
      <button
        onClick={handleUseMyLocation}
        className="use-location-btn use-my-loc"
      >
        Use My Location
      </button>
    </div>
  );
}
