import "./App.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PasswordGate from "./components/PasswordGate";

// Wrap the app rendering in a component that handles initial loading
function MainApp() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady) {
    return null; // Show nothing while preparing to render
  }
  
  return (
    <React.StrictMode>
      <PasswordGate>
        <App />
      </PasswordGate>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);