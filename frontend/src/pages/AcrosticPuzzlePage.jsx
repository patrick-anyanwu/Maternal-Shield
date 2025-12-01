import React, { useState, useEffect, useRef } from 'react';

const MaternalShieldWordSearch = () => {
  // Game levels with different themes - modified with shorter words and focus on heatwave/air pollution
  const gameLevels = [
    {
      title: "Pregnancy & Climate",
      theme: "environment",
      words: ["HEAT", "AIR", "WOMB", "PM25", "RISK"],
      questions: {
        "HEAT": "Exposure to extreme ____ during pregnancy can increase the risk of preterm birth",
        "AIR": "Poor ____ quality with high PM2.5 levels can negatively affect maternal health",
        "WOMB": "The ____ provides protection, but environmental pollutants can still reach the baby",
        "PM25": "These fine particulate matter pollutants (___) can cross the placental barrier",
        "RISK": "Climate change increases the ____ of pregnancy complications in vulnerable populations",
      }
    },
    {
      title: "Protection Strategies",
      theme: "nutrition",
      words: ["MASK", "COOL", "STAY", "REST", "DIET"],
      questions: {
        "MASK": "Wearing a ____ can reduce exposure to air pollution when outdoors",
        "COOL": "Keeping ____ during heat waves is essential for pregnant women",
        "STAY": "____ indoors when air quality warnings are in effect",
        "REST": "Take frequent ____ breaks during hot weather to prevent overheating",
        "DIET": "A healthy ____ with antioxidants may help counter pollution effects",
      }
    },
    {
      title: "Health Impacts",
      theme: "wellness",
      words: ["LUNG", "BABY", "TERM", "BURN", "FLOW"],
      questions: {
        "LUNG": "____ function in pregnant women can be compromised by air pollution",
        "BABY": "A developing ____ is more vulnerable to environmental toxins than adults",
        "TERM": "Exposure to extreme heat and air pollution may lead to pre____ birth",
        "BURN": "Eyes may ____ or become irritated when exposed to high pollution levels",
        "FLOW": "Blood ____ to the placenta can be reduced during extreme heat exposure",
      }
    }
  ];
  
  const [currentGameLevel, setCurrentGameLevel] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [entering, setEntering] = useState(false);
  const [gridSize] = useState(10);
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wordPositions, setWordPositions] = useState({});
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintLetterCount, setHintLetterCount] = useState(1);
  const [highlightTourTarget, setHighlightTourTarget] = useState(null);
  
  // Refs for tour guide scrolling
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const questionRef = useRef(null);
  const progressRef = useRef(null);
  const tourContentRef = useRef(null);
  const nextGameButtonRef = useRef(null);

  // Tour steps
  const tourSteps = [
    {
      target: titleRef,
      content: "Welcome to the word search game! Here you'll learn important information about how heatwaves and air pollution (PM2.5) affect pregnancy health.",
      position: "bottom"
    },
    {
      target: progressRef,
      content: "This progress bar shows how many words you've found in the current game.",
      position: "bottom"
    },
    {
      target: questionRef,
      content: "Read each clue carefully, then find the answer in the grid to the right.",
      position: "right"
    },
    {
      target: gridRef,
      content: "Click and drag to connect letters horizontally or vertically to form words. When you find the correct word, it will be highlighted!",
      position: "left"
    },
    {
      target: nextGameButtonRef,
      content: "You can move to the next game level at any time by clicking this button.",
      position: "top"
    }
  ];

  // Close tour
  const closeTour = () => {
    setIsTourOpen(false);
    setTourStep(0);
    setHighlightTourTarget(null);
    localStorage.setItem('wordSearchTourComplete', 'true');
  };

  // Next tour step
  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
      setHighlightTourTarget(tourSteps[tourStep + 1].target);
      if (tourSteps[tourStep + 1].target && tourSteps[tourStep + 1].target.current) {
        tourSteps[tourStep + 1].target.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    } else {
      closeTour();
    }
  };

  // Previous tour step
  const prevTourStep = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
      setHighlightTourTarget(tourSteps[tourStep - 1].target);
      if (tourSteps[tourStep - 1].target && tourSteps[tourStep - 1].target.current) {
        tourSteps[tourStep - 1].target.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  // Show hint
  const showWordHint = () => {
    const currentWord = gameLevels[currentGameLevel].words[questionIndex];
    if (hintLetterCount < currentWord.length) {
      setHintLetterCount(hintLetterCount + 1);
    }
    setShowHint(true);
  };

  useEffect(() => {
    const tourComplete = localStorage.getItem('wordSearchTourComplete');
    if (!tourComplete) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
        setHighlightTourTarget(tourSteps[0].target);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const currentGame = gameLevels[currentGameLevel];
    if (currentGame.words.length > 0) {
      setCurrentQuestion(currentGame.questions[currentGame.words[0]]);
    }
  }, [currentGameLevel]);
  
  useEffect(() => {
    if (grid.length === 0) {
      generatePuzzle();
    }
    
    setShowHint(false);
    setHintLetterCount(1);
    
    const currentGame = gameLevels[currentGameLevel];
    if (currentGame.words.length > questionIndex) {
      setCurrentQuestion(currentGame.questions[currentGame.words[questionIndex]]);
    }
  }, [currentGameLevel, questionIndex, grid.length]);
  
  const generatePuzzle = () => {
    const newGrid = Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(""));
    
    const positions = {};
    const currentWords = gameLevels[currentGameLevel].words;
    
    // Shuffle the words to randomize placement order
    const shuffledWords = [...currentWords].sort(() => Math.random() - 0.5);
    
    // Make sure we distribute horizontal and vertical placements differently each time
    const directionPattern = [];
    for (let i = 0; i < shuffledWords.length; i++) {
      // Random direction assignment - makes more random patterns than alternating
      directionPattern.push(Math.floor(Math.random() * 2));
    }
    
    for (let i = 0; i < shuffledWords.length; i++) {
      const word = shuffledWords[i];
      const forceDirection = directionPattern[i];
      
      if (!forcePlaceWord(word, newGrid, positions, forceDirection)) {
        // Try the opposite direction if the first attempt fails
        if (!forcePlaceWord(word, newGrid, positions, 1 - forceDirection)) {
          // Last resort - try any direction
          if (!placeWord(word, newGrid, positions)) {
            console.log(`Could not place word: ${word}`);
          }
        }
      }
    }
    
    fillEmptyCells(newGrid);
    
    setGrid(newGrid);
    setWordPositions(positions);
  };
  
  const placeWord = (word, grid, positions) => {
    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
    ];
    
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
    
    for (const direction of shuffledDirections) {
      for (let attempt = 0; attempt < 30; attempt++) {
        let startX, startY;
        const [dx, dy] = direction;
        
        if (dx === 0) {
          startX = Math.floor(Math.random() * gridSize);
          startY = Math.floor(Math.random() * (gridSize - word.length + 1));
        } else {
          startX = Math.floor(Math.random() * (gridSize - word.length + 1));
          startY = Math.floor(Math.random() * gridSize);
        }
        
        if (canPlaceWord(word, startX, startY, direction, grid)) {
          placeWordOnGrid(word, startX, startY, direction, grid, positions);
          return true;
        }
      }
    }
    
    return false;
  };
  
  const forcePlaceWord = (word, grid, positions, forcedDirectionIndex) => {
    const directions = [
      [0, 1],    // Horizontal
      [1, 0],    // Vertical
    ];
  
    const directionToUse = directions[forcedDirectionIndex % directions.length];
    
    // First try to place normally with collision checks - try more positions for better success
    for (let attempt = 0; attempt < 40; attempt++) {
      const [dx, dy] = directionToUse;
      const startX = Math.floor(Math.random() * (gridSize - (dx * word.length) + 1));
      const startY = Math.floor(Math.random() * (gridSize - (dy * word.length) + 1));
      
      if (canPlaceWord(word, startX, startY, directionToUse, grid)) {
        placeWordOnGrid(word, startX, startY, directionToUse, grid, positions);
        return true;
      }
    }
  
    // If normal placement fails, try looking for partial overlaps
    const [dx, dy] = directionToUse;
    const maxAttempts = 50;
  
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const startX = Math.floor(Math.random() * (gridSize - (dx * word.length) + 1));
      const startY = Math.floor(Math.random() * (gridSize - (dy * word.length) + 1));
  
      let overlaps = 0;
      let conflicts = 0;
      
      // Check if we can place with overlapping some existing letters
      for (let i = 0; i < word.length; i++) {
        const x = startX + dx * i;
        const y = startY + dy * i;
        
        if (grid[y][x] !== "") {
          if (grid[y][x] === word[i]) {
            overlaps++;
          } else {
            conflicts++;
            break;
          }
        }
      }
  
      if (conflicts === 0) {
        placeWordOnGrid(word, startX, startY, directionToUse, grid, positions);
        return true;
      }
    }
  
    // Final fallback - force place at random position, only allowing overlaps
    const startX = Math.floor(Math.random() * (gridSize - (dx * word.length) + 1));
    const startY = Math.floor(Math.random() * (gridSize - (dy * word.length) + 1));
    
    const wordCells = [];
    for (let i = 0; i < word.length; i++) {
      const x = startX + dx * i;
      const y = startY + dy * i;
      // Only overwrite if cell is empty or matches our word
      if (grid[y][x] === "" || grid[y][x] === word[i]) {
        grid[y][x] = word[i];
        wordCells.push({ x, y });
      }
    }
    
    positions[word] = wordCells;
    return wordCells.length === word.length;
  };
  
  const canPlaceWord = (word, startX, startY, [dx, dy], grid) => {
    if (
      startX + dx * (word.length - 1) < 0 ||
      startX + dx * (word.length - 1) >= gridSize ||
      startY + dy * (word.length - 1) < 0 ||
      startY + dy * (word.length - 1) >= gridSize
    ) {
      return false;
    }
    
    for (let i = 0; i < word.length; i++) {
      const [x, y] = [startX + dx * i, startY + dy * i];
      if (grid[y][x] !== "" && grid[y][x] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };
  
  const placeWordOnGrid = (word, startX, startY, [dx, dy], grid, positions) => {
    const wordCells = [];
    
    for (let i = 0; i < word.length; i++) {
      const [x, y] = [startX + dx * i, startY + dy * i];
      grid[y][x] = word[i];
      wordCells.push({x, y});
    }
    
    positions[word] = wordCells;
  };
  
  const fillEmptyCells = (grid) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (grid[y][x] === "") {
          grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  };
  
  const startSelection = (x, y) => {
    setIsSelecting(true);
    setSelectedCells([{x, y}]);
  };
  
  const updateSelection = (x, y) => {
    if (!isSelecting) return;
    
    if (selectedCells.some(cell => cell.x === x && cell.y === y)) return;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    const dx = x - lastCell.x;
    const dy = y - lastCell.y;
    
    if (selectedCells.length === 1) {
      if ((Math.abs(dx) === 1 && dy === 0) || (Math.abs(dy) === 1 && dx === 0)) {
        setSelectedCells([...selectedCells, {x, y}]);
      }
    } else {
      const firstCell = selectedCells[0];
      const secondCell = selectedCells[1];
      const initialDx = secondCell.x - firstCell.x;
      const initialDy = secondCell.y - firstCell.y;
      
      if (
        (initialDx === 0 && dx === 0) ||
        (initialDy === 0 && dy === 0)
      ) {
        if (
          (Math.abs(dx) === 1 && dy === 0) || 
          (Math.abs(dy) === 1 && dx === 0)
        ) {
          setSelectedCells([...selectedCells, {x, y}]);
        }
      }
    }
  };
  
  const endSelection = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    
    const selectedWord = selectedCells.map(cell => grid[cell.y][cell.x]).join("");
    const currentWords = gameLevels[currentGameLevel].words;
    const targetWord = currentWords[questionIndex];
    
    if (selectedWord === targetWord) {
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(targetWord);
      setFoundWords(newFoundWords);
      
      const newCorrectAnswers = correctAnswersCount + 1;
      setCorrectAnswersCount(newCorrectAnswers);
      
      if (questionIndex < currentWords.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setGameCompleted(true);
      }
    }
    
    setSelectedCells([]);
  };
  
  const moveToNextGame = () => {
    setExiting(true);
    
    setTimeout(() => {
      setFoundWords(new Set());
      setQuestionIndex(0);
      setCorrectAnswersCount(0);
      setGameCompleted(false);
      setShowHint(false);
      setHintLetterCount(1);
      setGrid([]);
      
      const nextGameLevel = (currentGameLevel + 1) % gameLevels.length;
      setCurrentGameLevel(nextGameLevel);
      
      setExiting(false);
      setEntering(true);
      
      setTimeout(() => {
        setEntering(false);
      }, 500);
    }, 500);
  };
  
  const resetGame = () => {
    setFoundWords(new Set());
    setQuestionIndex(0);
    setCorrectAnswersCount(0);
    setGameCompleted(false);
    setShowHint(false);
    setHintLetterCount(1);
    setGrid([]);
  };
  
  const progressPercentage = Math.round((correctAnswersCount / gameLevels[currentGameLevel].words.length) * 100);
  
  const isCellInFoundWord = (x, y) => {
    return Array.from(foundWords).some(word => {
      if (!wordPositions[word]) return false;
      return wordPositions[word].some(cell => cell.x === x && cell.y === y);
    });
  };

  const isCellSelected = (x, y) => {
    return selectedCells.some(cell => cell.x === x && cell.y === y);
  };
  
  const currentTheme = gameLevels[currentGameLevel].theme;
  const currentWord = gameLevels[currentGameLevel].words[questionIndex];
  
  const getWordHint = () => {
    if (!currentWord) return "";
    return currentWord.substring(0, hintLetterCount) + 
           (hintLetterCount < currentWord.length ? '_ '.repeat(currentWord.length - hintLetterCount).trim() : '');
  };
  
  // This is a modification to apply to the renderTourStep function in MaternalShieldWordSearch component

const renderTourStep = () => {
  if (!isTourOpen || tourStep >= tourSteps.length) return null;
  
  const currentStep = tourSteps[tourStep];
  if (!currentStep || !currentStep.target || !currentStep.target.current) return null;

  const targetRect = currentStep.target.current.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  let topPos, leftPos, rightPos, transform;
  
  // Special positioning for Step 2 (the progress bar)
  if (tourStep === 1) { // Step 2 (0-indexed)
    // Calculate a higher position for the progress bar step
    topPos = targetRect.top - 100; // Move it 100px higher than default
  } else {
    switch(currentStep.position) {
      case 'bottom':
        topPos = targetRect.bottom + 10;
        leftPos = targetRect.left + (targetRect.width / 2);
        transform = 'translateX(-50%)';
        rightPos = 'auto';
        break;
      case 'top':
        topPos = targetRect.top - 120;
        leftPos = targetRect.left + (targetRect.width / 2);
        transform = 'translateX(-50%)';
        rightPos = 'auto';
        break;
      case 'right':
        topPos = targetRect.top + (targetRect.height / 2);
        leftPos = targetRect.right + 10;
        transform = 'translateY(-50%)';
        rightPos = 'auto';
        break;
      case 'left':
        topPos = targetRect.top + (targetRect.height / 2);
        leftPos = 'auto';
        rightPos = windowWidth - targetRect.left + 10;
        transform = 'translateY(-50%)';
        break;
      default:
        topPos = targetRect.top + (targetRect.height / 2);
        leftPos = targetRect.left + (targetRect.width / 2);
        transform = 'translate(-50%, -50%)';
        rightPos = 'auto';
    }
  }
  
  if (topPos < 0) topPos = 10;
  if (topPos > windowHeight - 200) topPos = windowHeight - 210;
  
  return (
    <div className="tour-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      pointerEvents: isTourOpen ? 'all' : 'none',
      opacity: isTourOpen ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      <div className="tour-backdrop" 
        onClick={closeTour}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 9990
        }}></div>
      <div 
        className="tour-content" 
        ref={tourContentRef}
        style={{
          position: 'absolute',
          top: `${topPos}px`,
          left: leftPos !== 'auto' ? `${leftPos}px` : 'auto',
          right: rightPos !== 'auto' ? `${rightPos}px` : 'auto',
          transform: transform,
          zIndex: 9995
        }}
      >
        <div 
          className="tour-step" 
          data-step={tourStep + 1}  // Add data-step attribute
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            maxWidth: '350px',
            position: 'relative'
          }}
        >
          <h3 style={{
            fontSize: '16px',
            color: '#6d28d9',
            marginTop: 0,
            marginBottom: '10px'
          }}>Step {tourStep + 1} of {tourSteps.length}</h3>
          <p style={{
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#4b5563',
            marginBottom: '15px'
          }}>{currentStep.content}</p>
          <div className="tour-nav" style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <button 
              onClick={prevTourStep} 
              disabled={tourStep === 0}
              style={{
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 600,
                cursor: tourStep === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                background: '#f3f4f6',
                color: '#4b5563',
                opacity: tourStep === 0 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            <button 
              onClick={nextTourStep} 
              style={{
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                background: '#8b5cf6',
                color: 'white'
              }}
            >
              {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  // CSS Styles
  const styles = {
    wordSearchPage: {
      paddingTop: '80px',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #4a1d96 0%, #7e22ce 100%)'
    },
    wordSearchContainer: {
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
      minHeight: 'calc(100vh - 100px)',
      boxSizing: 'border-box',
      position: 'relative',
      transition: 'all 0.5s ease',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'translateY(20px)' : entering ? 'translateY(-20px)' : 'translateY(0)'
    },
    container: {
      environment: {
        background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.1), rgba(156, 39, 176, 0.1))'
      },
      nutrition: {
        background: 'linear-gradient(135deg, rgba(3, 169, 244, 0.1), rgba(0, 150, 136, 0.1))'
      },
      wellness: {
        background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(233, 30, 99, 0.1))'
      }
    },
    gameHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    gameControls: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    wordSearchTitle: {
      display: 'inline-block',
      padding: '10px 20px',
      borderRadius: '50px',
      fontWeight: 'bold',
      fontSize: '1.3rem',
      textAlign: 'center',
      margin: 0,
      color: 'white',
      position: 'relative',
      letterSpacing: '0.5px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease'
    },
    title: {
      environment: {
        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      },
      nutrition: {
        background: 'linear-gradient(90deg, #06b6d4, #10b981)',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      },
      wellness: {
        background: 'linear-gradient(90deg, #f97316, #ef4444)',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }
    },
    helpButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '50px',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    nextLevelButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '50px',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      color: 'white'
    },
    button: {
      environment: {
        helpBtn: {
          background: 'rgba(165, 180, 252, 0.25)',
          color: 'white',
          border: '1px solid rgba(139, 92, 246, 0.5)'
        },
        nextBtn: {
          background: 'linear-gradient(45deg, #6366f1, #a855f7)'
        }
      },
      nutrition: {
        helpBtn: {
          background: 'rgba(153, 246, 228, 0.25)',
          color: 'white',
          border: '1px solid rgba(20, 184, 166, 0.5)'
        },
        nextBtn: {
          background: 'linear-gradient(45deg, #06b6d4, #10b981)'
        }
      },
      wellness: {
        helpBtn: {
          background: 'rgba(254, 215, 170, 0.25)',
          color: 'white',
          border: '1px solid rgba(249, 115, 22, 0.5)'
        },
        nextBtn: {
          background: 'linear-gradient(45deg, #f97316, #ef4444)'
        }
      }
    },
    wordSearchLayout: {
      display: 'flex',
      flexDirection: 'row',
      gap: '1.5rem',
      alignItems: 'flex-start',
      width: '100%'
    },
    questionContainer: {
      flex: '0 0 35%',
      padding: '1.5rem',
      borderRadius: '1rem',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignSelf: 'stretch',
      minHeight: '400px',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    questionContainerTheme: {
      environment: {
        background: 'rgba(253, 242, 255, 0.85)',
        borderLeft: '4px solid #a855f7'
      },
      nutrition: {
        background: 'rgba(240, 253, 250, 0.85)',
        borderLeft: '4px solid #14b8a6'
      },
      wellness: {
        background: 'rgba(255, 247, 237, 0.85)',
        borderLeft: '4px solid #f97316'
      }
    },
    gridContainer: {
      flex: 1,
      display: 'grid',
      gap: '6px',
      padding: '1.5rem',
      borderRadius: '1rem',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      maxWidth: '100%',
      overflow: 'visible',
      alignSelf: 'flex-start',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    gridContainerTheme: {
      environment: {
        background: 'rgba(244, 240, 255, 0.9)',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      },
      nutrition: {
        background: 'rgba(240, 253, 250, 0.9)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      },
      wellness: {
        background: 'rgba(255, 247, 237, 0.9)',
        border: '1px solid rgba(249, 115, 22, 0.3)'
      }
    },
    progressBarContainer: {
      width: '90%',
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '9999px',
      height: '8px',
      margin: '12px auto',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    progressBar: {
      height: '100%',
      borderRadius: '9999px',
      transition: 'width 0.5s ease-in-out',
      textAlign: 'center',
      color: 'white',
      fontSize: '0.7rem',
      lineHeight: '10px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
      backgroundSize: '200% 200%',
      animation: 'gradient-animation 2s ease infinite'
    },
    progressBarTheme: {
      environment: {
        background: 'linear-gradient(90deg, #6366f1, #a855f7, #6366f1)'
      },
      nutrition: {
        background: 'linear-gradient(90deg, #0ea5e9, #10b981, #0ea5e9)'
      },
      wellness: {
        background: 'linear-gradient(90deg, #f97316, #ef4444, #f97316)'
      }
    },
    questionTitle: {
      fontSize: '1.1rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      position: 'relative',
      display: 'inline-block',
      margin: '0 auto'
    },
    questionTitleTheme: {
      environment: {
        color: '#7e22ce'
      },
      nutrition: {
        color: '#0f766e'
      },
      wellness: {
        color: '#c2410c'
      }
    },
    questionText: {
      fontSize: '1.1rem',
      lineHeight: 1.5,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
    },
    questionTextTheme: {
      environment: {
        color: '#4a1d96'
      },
      nutrition: {
        color: '#065f46'
      },
      wellness: {
        color: '#9a3412'
      }
    },
    gridCell: {
      width: '38px',
      height: '38px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '1.15rem',
      cursor: 'pointer',
      userSelect: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.2s ease',
      position: 'relative',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transform: 'translateY(0)'
    },
    gridCellTheme: {
      environment: {
        normal: {
          background: 'linear-gradient(135deg, #f9fafb, #ede9fe)',
          color: '#4a1d96',
          borderBottom: '3px solid #c4b5fd'
        },
        selected: {
          background: '#fcd34d',
          color: '#7c2d12',
          border: '1px solid #f59e0b'
        },
        found: {
          background: '#86efac',
          color: '#065f46',
          border: '1px solid #22c55e'
        }
      },
      nutrition: {
        normal: {
          background: 'linear-gradient(135deg, #f9fafb, #ecfdf5)',
          color: '#065f46',
          borderBottom: '3px solid #a7f3d0'
        },
        selected: {
          background: '#a7f3d0',
          color: '#064e3b',
          border: '1px solid #10b981'
        },
        found: {
          background: '#bae6fd',
          color: '#0c4a6e',
          border: '1px solid #0ea5e9'
        }
      },
      wellness: {
        normal: {
          background: 'linear-gradient(135deg, #f9fafb, #fff7ed)',
          color: '#9a3412',
          borderBottom: '3px solid #fed7aa'
        },
        selected: {
          background: '#fed7aa',
          color: '#7c2d12',
          border: '1px solid #f97316'
        },
        found: {
          background: '#fecaca',
          color: '#7f1d1d',
          border: '1px solid #ef4444'
        }
      }
    },
    gameInstructions: {
      marginTop: '1rem',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '1rem',
      borderRadius: '0.75rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
    },
    gameInstructionsTheme: {
      environment: {
        borderTop: '3px solid #6366f1'
      },
      nutrition: {
        borderTop: '3px solid #10b981'
      },
      wellness: {
        borderTop: '3px solid #f97316'
      }
    },
    instructionText: {
      fontSize: '0.95rem',
      marginBottom: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '0.75rem',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
    },
    instructionTextTheme: {
      environment: {
        color: '#4a1d96'
      },
      nutrition: {
        color: '#065f46'
      },
      wellness: {
        color: '#9a3412'
      }
    },
    wordsCounter: {
      fontSize: '0.95rem',
      fontWeight: 600,
      marginTop: '0.5rem'
    },
    wordsCounterTheme: {
      environment: {
        color: '#4a1d96'
      },
      nutrition: {
        color: '#065f46'
      },
      wellness: {
        color: '#9a3412'
      }
    },
    hintButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '50px',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      margin: '0 auto',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    },
    hintButtonTheme: {
      environment: {
        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.3))',
        color: '#7e22ce',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      },
      nutrition: {
        background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.3))',
        color: '#065f46',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      },
      wellness: {
        background: 'linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(251, 146, 60, 0.3))',
        color: '#9a3412',
        border: '1px solid rgba(249, 115, 22, 0.3)'
      }
    },
    hintDisplay: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '12px 18px',
      borderRadius: '12px',
      margin: '12px 0',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
    },
    hintDisplayTheme: {
      environment: {
        borderLeft: '3px solid #6366f1',
        background: 'linear-gradient(to right, #f5f3ff, white)'
      },
      nutrition: {
        borderLeft: '3px solid #10b981',
        background: 'linear-gradient(to right, #ecfdf5, white)'
      },
      wellness: {
        borderLeft: '3px solid #f97316',
        background: 'linear-gradient(to right, #fff7ed, white)'
      }
    },
    hintWord: {
      fontWeight: 'bold',
      letterSpacing: '2px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    hintWordTheme: {
      environment: {
        color: '#4a1d96'
      },
      nutrition: {
        color: '#065f46'
      },
      wellness: {
        color: '#9a3412'
      }
    },
    completionPopupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    },
    completionPopup: {
      width: '90%',
      maxWidth: '500px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      position: 'relative'
    },
    completionPopupTheme: {
      environment: {
        borderTop: '5px solid #6366f1'
      },
      nutrition: {
        borderTop: '5px solid #10b981'
      },
      wellness: {
        borderTop: '5px solid #f97316'
      }
    },
    popupContent: {
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      zIndex: 2
    },
    completionTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      position: 'relative',
      display: 'inline-block'
    },
    completionTitleTheme: {
      environment: {
        color: '#6d28d9'
      },
      nutrition: {
        color: '#059669'
      },
      wellness: {
        color: '#ea580c'
      }
    },
    completionText: {
      fontSize: '1.1rem',
      marginBottom: '1.5rem',
      lineHeight: 1.6
    },
    completionTextTheme: {
      environment: {
        color: '#5b21b6'
      },
      nutrition: {
        color: '#047857'
      },
      wellness: {
        color: '#c2410c'
      }
    },
    nextGameButton: {
      marginTop: '0.75rem',
      padding: '0.75rem 1.5rem',
      color: 'white',
      border: 'none',
      borderRadius: '9999px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
    },
    nextGameButtonTheme: {
      environment: {
        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        boxShadow: '0 4px 6px rgba(139, 92, 246, 0.4)'
      },
      nutrition: {
        background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)'
      },
      wellness: {
        background: 'linear-gradient(135deg, #f97316, #f43f5e)',
        boxShadow: '0 4px 6px rgba(249, 115, 22, 0.4)'
      }
    },
    tourHighlight: {
      position: 'relative',
      zIndex: 10,
      boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 0 8px rgba(139, 92, 246, 0.2)',
      borderRadius: '4px'
    }
  };
  
  return (
    <div style={styles.wordSearchPage} className="word-search-page">
      <div style={{
        ...styles.wordSearchContainer,
        ...styles.container[currentTheme]
      }} className={`word-search-container theme-${currentTheme}`}>
        <div style={styles.gameHeader} className="game-header">
          <h2 
            style={{
              ...styles.wordSearchTitle,
              ...styles.title[currentTheme],
              ...(highlightTourTarget === titleRef ? styles.tourHighlight : {})
            }} 
            ref={titleRef}
            className="word-search-title"
          >
            {gameLevels[currentGameLevel].title} Knowledge Game
          </h2>
          
          <div style={styles.gameControls} className="game-controls">
            <button 
              style={{
                ...styles.helpButton,
                ...styles.button[currentTheme].helpBtn
              }}
              className="help-button"
              onClick={() => {
                setIsTourOpen(true);
                setHighlightTourTarget(tourSteps[0].target);
                setTourStep(0);
              }}
              aria-label="Open tour guide"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Help</span>
            </button>
            
            <button 
              style={{
                ...styles.nextLevelButton,
                ...styles.button[currentTheme].nextBtn
              }}
              className="next-level-button"
              onClick={moveToNextGame}
              ref={nextGameButtonRef}
              aria-label="Go to next game board"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
              <span>Next Level</span>
            </button>
          </div>
        </div>
        
        <div style={styles.wordSearchLayout} className="word-search-layout">
          <div 
            style={{
              ...styles.questionContainer,
              ...styles.questionContainerTheme[currentTheme],
              ...(highlightTourTarget === questionRef ? styles.tourHighlight : {})
            }} 
            className="question-container" 
            ref={questionRef}
          >
            <h3 
              style={{
                ...styles.questionTitle,
                ...styles.questionTitleTheme[currentTheme]
              }} 
              className="question-title"
            >
              Find this answer:
            </h3>
            <p 
              style={{
                ...styles.questionText,
                ...styles.questionTextTheme[currentTheme]
              }} 
              className="question-text"
            >
              {currentQuestion}
            </p>
            
            {showHint && (
              <div 
                style={{
                  ...styles.hintDisplay,
                  ...styles.hintDisplayTheme[currentTheme]
                }} 
                className="hint-display"
              >
                <p>Hint: <span 
                  style={{
                    ...styles.hintWord,
                    ...styles.hintWordTheme[currentTheme]
                  }} 
                  className="hint-word"
                >
                  {getWordHint()}
                </span></p>
              </div>
            )}
            
            <div className="hint-button-container">
              <button 
                style={{
                  ...styles.hintButton,
                  ...styles.hintButtonTheme[currentTheme]
                }} 
                className="hint-button" 
                onClick={showWordHint}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                {!showHint ? "Need a hint?" : "More letters"}
              </button>
            </div>
            
            <div 
              style={{
                ...styles.gameInstructions,
                ...styles.gameInstructionsTheme[currentTheme]
              }} 
              className="game-instructions"
            >
              <p 
                style={{
                  ...styles.instructionText,
                  ...styles.instructionTextTheme[currentTheme]
                }} 
                className="instruction-text"
              >
                Connect the letters horizontally or vertically to find the answer!
              </p>
              
              <div 
                style={{
                  ...styles.progressBarContainer,
                  ...(highlightTourTarget === progressRef ? styles.tourHighlight : {})
                }} 
                className="progress-bar-container in-question" 
                ref={progressRef}
              >
                <div 
                  style={{
                    ...styles.progressBar,
                    ...styles.progressBarTheme[currentTheme],
                    width: `${progressPercentage}%`
                  }} 
                  className="progress-bar"
                >
                  {progressPercentage}%
                </div>
              </div>
              
              <p 
                style={{
                  ...styles.wordsCounter,
                  ...styles.wordsCounterTheme[currentTheme]
                }} 
                className="words-counter"
              >
                Words found: {correctAnswersCount} of {gameLevels[currentGameLevel].words.length}
              </p>
              <p 
                style={{
                  ...styles.wordsCounter,
                  ...styles.wordsCounterTheme[currentTheme]
                }} 
                className="game-level-indicator"
              >
                Game {currentGameLevel + 1} of {gameLevels.length}
              </p>
            </div>
          </div>
          
          <div 
            style={{
              ...styles.gridContainer,
              ...styles.gridContainerTheme[currentTheme],
              gridTemplateColumns: `repeat(${gridSize}, minmax(30px, 40px))`,
              ...(highlightTourTarget === gridRef ? styles.tourHighlight : {})
            }}
            className="grid-container"
            onMouseLeave={endSelection}
            onTouchEnd={endSelection}
            ref={gridRef}
          >
            {grid.map((row, y) => (
              row.map((letter, x) => {
                const isSelected = isCellSelected(x, y);
                const isFound = isCellInFoundWord(x, y);
                
                let cellStyle = {
                  ...styles.gridCell,
                  ...styles.gridCellTheme[currentTheme].normal
                };
                
                if (isSelected) {
                  cellStyle = {
                    ...cellStyle,
                    ...styles.gridCellTheme[currentTheme].selected,
                    transform: 'scale(1.1)',
                    zIndex: 10
                  };
                } else if (isFound) {
                  cellStyle = {
                    ...cellStyle,
                    ...styles.gridCellTheme[currentTheme].found
                  };
                }
                
                return (
                  <div 
                    key={`${x}-${y}`} 
                    style={cellStyle}
                    className={`grid-cell ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}`}
                    onMouseDown={() => startSelection(x, y)}
                    onMouseOver={() => updateSelection(x, y)}
                    onMouseUp={endSelection}
                    onTouchStart={() => startSelection(x, y)}
                    onTouchMove={(e) => {
                      const touch = e.touches[0];
                      const element = document.elementFromPoint(touch.clientX, touch.clientY);
                      if (element && element.classList.contains('grid-cell')) {
                        const coords = element.getAttribute('data-coords');
                        if (coords) {
                          const [cellX, cellY] = coords.split('-').map(Number);
                          updateSelection(cellX, cellY);
                        }
                      }
                    }}
                    data-coords={`${x}-${y}`}
                  >
                    {letter}
                  </div>
                );
              })
            ))}
          </div>
        </div>
        
        
        {/* Popup congratulations message */}
        {gameCompleted && (
          <div style={styles.completionPopupOverlay} className="completion-popup-overlay">
            <div 
              style={{
                ...styles.completionPopup,
                ...styles.completionPopupTheme[currentTheme]
              }}
              className="completion-popup"
            >
              <div style={styles.popupContent} className="popup-content">
                <h3 
                  style={{
                    ...styles.completionTitle,
                    ...styles.completionTitleTheme[currentTheme]
                  }}
                  className="completion-title"
                >
                  Congratulations!
                </h3>
                <p 
                  style={{
                    ...styles.completionText,
                    ...styles.completionTextTheme[currentTheme]
                  }}
                  className="completion-text"
                >
                  {currentGameLevel < gameLevels.length - 1 
                    ? "You've completed this game! Ready for the next challenge?" 
                    : "You've completed all games and learned important information about protecting your pregnancy from heatwaves and air pollution!"}
                </p>
                {currentGameLevel < gameLevels.length - 1 ? (
                  <button 
                    style={{
                      ...styles.nextGameButton,
                      ...styles.nextGameButtonTheme[currentTheme]
                    }}
                    className="next-game-button"
                    onClick={moveToNextGame}
                  >
                    Next Game
                  </button>
                ) : (
                  <button 
                    style={{
                      ...styles.nextGameButton,
                      ...styles.nextGameButtonTheme[currentTheme]
                    }}
                    className="play-again-button"
                    onClick={resetGame}
                  >
                    Play Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Tour guide overlay - now properly positioned with high z-index */}
        {renderTourStep()}
      </div>
    </div>
  );
};

export default MaternalShieldWordSearch;