import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PersonalizationHub.css';

const PersonalizationHub = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ageRange: '',
    trimester: '',
    concern: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(6);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.querySelector('.stars-container');
      if (!starsContainer) return;
      starsContainer.innerHTML = '';
      
      // Create 150 stars for a more immersive effect
      for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        // Random star sizes for more depth
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Different opacities
        star.style.opacity = Math.random() * 0.8 + 0.2;
        
        starsContainer.appendChild(star);
      }
    };

    createStars();
    window.addEventListener('resize', createStars);

    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, []);

  useEffect(() => {
    if (!formData.trimester || !formData.concern || !formData.ageRange) return;

    const trimesterNumber =
      formData.trimester.includes("1") ? "1" :
      formData.trimester.includes("2") ? "2" :
      formData.trimester.includes("3") ? "3" : "";

    const ageMap = {
      "Under 25": "20-25",
      "25-30": "26–30",
      "30-35": "30-35",
      "35+": "35+"
    };

    const query = new URLSearchParams({
      trimester: trimesterNumber,
      age_range: ageMap[formData.ageRange] || '',
      concern: formData.concern.toLowerCase().replace(" ", "_")
    });

    fetch(`https://iteration3.maternalshield.me/api/info-cards/?${query}`, {
<<<<<<< HEAD
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
      .then(res => res.json())
=======
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors'
})
.then(res => res.json())
>>>>>>> 45b016d3b1e81a0b89e86af26908c2212a65cf8d
      .then(data => {
        const enriched = data.map(item => ({
          ...item,
          relevanceScore: item.relevance_score || 0,
          tags: [
            item.trimester === "1" ? "First Trimester" : item.trimester === "2" ? "Second Trimester" : "Third Trimester",
            formData.concern,
            item.age_group
          ],
          source: item.source_name,
          date: new Date(item.created_at).toLocaleDateString()
        }));
        setArticles(enriched);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
      });
  }, [formData]);

  const filteredArticles = articles
    .filter(article => {
      if (
        selectedCategory !== 'all' &&
        !(
          (selectedCategory === 'Heatwave' && article.heat_sensitive) ||
          (selectedCategory === 'Air Pollution' && article.pollution_sensitive)
        )
      ) {
        return false;
      }
      if (searchTerm &&
        !article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      ) return false;
      return true;
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const resetForm = () => {
    setFormData({ ageRange: '', trimester: '', concern: '' });
    setStep(1);
    setShowResults(false);
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setShowResults(true);
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className="personalization-content">
      <div className="stars-container"></div>
      <div className="aurora-glow top-left"></div>
      <div className="aurora-glow bottom-right"></div>

      {!showResults ? (
        <div className="single-page">
          <div className="blurred-box">
            <h1 className="hub-title">Personalization Hub</h1>
            <p className="hub-subtitle">
              Help us tailor your experience by selecting your age range, current trimester, and primary concern.
            </p>
            <div className="progress-indicators">
              {["Age", "Trimester", "Concern"].map((label, idx) => (
                <React.Fragment key={label}>
                  {idx > 0 && <div className={`progress-line ${step > idx ? 'active' : ''}`}></div>}
                  <div className="indicator-wrapper">
                    <div className={`step-indicator ${step >= idx + 1 ? 'active' : ''}`}>{idx + 1}</div>
                    <div className="indicator-label">{label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {step === 1 && (
              <div className="step-content fade-in">
                <h2 className="step-title">What is your age range?</h2>
                <div className="option-grid">
                  {["Under 25", "25-30", "30-35", "35+"].map(range => (
                    <button 
                      key={range} 
                      onClick={() => { 
                        setFormData({ ...formData, ageRange: range }); 
                        setTimeout(handleNext, 300); 
                      }} 
                      className={`option-button ${formData.ageRange === range ? 'selected' : ''}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-content fade-in">
                <h2 className="step-title">Which trimester are you in?</h2>
                <div className="option-grid trimester-grid">
                  {["First Trimester", "Second Trimester", "Third Trimester"].map(trimester => (
                    <button 
                      key={trimester} 
                      onClick={() => { 
                        setFormData({ ...formData, trimester }); 
                        setTimeout(handleNext, 300); 
                      }} 
                      className={`option-button trimester-button ${formData.trimester === trimester ? 'selected' : ''}`}
                    >
                      {trimester}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-content fade-in">
                <h2 className="step-title">What are you most concerned about?</h2>
                <div className="option-grid concern-grid">
                  {["Heatwave", "Air Pollution"].map(concern => (
                    <button 
                      key={concern} 
                      onClick={() => { 
                        setFormData({ ...formData, concern }); 
                        setTimeout(handleNext, 300); 
                      }} 
                      className={`option-button concern-button ${formData.concern === concern ? 'selected' : ''}`}
                    >
                      <span className="concern-icon">
                        {concern === "Heatwave" ? "🌡️" : "💨"}
                      </span>
                      {concern}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="back-button-container">
              {step > 1 && 
                <button onClick={handleBack} className="back-button">
                  <span className="back-arrow">←</span> Back
                </button>
              }
            </div>
          </div>
        </div>
      ) : (
        <div className="results-container fade-in">
          <div className="compact-header">
            <div className="header-flex">
              <h2 className="results-title">Your Personalized Resources</h2>
              <div className="selected-profile">
                <span className="profile-pill">{formData.ageRange}</span>
                <span className="profile-pill">{formData.trimester}</span>
                <span className="profile-pill">{formData.concern}</span>
              </div>
              <div className="controls-right">
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                <div className="view-toggle">
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                    aria-label="Grid view"
                  >
                    <span className="icon">▦</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                    aria-label="List view"
                  >
                    <span className="icon">≡</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`articles-container ${viewMode}`}>
            {currentArticles.map((article, index) => (
              <div 
                key={article.id} 
                className="article-card" 
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="article-main-content">
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-summary">{article.summary}</p>
                </div>
                <div className="article-tags">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="article-tag">{tag}</span>
                  ))}
                </div>
                <div className="article-footer">
                  <span className="article-source">{article.source}</span>
                  <a 
                    className="read-button" 
                    href={article.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Read Article
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3 className="no-results-title">No articles found</h3>
              <p className="no-results-text">
                Try adjusting your search terms or filters
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="clear-filters-button"
              >
                Clear Filters
              </button>
            </div>
          )}

          {filteredArticles.length > 0 && (
            <div className="pagination-container">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1}
                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                aria-label="Previous page"
              >
                ←
              </button>
              {[...Array(totalPages).keys()].map(num => (
                <button
                  key={num}
                  onClick={() => paginate(num + 1)}
                  className={`pagination-number ${currentPage === num + 1 ? 'active' : ''}`}
                  aria-label={`Page ${num + 1}`}
                >
                  {num + 1}
                </button>
              ))}
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages}
                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}

          <div className="results-footer">
            <button onClick={resetForm} className="cta-btn">Refine Your Profile</button>
            <Link to="/symptom-tracker" className="symptom-tracker-btn">Visit Symptom Tracker</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationHub;
