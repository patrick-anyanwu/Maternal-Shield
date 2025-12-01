import React, { useState, useEffect } from 'react';
import '../styles/StoryProgress.css';
import { useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import axios from 'axios';

const tabs = ['Intro', 'Morning', 'Transport', 'Nutrition', 'Afternoon', 'Summary'];

export default function StoryProgress() {
  const [activeTab, setActiveTab] = useState('Intro');
  const [selectedOption, setSelectedOption] = useState(null);
  const [emotion, setEmotion] = useState('neutral');
  const [completedTabs, setCompletedTabs] = useState([]);
  const [score, setScore] = useState(0);
  const [storyData, setStoryData] = useState(null);

  const { storyId } = useParams(); // e.g., 'sarah-heatwave' or 'mei-bushfire'
  const navigate = useNavigate();

  // Map storyId (from URL) to actual character_id in DB
  const characterMap = {
    'sarah-heatwave': 1,
    'mei-bushfire': 2,
  };

  const characterId = characterMap[storyId];

  useEffect(() => {
    if (!characterId) return;

    setStoryData(null);
    setActiveTab('Intro');
    setSelectedOption(null);
    setCompletedTabs([]);
    setScore(0);
    setEmotion('neutral');

    axios
      .get(`https://iteration2.maternalshield.me/api/story-data/?character_id=${characterId}`)
      .then((response) => {
        console.log("Character ID from URL:", characterId);
        console.log("Story Data:", response.data);
        setStoryData(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch story data:', error);
      });
  }, [characterId]);

  const handleBack = () => navigate('/day-in-her-shoes');

  const goToPrevious = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
      setSelectedOption(null);
      setEmotion('neutral');
    }
  };

  const goToNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextTab = tabs[currentIndex + 1];
    if (nextTab && (activeTab === 'Intro' || completedTabs.includes(activeTab))) {
      setActiveTab(nextTab);
      setSelectedOption(null);
      setEmotion('neutral');
      if (nextTab === 'Summary') confetti();
    }
  };

  const renderScene = () => {
    if (!storyData) return <p>Loading story...</p>;

    if (activeTab === 'Intro') {
      return (
        <div className="scene-box">
          <h3>Welcome to Her Day</h3>
          <div className="character-info">
            <strong>Character:</strong> {storyData.character.name}, {storyData.character.age}<br />
            {storyData.character.location}
          </div>
          <p>
            It’s a new day in her journey of pregnancy — let’s explore her choices and how they shape her wellbeing.
          </p>
          <button className="start-story-btn" onClick={() => setActiveTab('Morning')}>
            ▶ Start Story
          </button>
        </div>
      );
    }

    if (activeTab === 'Summary') {
      let message = '';
      let babyMood = '';
      if (score >= 3) {
        message = 'Your baby is glowing and happy! 💖 You made wonderful choices!';
        babyMood = 'happy';
      } else if (score === 2) {
        message = 'Some choices were helpful, but there’s room to improve!';
        babyMood = 'neutral';
      } else {
        message = 'Uh-oh! A few risky choices made your baby worried. Let’s try again.';
        babyMood = 'worried';
      }

      return (
        <div className="scene-box">
          <h3>Great Job!</h3>
          <p>{message}</p>
          <ul className="summary-list">
            <li>Stay indoors during poor air quality or extreme weather days.</li>
            <li>Hydration and light nutrition help reduce stress.</li>
            <li>Light activity is great — but be mindful of heat and cold.</li>
            <li>Choose transport options that prioritize safety and comfort.</li>
          </ul>
          <p className="summary-note">You scored {score} out of 4.</p>
          <button className="try-again-btn" onClick={() => window.location.reload()}>
            ↻ Replay Story
          </button>
          <button className="start-story-btn" onClick={handleBack}>
            ➞ Try Another Story
          </button>
          <div className={`pregnant-avatar ${babyMood}`} />
        </div>
      );
    }

    const scene = storyData.scenes[activeTab];
    if (!scene) return null;

    return (
      <div className="scene-box">
        <h3>{scene.question}</h3>
        <div className="options">
          {scene.options.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedOption(option);
                setEmotion(option.emotion);
                setCompletedTabs((prev) => [...new Set([...prev, activeTab])]);
                if (option.correct) setScore((prev) => prev + 1);
              }}
              className={selectedOption?.text === option.text ? 'selected' : ''}
            >
              {option.text}
            </button>
          ))}
        </div>
        {selectedOption && <p className="feedback">{selectedOption.feedback}</p>}

        <button className="nav-left styled-arrow" onClick={goToPrevious} disabled={tabs.indexOf(activeTab) <= 0}>
          &#8249;
        </button>
        <button
          className="nav-right styled-arrow"
          onClick={goToNext}
          disabled={tabs.indexOf(activeTab) >= tabs.length - 1 || !completedTabs.includes(activeTab)}
        >
          &#8250;
        </button>
        <div className={`pregnant-avatar ${emotion}`} />
      </div>
    );
  };

  return (
    <div className="story-progress">
      <div className="story-box-container">
        <div className="story-box">
          <button className="back-btn" onClick={handleBack}>
            ← Back to Stories
          </button>
          <h2 className="progress-title">A Day in Her Shoes</h2>

          <div className="tab-menu">
            {tabs.map((tab, index) => (
              <div key={tab} className="story-step">
                <div
                  className={`circle ${tab === activeTab ? 'active' : ''} ${completedTabs.includes(tab) ? 'completed' : ''}`}
                  onClick={() => {
                    if (tab === 'Intro' || completedTabs.includes(tabs[index - 1])) {
                      setActiveTab(tab);
                      setSelectedOption(null);
                      setEmotion('neutral');
                    }
                  }}
                >
                  {completedTabs.includes(tab) && tab !== 'Intro' ? '✓' : index + 1}
                </div>
                <div className="step-label">{tab}</div>
              </div>
            ))}
          </div>

          <div className="content-area">{renderScene()}</div>
        </div>
      </div>
    </div>
  );
}
