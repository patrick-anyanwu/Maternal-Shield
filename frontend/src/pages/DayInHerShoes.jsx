// src/pages/DayInHerShoes.jsx
import React, { useState } from "react";
import "../styles/DayInHerShoes.css";
import { useNavigate } from "react-router-dom";

const stories = [
  {
    id: "sarah-heatwave", // used in the URL
    characterId: 1,        // actual DB character ID
    title: "Sarah’s Heatwave Day",
    character: "Sarah",
    age: "28 weeks",
    location: "Western Sydney",
    description:
      "It’s a hot summer morning in late January, in a bushfire-prone suburb of Sydney. The forecast says 36°C today with a smoke warning...",
  },
  {
    id: "mei-bushfire",
    characterId: 2,
    title: "Mei’s Bushfire Challenge",
    character: "Mei",
    age: "32 weeks",
    location: "Canberra Suburbs",
    description:
      "It’s late spring, and you’re in your third trimester. A nearby bushfire has worsened the air quality and authorities have issued alerts...",
  },
];

export default function DayInHerShoes() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const filteredStories = stories.filter((story) =>
    `${story.title} ${story.character} ${story.age} ${story.location}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div className="story-page">
      <h2 className="story-heading">A Day in Her Shoes</h2>
      <p className="story-subtext">
        Choose a story to explore a day in the life of a pregnant woman facing environmental challenges.
      </p>

      <input
        className="story-search"
        type="text"
        placeholder="Search by trimester or location..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="story-list">
        {filteredStories.map((story) => (
          <div key={story.id} className="story-card">
            <h3>{story.title}</h3>
            <p>
              <strong>{story.character}</strong> – {story.age}, {story.location}
            </p>
            <p>{story.description}</p>
            <button onClick={() => navigate(`/a-day-in-her-shoes/${story.id}`)}>
              Start Story
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
