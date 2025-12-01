# pregnancy-app

#AirQualitySearch.jsx:
This code defines a React component called AirQualitySearch that allows users to search for air quality data, specifically PM2.5 measurements, for different locations.
The main purpose of this component is to:

Allow users to input a city name to check the air quality (PM2.5 levels) in that location
Provide an option for users to use their current geolocation to get air quality data for their present location
Display the retrieved location and pass the PM2.5 value to the parent component

Key features include:

A text input field where users can type a city name
A "Search" button to fetch air quality data for the entered city
A "Use My Location" button that uses the device's geolocation to fetch local air quality data
Error handling for cases where the location can't be found or air quality data isn't available

The component uses two external APIs:

OpenWeatherMap API for geocoding (converting city names to coordinates) and air pollution data
OpenStreetMap's Nominatim service for reverse geocoding (converting coordinates to location names)

When data is successfully retrieved, the component calls two setter functions (setLocation and setPm) that were likely passed down as props from a parent component, updating the application state with the new location name and PM2.5 level.
This component is likely part of a larger air quality monitoring application, possibly the "Maternal Shield" app you shared earlier, which helps pregnant women track environmental conditions that might affect their health.RetryClaude can make mistakes. Please double-check responses.

FeatureCard.jsx:
This FeatureCard React component creates interactive, flip-animated cards to showcase application features. It displays a title and icon on the front face, with description and "Explore" button on the back when hovered. The card includes visual enhancements like gradient backgrounds, aurora effects, shine animations, and optional photo backgrounds. It handles mouse hover and keyboard interactions with customizable timing for the flip animation. The component serves as a navigation element, likely on the app's homepage, directing users to different features of the Maternal Shield application.

FeatureSection.jsx:
The FeatureSection component creates a responsive, carousel-style navigation hub for the Maternal Shield app. It displays FeatureCards for seven key app features (Knowledge Garden, Personalization, Symptom Tracker, etc.) with left/right navigation arrows that adapt to screen size. The component includes animated star backgrounds for visual appeal and handles routing to different app sections when cards are clicked. For the Environment Impact feature, it shows a popup with Heat or Air Pollution options. This serves as the app's main visual menu, providing an attractive gateway to the app's core functionality.

Footer.jsx:
The Footer component is a simple React element that renders a footer section at the bottom of the Maternal Shield app. It displays a brief, supportive message: "Created with love for mothers navigating environmental challenges." The component imports a dedicated CSS file for styling and provides a consistent closing element for all pages throughout the application.

HeroSection.jsx:
The HeroSection component creates an immersive, animated landing page for the Maternal Shield app. It features multiple visual elements including aurora effects, animated stars, particles, and a detailed tree illustration with a clickable fetus image that plays a heartbeat sound when clicked.
Key elements include:

Interactive heartbeat audio with visual ECG indicator
Atmospheric animations (aurora, stars, wind effects)
A tree with animated leaves and branches
Call-to-action buttons for navigation
Informational text about the app's purpose
A scroll indicator to guide users to the features section

The component focuses on creating an emotional connection with pregnant users through its imagery and interactivity, while introducing the app's core purpose of helping mothers navigate environmental risks during pregnancy. It includes subtle animations and transitions to enhance the user experience and encourage exploration of the app's features.

Navbar.jsx:
The Navbar component provides the main navigation system for the Maternal Shield app. It features a responsive design that displays a full navigation bar on larger screens and collapses to a hamburger menu on mobile devices.
Key functionality includes:

Scrolling effect that changes the navbar's appearance when the user scrolls down
Navigation links to key app sections (Home, Heatwave, Air Pollution, Knowledge Garden)
Brand logo and name with styled "Maternal Shield" text
Mobile-friendly navigation with a toggle menu and overlay background
Active link highlighting to indicate the current page
Smooth scrolling to page sections where applicable
Accessibility features including ARIA attributes

