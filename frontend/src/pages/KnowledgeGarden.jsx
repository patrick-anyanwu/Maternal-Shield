import React, { useState, useEffect, useRef } from "react";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import "../styles/KnowledgeGarden.css";

// Knowledge Library Component
const KnowledgeLibrary = () => {
  const [facts, setFacts] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isLampOn, setIsLampOn] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteBookIds, setFavoriteBookIds] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('favoriteBookIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [lampFlicker, setLampFlicker] = useState(false);
  
  const lampRef = useRef(null);
  const readingAreaRef = useRef(null);
  
  // Facts data - same as in Knowledge Garden
  useEffect(() => {
    // This would typically be fetched from an API
    setFacts([
      // Pregnancy facts
      { 
        id: 1, 
        title: "First Trimester", 
        content: "During the first trimester, your baby's major organs begin to form, making this a critical time to avoid environmental toxins.", 
        category: "pregnancy",
        color: "#ec4899"
      },
      { 
        id: 2, 
        title: "Baby's Heartbeat", 
        content: "Your baby's heart begins beating around 6 weeks of pregnancy and can be detected by ultrasound at around 8 weeks.", 
        category: "pregnancy",
        color: "#ec4899"
      },
      { 
        id: 3, 
        title: "Placental Barrier", 
        content: "The placenta acts as a barrier, but many environmental toxins can still pass through to reach your developing baby.", 
        category: "pregnancy",
        color: "#ec4899"
      },
      { 
        id: 13, 
        title: "Folic Acid", 
        content: "This B vitamin is crucial during early pregnancy to prevent neural tube defects in your developing baby.", 
        category: "pregnancy",
        color: "#ec4899"
      },
      { 
        id: 15, 
        title: "Quickening", 
        content: "The first fetal movements felt by the mother, usually occurring between 16-25 weeks of pregnancy.", 
        category: "terminology",
        color: "#8b5cf6"
      },
      // Environmental facts
      { 
        id: 4, 
        title: "Air Pollution Impact", 
        content: "Exposure to high levels of air pollution during pregnancy may increase the risk of preterm birth and low birth weight.", 
        category: "environment",
        color: "#6366f1"
      },
      { 
        id: 5, 
        title: "Heat Exposure", 
        content: "Prolonged exposure to high temperatures during pregnancy can increase the risk of dehydration and preterm labor.", 
        category: "environment",
        color: "#6366f1"
      },
      { 
        id: 6, 
        title: "Indoor Air Quality", 
        content: "Indoor air can be 2-5 times more polluted than outdoor air. Keep your home well ventilated, especially while pregnant.", 
        category: "environment",
        color: "#6366f1"
      },
      { 
        id: 12, 
        title: "PM2.5", 
        content: "These are tiny air pollution particles (2.5 micrometers or smaller) that can cross the placental barrier and affect fetal development.", 
        category: "environment",
        color: "#6366f1"
      },
      { 
        id: 14, 
        title: "Heat Index", 
        content: "A measure of how hot it feels when relative humidity is combined with air temperature, important for pregnant women to monitor.", 
        category: "environment",
        color: "#6366f1"
      },
      // Terminology explanations
      { 
        id: 7, 
        title: "Placenta", 
        content: "The placenta is an organ that develops in the uterus during pregnancy to provide oxygen and nutrients to your growing baby.", 
        category: "terminology",
        color: "#8b5cf6"
      },
      { 
        id: 8, 
        title: "Amniotic Fluid", 
        content: "This protective liquid surrounds your baby in the amniotic sac, providing cushioning and helping with lung development.", 
        category: "terminology",
        color: "#8b5cf6"
      },
      { 
        id: 9, 
        title: "Trimester", 
        content: "Pregnancy is divided into three trimesters, each about 13 weeks long, with different developmental milestones and maternal changes.", 
        category: "terminology",
        color: "#8b5cf6"
      },
      { 
        id: 10, 
        title: "Umbilical Cord", 
        content: "This cord connects your baby to the placenta, carrying oxygen and nutrients to the baby and removing waste products.", 
        category: "terminology",
        color: "#8b5cf6"
      },
      { 
        id: 11, 
        title: "Neural Tube", 
        content: "The neural tube forms early in pregnancy and develops into your baby's brain, spinal cord, and nervous system.", 
        category: "terminology",
        color: "#8b5cf6"
      },
      // Added new facts
      {
        id: 16,
        title: "Nesting Instinct",
        content: "Many pregnant women experience a strong urge to clean and organize their home before the baby arrives – this is your natural 'nesting instinct'.",
        category: "pregnancy",
        color: "#ec4899"
      },
      {
        id: 17,
        title: "Baby's Fingerprints",
        content: "Your baby develops unique fingerprints by the end of the first trimester, around 13 weeks of pregnancy.",
        category: "pregnancy",
        color: "#ec4899"
      },
      {
        id: 18,
        title: "Braxton Hicks",
        content: "These are practice contractions that prepare your body for labor, often felt in the third trimester. They're irregular and typically painless.",
        category: "terminology",
        color: "#8b5cf6"
      },
      {
        id: 19,
        title: "Noise Pollution",
        content: "Exposure to loud noise during pregnancy may increase stress hormones and affect fetal development. Consider using sound dampening in noisy environments.",
        category: "environment",
        color: "#6366f1"
      },
      {
        id: 20,
        title: "Prenatal Vitamins",
        content: "These supplements contain essential nutrients like folic acid, iron, calcium, and DHA to support your baby's development.",
        category: "pregnancy",
        color: "#ec4899"
      }
    ]);
    
    // Check for first visit and create lamp flicker effect
    const hasVisitedBefore = localStorage.getItem('hasVisitedLibrary');
    
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedLibrary', 'true');
      
      // Flicker lamp on and off a few times
      setLampFlicker(true);
      let flickerCount = 0;
      
      const flickerInterval = setInterval(() => {
        setIsLampOn(prev => !prev);
        flickerCount++;
        
        if (flickerCount >= 5) {
          clearInterval(flickerInterval);
          setLampFlicker(false);
          setIsLampOn(true); // End with lamp on
        }
      }, 600);
      
      return () => clearInterval(flickerInterval);
    } else {
      setIsFirstVisit(false);
      // Turn lamp on by default for returning visitors
      setIsLampOn(true);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteBookIds', JSON.stringify(favoriteBookIds));
  }, [favoriteBookIds]);

  // Filter facts based on category and search
  const filteredFacts = facts.filter(fact => {
    // Filter by category
    if (currentCategory !== "all" && fact.category !== currentCategory) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return fact.title.toLowerCase().includes(term) || 
             fact.content.toLowerCase().includes(term);
    }
    
    return true;
  });

  // Group facts by category for shelf organization
  const booksByCategory = {
    pregnancy: filteredFacts.filter(fact => fact.category === "pregnancy"),
    environment: filteredFacts.filter(fact => fact.category === "environment"),
    terminology: filteredFacts.filter(fact => fact.category === "terminology")
  };
  
  // Handle category filter change
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setSelectedBookId(null); // Close any open book
  };
  
  // Toggle book selection
  const handleBookClick = (bookId) => {
    // If clicking the same book, toggle it off
    if (selectedBookId === bookId) {
      setSelectedBookId(null);
    } else {
      setSelectedBookId(bookId);
      // Make sure the lamp is on when a book is selected
      setIsLampOn(true);
    }
  };
  
  // Toggle lamp on/off
  const toggleLamp = () => {
    setIsLampOn(!isLampOn);
  };
  
  // Toggle favorite status
  const toggleFavorite = (bookId) => {
    setFavoriteBookIds(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };
  
  // Get selected book data
  const selectedBook = facts.find(fact => fact.id === selectedBookId);
  
  // Highlight search matches in text
  const highlightMatch = (text) => {
    if (!searchTerm || !text) return text;
    
    try {
      // Escape special regex characters
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
      const parts = text.split(regex);
      
      if (parts.length === 1) return text; // No matches
      
      return parts.map((part, i) => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return <span key={i} className="library-highlight">{part}</span>;
        }
        return part;
      });
    } catch (e) {
      console.error("Highlighting error:", e);
      return text; // Fallback
    }
  };
  
  // Get category name from slug
  const getCategoryName = (category) => {
    switch(category) {
      case "pregnancy": return "Pregnancy";
      case "environment": return "Environment";
      case "terminology": return "Terminology";
      default: return "All";
    }
  };

  return (
    <div className="knowledge-library">
      <Helmet>
        <title>Knowledge Library - Maternal Shield</title>
        <meta name="description" content="Explore our knowledge library about pregnancy, environmental factors, and important terminology." />
      </Helmet>
      
      <div className="library-container">
          {/* Subtle title and description */}
          <div className="library-intro">
            <h1 className="library-title">Pregnancy Knowledge Library</h1>
          </div>
          
          {/* Search bar */}
          <div className="library-search">
            <input
              type="text"
              placeholder="Search the books and explore our knowledge library about pregnancy"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="library-search-input"
            />
            {searchTerm && (
              <button 
                className="library-search-clear" 
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>
        
        <div className="library-content">
          {/* Bookshelves section */}
          <div className="library-bookshelves">
            {/* Ambient library sounds/environment effect */}
            <div className="library-ambience">
              <div className="library-dust-particles"></div>
            </div>

            <div className="library-cabinet">
              {/* Top shelf with filtered books from first half of the filtered collection */}
              <div className="library-section">
                <div className="library-shelf-label">Reference Collection</div>
                <div className="library-shelf top-shelf">
                  {filteredFacts.slice(0, Math.ceil(filteredFacts.length / 2)).map(book => {
                    const isFavorite = favoriteBookIds.includes(book.id);
                    
                    return (
                      <div 
                        key={book.id}
                        className={`library-book ${selectedBookId === book.id ? "open" : ""}`}
                        style={{ 
                          backgroundColor: book.color,
                          borderRight: `2px solid ${selectedBookId === book.id ? "#fff3b0" : "#d1d5db"}`,
                          height: `${120 + Math.random() * 30}px` // Varied heights for realism
                        }}
                        onClick={() => handleBookClick(book.id)}
                      >
                        <div className="library-book-spine">
                          <div className="library-book-title-vertical">
                            {book.title}
                          </div>
                          {isFavorite && <div className="library-favorite-mark">★</div>}
                        </div>
                        <div className="library-book-pages"></div>
                        <div className="library-book-texture"></div>
                      </div>
                    );
                  })}
                  {/* Add decorative bookends if there are books */}
                  {filteredFacts.length > 0 && <div className="library-bookend library-bookend-left"></div>}
                </div>
              </div>
              
              {/* Bottom shelf with filtered books from second half of the filtered collection */}
              <div className="library-section">
                <div className="library-shelf-label">Special Collection</div>
                <div className="library-shelf bottom-shelf">
                  {filteredFacts.slice(Math.ceil(filteredFacts.length / 2)).map(book => {
                    const isFavorite = favoriteBookIds.includes(book.id);
                    
                    return (
                      <div 
                        key={book.id}
                        className={`library-book ${selectedBookId === book.id ? "open" : ""}`}
                        style={{ 
                          backgroundColor: book.color,
                          borderRight: `2px solid ${selectedBookId === book.id ? "#fff3b0" : "#d1d5db"}`,
                          height: `${125 + Math.random() * 25}px` // Varied heights for realism
                        }}
                        onClick={() => handleBookClick(book.id)}
                      >
                        <div className="library-book-spine">
                          <div className="library-book-title-vertical">
                            {book.title}
                          </div>
                          {isFavorite && <div className="library-favorite-mark">★</div>}
                        </div>
                        <div className="library-book-pages"></div>
                        <div className="library-book-texture"></div>
                      </div>
                    );
                  })}
                  {/* Add decorative items if there are books */}
                  {filteredFacts.length > 0 && (
                    <>
                      <div className="library-bookend library-bookend-right"></div>
                      <div className="library-decorative-plant"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* If no books are found */}
            {filteredFacts.length === 0 && (
              <div className="library-empty">
                <p>No books found in the library matching "{searchTerm}"</p>
                <button 
                  className="library-button"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
          
          {/* Reading Area with book and floor lamp */}
          <div className="library-reading-area" ref={readingAreaRef}>
            {/* Open Book Content - moved before lamp to ensure correct layering */}
            {selectedBookId && selectedBook && (
              <div className={`library-open-book ${isLampOn ? "illuminated" : "dimmed"}`}>
                <div className="library-book-pages">
                  <div className="library-book-page library-book-left-page">
                    <div className="library-book-metadata">
                      <h3 className="library-book-meta-title">{selectedBook.title}</h3>
                      <div className="library-book-meta-category">
                        {getCategoryName(selectedBook.category)}
                      </div>
                      <div className="library-book-actions">
                        <button 
                          className={`library-favorite-button ${favoriteBookIds.includes(selectedBook.id) ? "active" : ""}`}
                          onClick={() => toggleFavorite(selectedBook.id)}
                        >
                          {favoriteBookIds.includes(selectedBook.id) ? "★ Remove Favorite" : "☆ Add to Favorites"}
                        </button>
                        
                        <button 
                          className="library-close-button"
                          onClick={() => setSelectedBookId(null)}
                        >
                          Close Book
                        </button>

                        {/* Knowledge game button */}
                        <Link 
                          to="/acrostic-puzzles" 
                          className="library-game-button"
                        >
                          Knowledge Test
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="library-book-page library-book-right-page">
                    <div className="library-book-content">
                      <p className="library-book-text">
                        {searchTerm ? highlightMatch(selectedBook.content) : selectedBook.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Floor lamp on the right side - positioned after book content to layer correctly */}
            <div 
              className={`library-floor-lamp ${isLampOn ? "on" : "off"} ${lampFlicker ? "flickering" : ""}`}
              onClick={toggleLamp}
              ref={lampRef}
            >
              <div className="library-lamp-base"></div>
              <div className="library-lamp-pole"></div>
              <div className="library-lamp-shade"></div>
              {isLampOn && <div className="library-lamp-glow"></div>}
            </div>
            
            {/* Reading prompt when no book is selected */}
            {!selectedBookId && (
              <div className={`library-reading-prompt ${isLampOn ? "illuminated" : "dimmed"}`}>
                <p>{filteredFacts.length > 0 ? "Select a book from the shelves to read" : "No books matching your search"}</p>
                {!isLampOn && (
                  <button 
                    className="library-button"
                    onClick={() => setIsLampOn(true)}
                  >
                    Turn On Lamp
                  </button>
                )}
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeLibrary;