// src/pages/StoryExperience.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { stories } from "../data/stories";
import StoryTabNavigation from "../components/StoryTabNavigation";
import QuestionScene from "../components/QuestionScene";
import PregnantAvatar from "../components/PregnantAvatar";
import "../styles/StoryExperience.css";

export default function StoryExperience() {
  const { storyId } = useParams();
  const story = stories.find(s => s.id === storyId);
  const [currentTab, setCurrentTab] = useState(0);
  const [mood, setMood] = useState("neutral");

  const currentScene = story.tabs[currentTab];

  const handleOptionSelect = (isCorrect) => {
    setMood(isCorrect ? "happy" : "worried");
  };

  const handleNext = () => {
    setMood("neutral");
    setCurrentTab(prev => prev + 1);
  };

  return (
    <div className="story-experience">
      <h2 className="story-title">{story.name}</h2>
      <StoryTabNavigation
        tabs={story.tabs}
        current={currentTab}
      />
      <div className="scene-content">
        <PregnantAvatar mood={mood} />
        <QuestionScene
          scene={currentScene}
          onOptionSelect={handleOptionSelect}
          onNext={handleNext}
          isLast={currentTab === story.tabs.length - 1}
        />
      </div>
    </div>
  );
}