The component uses React Router for navigation between different pages and includes intelligent routing logic that can either scroll to sections on the current page or navigate to new pages as needed. The navbar maintains consistent branding across the application while providing intuitive access to the app's main features.RetryClaude can make mistakes. Please double-check responses. 3.7 Sonnet

PasswordGate.jsx:
The PasswordGate component creates a simple authentication barrier for the Maternal Shield app, requiring users to enter a password before accessing the application content.
Key features include:

Password validation against a predefined value ("POLOTO12" by default)
Session persistence using sessionStorage to prevent requiring re-authentication during the same browser session
Loading state to prevent UI flicker during authentication check
Styled login screen with form input and submit button
Error handling for incorrect password attempts

The component implements a wrapper pattern, conditionally rendering either the password gate UI or its child components based on authentication status. Once authenticated, users can access the full application until they close their browser session. This provides basic access control for development, demo, or restricted content purposes.

PregnancyHealthDataChart:
The PregnancyHealthDataChart component is an interactive modal displaying visualizations of Australian pregnancy health data (2014-2022). It features four tabbed views (national trends, state data, rankings, and percentage changes) with responsive charts built using Recharts. The component loads and parses CSV data for gestational diabetes and hypertension, allowing users to explore patterns by region. Key insights highlight the dramatic nationwide increase in gestational diabetes (nearly doubling) compared to stable hypertension rates, with regional variations potentially linked to environmental factors like bushfires and air quality. Each visualization includes analytical commentary to help users understand the health implications and environmental connections.

ScrollToTop.jsx:
The ScrollToTop component automatically scrolls the page to the top whenever the route changes. It uses React Router's useLocation hook to detect path changes and triggers window.scrollTo(0, 0) via useEffect. The component doesn't render anything visible, functioning purely for improved navigation experience by ensuring users start at the top of each new page.

AcrosticPuzzlePage.jsx:
The MaternalShieldWordSearch component is an educational word search game for pregnant women focused on environmental health risks. It features three themed levels (Pregnancy & Climate, Protection Strategies, Health Impacts) with interactive puzzles where users search for answers to pregnancy-health questions. The game includes a responsive grid interface with draggable word selection, progressive hint system, level navigation, and an interactive tour guide for new users. Players receive visual feedback when finding correct words, with animations and themed styling based on the current level. The component tracks progress, offers hints, and displays completion messages, teaching important information about heatwaves and air pollution risks during pregnancy through gamified learning.

AirPollutionImpact.jsx:
The AirPollutionImpact component creates an interactive educational interface about PM2.5 air pollution effects on pregnancy. It features a dynamic visualization where users can adjust pollution levels (0-300 µg/m³) via a slider to see impacts across three trimesters. The component includes location-based real-time air quality data, interactive risk visualizations with color-coded indicators, and trimester-specific sensitivity areas showing health risks to different developmental processes. Users can click sensitivity areas (like neurological development, placental function, or preterm birth risks) to view detailed scientific information, recommendations, and risk assessments based on current PM2.5 levels. The interface includes educational videos for each trimester and allows users to toggle between trimesters to compare different developmental vulnerabilities. The responsive design includes smooth animations, search functionality for Australian locations, and geolocation capabilities.

DayInHerShoes.jsx:
The DayInHerShoes component presents an interactive storytelling feature where users can experience environmental challenges faced by pregnant women. It displays a searchable list of scenario-based stories (currently "Sarah's Heatwave Day" and "Mei's Bushfire Challenge"), each providing character details, location, gestational age, and a brief description. Users can filter stories by keywords and click "Start Story" to navigate to the full interactive narrative. The component uses React Router for navigation and maintains a minimalist design focused on story selection and engagement.

HeatImpact.jsx:
The HeatImpact component creates an interactive educational interface about heat effects on pregnancy. It features a responsive thermometer visualization allowing users to drag or click to adjust temperature (0-50°C) and see impacts across three trimesters. The component includes location-based real-time weather data and color-coded risk indicators for different developmental processes. Users can click sensitivity areas (like neural tube development, placental blood flow, or uterine activity) to view detailed scientific information, recommendations, and risk assessments based on current temperature levels. The interface includes educational videos for each trimester, temperature threshold visualizations, and a pop-up chart showing national trends in gestational diabetes and hypertension. The design includes smooth animations, search functionality for Australian locations, and responsive UI elements that adapt to user interactions and alert users to dangerous heat levels.

HeatwaveEducation.jsx:
The HeatwaveEducation component creates an interactive simulation demonstrating heatwave patterns across Australian cities. It features a responsive thermometer visualization that changes color based on temperature severity (20-50°C) and animations that simulate day-to-day temperature fluctuations. Users can select different states/territories to view location-specific climate data including typical summer temperatures, record highs, and heatwave thresholds. The component includes an autoplay function that cycles through simulated daily temperatures, highlighting when three consecutive hot days constitute a heatwave. Visual effects include animated stars and color-coded heat intensity indicators that change during the simulation. The interface displays city-specific climate facts and includes a call-to-action button linking to detailed information about heatwave effects on pregnancy.

HomePage.jsx:
The HomePage component serves as the main landing page for the Maternal Shield application, integrating key UI components into a cohesive layout. It manages animation triggers based on scroll position, with features appearing when users scroll halfway down the screen. The component includes a navigation bar, an immersive hero section, and a feature card carousel that users can click to navigate to different sections of the app. The page handles navigation through React Router and uses refs to enable smooth scrolling between sections. The component efficiently coordinates the interactions between nested components through props, creating a seamless user experience while preserving each component's independent functionality.

KnowledgeGarden.jsx:
The KnowledgeLibrary component creates an immersive virtual library experience focused on pregnancy education. It features an interactive bookshelf with color-coded books organized by category (pregnancy, environment, terminology) that users can "open" to read. The component includes realistic visual effects like a clickable floor lamp that illuminates the reading area, dust particles, varied book heights, and decorative elements. Users can search the collection, filter by category, mark favorites (which persist via localStorage), and see highlighted text matches. The interface incorporates thoughtful animations including lamp flickering for first-time visitors and visual transitions when opening books. Each book contains educational content about pregnancy-related topics, with metadata displayed on the left page and content on the right when opened. The component also includes links to knowledge tests and adapts its display based on search results and user interactions.

PersonalizationHub.jsx:
The PersonalizationHub component creates a guided, multi-step form to tailor content for pregnant women based on age range, trimester, and environmental concerns. It features an immersive UI with animated stars and aurora effects across three sequential steps. After collecting user preferences, the component fetches personalized articles from an API and displays them in either grid or list view with pagination controls. Users can search, filter, and sort the articles by relevance score. Each article card displays title, summary, tags, source, and a link to read more. The interface includes smooth transitions between steps, progress indicators, responsive back buttons, and toggleable view modes. If no articles match a user's search, a friendly "no results" message appears. The design emphasizes visual engagement with animated elements, while making information accessible and providing clear navigation to related tools like the Symptom Tracker.

PM25Education:
The PM25Education component creates an interactive educational interface about PM2.5 air pollution particles. It features a visually engaging design with animated stars in the background and a central blurred box containing the main content. The component's focal point is a size comparison visualization that helps users understand how tiny PM2.5 particles are compared to other microscopic objects. Users can navigate through four different comparisons (human hair, red blood cell, PM2.5 particle, virus) using arrow buttons or indicator dots, while an automatic slideshow cycles through the comparisons every 5 seconds. Each comparison displays a color-coded circle sized proportionally using a logarithmic scale to represent relative sizes, along with descriptive text explaining the size relationship. The component concludes with a call-to-action button linking to more in-depth information about PM2.5's effects on pregnancy

