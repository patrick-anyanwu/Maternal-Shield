<b>Maternal Shield — ML-Powered Health Support Platform</b>

Maternal Shield is a full-stack health support platform built for learning and experimentation. It brings together a symptom checker, air-quality advisory tool, baby-movement tracking, AI-powered risk assessment, story-based simulations, and automated PDF report generation.

The project combines a FastAPI backend with a React/TypeScript frontend, plus a suite of machine-learning utilities. The focus of the build was on core functionality and ML-enabled health insights rather than UI responsiveness.

---

<b>📦 Technologies</b>

Frontend: React.js, TypeScript, Vite, Zustand, CSS

Backend: FastAPI, Python (Pydantic, Pandas, scikit-learn)

Storage / Data: JSON, Local Storage, SQLite, open-source datasets (air quality, symptom tables, maternal-health heuristics)

Testing: Cypress, pytest

---

<b>🦄 Features</b>

Here’s what you can do with Maternal Shield:

Symptom Checker
Log symptoms, receive risk flags for common maternal-health complications, and get tailored next-step suggestions.

Air Quality Search
Search any Australian city/suburb to view air-quality levels (PM2.5, bushfire smoke risk) and receive pregnancy-safe recommendations.

Kick Counter / Baby Movement Tracking
Track fetal movements with a simple timer-based interface and view summaries.

Story Simulation Mode
Walk through interactive maternal-health scenarios (e.g., spotting early signs of complications) with branching outcomes.

AI-Assisted Risk Insights
Lightweight heuristics and model-based scoring to detect warning patterns in symptom history.

PDF Report Export
Generate a clean PDF summary of logs, risks, and recommendations — suitable for sharing with professionals.

User Session State
All progress is saved automatically so users can return where they left off.

---

<b>🎯 Keyboard Shortcuts</b>

To speed up workflows inside the app:

Ctrl + S — Save session state

Ctrl + P — Export PDF report

Ctrl + F — Focus global search

Esc — Close modals

↑ / ↓ — Navigate options in search components

---


<b>👩🏽‍🍳 The Process</b>

I began by designing the project as a modular learning sandbox: a place to experiment with React, TypeScript, FastAPI, and basic ML utilities.

First, I built the backend API: endpoints for risk scoring, symptom validation, air-quality lookups, and report generation. Then I developed the frontend architecture using React + Zustand, focusing on a clean data flow between logs, state, and API calls.

Next, I implemented each module as an isolated feature:
• Symptom checker → form logic, risk rules, API scoring
• Air quality → search UI, API integration, safe-exposure logic
• Story simulator → step engine, branching outcomes
• Kick counter → timers, event logs, summaries
• PDF export → end-to-end report pipeline

With the features working, I added global state management, improved the UI for clarity, and introduced session persistence so users could continue where they left off.

Finally, I invested time in testing, building end-to-end flows in Cypress and writing unit tests for both the frontend and backend. Throughout the build, I documented each step to ensure I deeply understood what I was building — and found that writing down the “why” behind each feature clarified the entire project.

---


<b>📚 What I Learned</b>

Building Maternal Shield helped me develop stronger full-stack and ML-integration skills.

🧠 State Management & Data Flow
Understanding how global state, local state, persistent storage, and API data interact across modules.

📏 Input Validation & Safety Rules
Building checks for symptoms, environmental exposure, and story steps required careful logical reasoning.

🤖 Lightweight ML Utilities
Building rule-based and model-based scoring pipelines with explainable outputs.

🔍 FastAPI Best Practices
Type-safe schemas, validation, routing structure, and clean error handling.

🎣 React Hooks & Performance
Improved understanding of custom hooks, memoization, and predictable state updates.

📄 Working With Reports
Generating structured PDFs and converting frontend state into a backend-friendly format.

🧪 Quality Assurance
Strengthened skills in test planning, end-to-end coverage, and verifying complex flows.

Each part of the project pushed my understanding of building practical health-oriented tools and designing reliable user experiences.

---


<b>🧪 Tests & QA</b>

Unit tests:
Vitest (frontend) and pytest (backend).

Integration & E2E:
Cypress tests for major flows — symptom logging, air quality search, story simulation, and PDF export.

---


<b>💭 How It Can Be Improved</b>

Add charts for risk trends over time

Implement multi-language support

Add voice input for symptom logging

Introduce more story scenarios

Expand ML scoring models

Improve UI responsiveness

Add secure user authentication

Integrate cloud storage for reports
