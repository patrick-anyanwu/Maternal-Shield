import React, { useState, useEffect } from "react";

export default function PasswordGate({ children }) {
  const [entered, setEntered] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Get password from environment variable or use a config object
  // You can edit this directly when needed
  const config = {
    password: "POLOTO12" 
  };
  
  const CORRECT_PASSWORD = process.env.REACT_APP_PASSWORD || config.password;

  useEffect(() => {
    // Check if already authenticated
    const unlocked = sessionStorage.getItem("access_granted");
    if (unlocked === "true") {
      setEntered(true);
    }
    // Set loading to false after checking authentication
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      sessionStorage.setItem("access_granted", "true");
      setEntered(true);
    } else {
      alert("Incorrect password");
    }
  };

  // Show nothing while checking authentication status
  if (loading) return null;
  
  // If authenticated, show children
  if (entered) return children;

  // Otherwise show password gate
  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Enter Access Password</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          autoFocus
        />
        <button type="submit" style={styles.button}>
          Enter
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1e1b4b",
    color: "#fff",
    position: "fixed", // Fix position to prevent layout shifts
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Ensure it's on top of everything
  },
  form: {
    background: "#312e81",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginTop: "15px",
    borderRadius: "5px",
    border: "none",
    width: "200px",
  },
  button: {
    padding: "10px 20px",
    marginTop: "15px",
    background: "#facc15",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};