StoryExperience.jsx:
The StoryExperience component creates an interactive narrative experience for pregnancy-related scenarios. It uses React Router's useParams to identify which story to display based on the URL parameter. The component presents a tabbed interface showing a pregnant woman's avatar with changing emotional expressions (neutral, happy, worried) based on user choices. Each story consists of multiple scenes with questions and options, allowing users to navigate through different scenarios related to environmental challenges during pregnancy. When users select an option, the avatar's mood changes to provide immediate visual feedback on their choice. Navigation tabs allow users to track their progress through the story, while "Next" buttons facilitate moving to subsequent scenes. This component integrates several subcomponents (StoryTabNavigation, QuestionScene, PregnantAvatar) to create a cohesive, educational interactive storytelling experience.

StoryProgress.jsx:
The StoryProgress component creates an interactive narrative experience where users make choices for pregnant characters facing environmental challenges. It features a tabbed progression through a day (Intro, Morning, Transport, Nutrition, Afternoon, Summary), fetching scenario data from an API based on the story ID in the URL. Users navigate through the character's daily decisions via navigation arrows, with each choice affecting the character's emotional state (displayed through an avatar) and contributing to an overall score. The component includes visual feedback through a pregnant avatar that changes expression based on choices, progress indicators showing completed sections, and celebratory confetti animation upon reaching the summary. The summary screen provides educational feedback, displays the final score, and offers options to replay or try different stories. The interface combines storytelling with educational content about healthy choices during pregnancy, using visual cues and immediate feedback to reinforce learning.

SymptomCharts.jsx:
The SymptomCharts component creates interactive data visualizations for the Maternal Shield app's Symptom Tracker. It processes symptom history data to generate several chart types that help pregnant users identify correlations between their symptoms and environmental factors. The component offers three viewing modes: an overview showing symptom severity trends over time with a radar chart for pattern analysis; a temperature impact view displaying how different temperature ranges affect symptom severity; and a PM2.5 impact view showing correlations between air quality levels and symptoms. Each chart is responsive and includes interactive features like tooltips, toggleable symptom filters, and consistent color-coding across visualizations. The component calculates environmental correlations by categorizing days into low/medium/high ranges for temperature and air quality, then computing average symptom severities for each category. This helps users identify potential environmental triggers for their pregnancy symptoms through visual data analysis.

SymptomTracker.jsx:
The SymptomTracker component creates a comprehensive health monitoring tool for pregnant women to track symptoms alongside environmental factors. It features a multi-step interface starting with location setup to gather environmental data, followed by a main dashboard with four key tabs: symptom logging, history viewing, data visualization, and report generation. The symptom logger uses a step-by-step approach for rating six pregnancy symptoms (headache, fatigue, swelling, breathing issues, nausea, dizziness) on a 0-5 scale with optional notes. The component fetches real-time weather and air quality data based on location, stores entries in localStorage, and analyzes patterns to generate insights about correlations between symptoms and environmental conditions. Users can view their history in a calendar format, generate visualizations showing symptom patterns over time and their relationship to temperature and PM2.5 levels, and download comprehensive PDF reports for healthcare providers. The interface includes responsive notifications, privacy controls, and data management features



Train_relevance_model.py:
The train_relevance_model.py trains a lightweight machine learning model that calculates a contextual relevance score for health advice articles (InfoCards) in the Maternal Shield app. It uses a small, structured dataset containing user features such as age group, trimester, heat sensitivity, pollution sensitivity, and environmental concern. The notebook builds a preprocessing pipeline that applies one-hot encoding to categorical features and passes boolean values directly. A RandomForestRegressor is then trained to predict relevance scores ranging from 0 to 100. After training, the model is serialized using joblib and saved as relevance_model.pkl for integration with the backend API. This allows the application to rank and filter InfoCards dynamically, ensuring personalized and timely recommendations for pregnant users based on their current context.


