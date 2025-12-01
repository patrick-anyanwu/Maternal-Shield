// src/stories/stories.js

const stories = [
  {
    id: "sarah-heatwave", // used in URL
    characterId: 1,        // actual DB character ID
    title: "Sarah’s Heatwave Day",
    character: "Sarah",
    trimester: "28 weeks",
    location: "Western Sydney",
    intro:
      "It’s a hot summer morning in late January, in a bushfire-prone suburb of Sydney. The forecast says 36°C today with a smoke warning in effect due to controlled burns nearby. You're Sarah, 28 weeks pregnant, and just waking up to start your day. The air already smells faintly of smoke, and your phone shows an air quality alert. How you navigate today's challenges will impact both you and your baby.",
    scenes: [
      {
        id: "scene1",
        title: "Morning Routine",
        text: "You wake up and the air feels heavy. It's already 30°C. You smell light smoke outside.",
        choices: [
          {
            label: "Open windows to cool down",
            consequence: "Smoke enters the room. You feel light-headed.",
            babyStatus: "yellow"
          },
          {
            label: "Keep windows closed and use a fan",
            consequence: "The air stays clean. You feel better hydrated and calm.",
            babyStatus: "green"
          }
        ]
      }
    ]
  },
  {
    id: "mei-bushfire",  // used in URL
    characterId: 2,       // actual DB character ID
    title: "Mei’s Bushfire Challenge",
    character: "Mei",
    trimester: "Third Trimester",
    location: "Canberra Suburbs",
    intro:
      "It’s late spring, and you’re in your third trimester. A nearby bushfire has worsened the air quality and authorities have issued a stay indoors advisory. You're Mei, preparing for your doctor appointment, unsure whether to go out in this smoke or reschedule. How will you prioritize your and your baby’s safety?",
    scenes: [
      {
        id: "scene1",
        title: "Heading Out",
        text: "You’re supposed to visit the clinic today. The AQI is 180 — very unhealthy.",
        choices: [
          {
            label: "Walk to the clinic",
            consequence: "You start coughing midway. Your heart rate increases.",
            babyStatus: "red"
          },
          {
            label: "Call and reschedule appointment",
            consequence: "You feel safe indoors and rest instead.",
            babyStatus: "green"
          }
        ]
      }
    ]
  }
];

export default stories;
