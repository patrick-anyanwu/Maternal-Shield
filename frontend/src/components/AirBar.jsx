import React from "react";
import "../styles/AirPollutionImpact.css"; // For floating animation

export default function AirBar({ pmValue, setPmValue }) {
  // Determine cloud color based on PM2.5 level
  const getCloudColor = (pm) => {
    if (pm <= 12) return "#60a5fa"; // Blue (Good)
    if (pm <= 35) return "#94a3b8"; // Light gray (Moderate)
    if (pm <= 55) return "#64748b"; // Medium gray (Unhealthy for sensitive groups)
    return "#4b5563"; // Dark gray (Unhealthy)
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "320px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Instruction text */}
      <span
        style={{
          color: "#e0e0e0",
          fontSize: "16px",
          marginBottom: "12px",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        ☁️ Adjust the slider to simulate pollution level
      </span>

      {/* Pollution level slider with gradient background */}
      <input
        type="range"
        min="0"
        max="150"
        value={pmValue}
        onChange={(e) => setPmValue(Number(e.target.value))}
        style={{
          width: "100%",
          marginBottom: "24px",
          height: "8px",
          borderRadius: "5px",
          background: `linear-gradient(
            to right,
            #60a5fa 0%,
            #94a3b8 30%,
            #64748b 60%,
            #4b5563 100%
          )`,
          appearance: "none",
          outline: "none",
        }}
      />

      {/* Cloud graphic that scales with PM2.5 and floats side to side */}
      <div
        className="floating-cloud"
        style={{
          transform: `scale(${1 + pmValue / 300})`, // Scale based on PM2.5
        }}
      >
        <svg width="220" height="220" viewBox="0 0 160 160">
          {/* Cloud shape */}
          <path
            d="M60 80
               a 20 20 0 0 1 40 0
               h 10
               a 20 20 0 0 1 0 40
               h -70
               a 15 15 0 0 1 0 -30
               h 5
               a 20 20 0 0 1 15 -10
               z"
            fill={getCloudColor(pmValue)}
            stroke="#000"
            strokeWidth="2"
          />

          {/* PM2.5 value inside the cloud */}
          <text
            x="80"
            y="100"
            fontSize="28"
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
          >
            {pmValue}
          </text>
        </svg>
      </div>
    </div>
  );
}
