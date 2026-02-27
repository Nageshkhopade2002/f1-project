import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthProvider";
import { getScheduleByYear } from "../../services/api";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import "./user-dashboard.css";

// Dashboard component for authenticated users
export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management for dashboard data
  const [nextRaces, setNextRaces] = useState([]);
  const [teams, setTeams] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeHero, setActiveHero] = useState(0); // Missing state for hero slides
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoDurations, setVideoDurations] = useState({});
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('dashboardTheme');
    if (savedMode) {
      setIsDarkMode(savedMode === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('dashboardTheme', newMode ? 'dark' : 'light');
  };

  // Fetch next 3 upcoming races for the current year
  const loadNextRaces = useCallback(async () => {
    try {
      const data = await getScheduleByYear(2026);
      const today = new Date();

      const upcoming = data
        .filter((race) => new Date(race.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 3);

      setNextRaces(upcoming);
    } catch (error) {
      console.error("Error loading next races:", error);
    }
  }, []);

  // Fetch top 3 teams for dashboard display
  const loadTeams = useCallback(async () => {
    try {
      const response = await api.get("/teams");
      setTeams(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  }, []);

  // Fetch top 3 drivers for dashboard display
  const loadDrivers = useCallback(async () => {
    try {
      const response = await api.get("/drivers");
      setDrivers(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error loading drivers:", error);
    }
  }, []);

  // Fetch latest news articles
  const loadNews = useCallback(async () => {
    try {
      const response = await api.get("/news/top3");
      setNews(response.data);
    } catch (error) {
      console.error("Dashboard News Error", error);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // Load all dashboard data on component mount
  useEffect(() => {
    loadNextRaces();
    loadTeams();
    loadDrivers();
    loadNews();
  }, [loadNextRaces, loadTeams, loadDrivers, loadNews]);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Team color themes for consistent styling (optional, not used in current JSX)
  const TEAM_THEME = {
    Ferrari: { gradient: "linear-gradient(135deg,#7b0000,#c40000)" },
    McLaren: { gradient: "linear-gradient(135deg,#ff7a00,#c85a00)" },
    Mercedes: { gradient: "linear-gradient(135deg,#0a3d3a,#00d2be)" },
    "Red Bull Racing": { gradient: "linear-gradient(135deg,#060e2b,#1e41ff)" },
    "Aston Martin": { gradient: "linear-gradient(135deg,#00352f,#006f62)" },
    Alpine: { gradient: "linear-gradient(135deg,#003b7a,#0090ff)" },
    Williams: { gradient: "linear-gradient(135deg,#002a7a,#005aff)" },
    Haas: { gradient: "linear-gradient(135deg,#6b6f72,#b6babd)" },
    RB: { gradient: "linear-gradient(135deg,#121e2b,#2b4562)" },
    "Visa Cash App RB": { gradient: "linear-gradient(135deg,#121e2b,#2b4562)" },
    Sauber: { gradient: "linear-gradient(135deg,#004b2f,#00ff87)" },
    "Kick Sauber": { gradient: "linear-gradient(135deg,#004b2f,#00ff87)" },
    "Stake F1 Team": { gradient: "linear-gradient(135deg,#004b2f,#00ff87)" },
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // Highlight images (1 to 10)
  const highlightImages = Array.from({ length: 10 }, (_, i) => i + 1);

  // Scroll to news section function
  const scrollToNews = () => {
    const newsSection = document.querySelector('.latest-news-section');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToVideos = () => {
    const videoSection = document.querySelector('.featured-videos-section');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const BASE_VIDEO_URL = `${API_BASE_URL}/uploads/FEATURED VIDEO`;

  const featuredVideos = [
    {
      id: 1,
      type: "video",
      src: `${BASE_VIDEO_URL}/Extended_Highlights_2025_Sao_Paulo_Grand_Prix_720P.mp4`,
      title: "Extended Highlights 2025 Sao Paulo Grand Prix",
      desc: "Full race highlights and key moments from the Brazilian Grand Prix",
    },
    {
      id: 2,
      type: "video",
      src: `${BASE_VIDEO_URL}/Day_3_Highlights_2026_Bahrain_Pre-Season_Test_2_1080P.mp4`,
      title: "Day 3 Highlights 2026 Bahrain Pre-Season Test 2",
      desc: "Third day testing action from Bahrain International Circuit",
    },
    {
      id: 3,
      type: "video",
      src: `${BASE_VIDEO_URL}/2025_vs_2026_What_s_Changed_In_The_2026_Cars_720P.mp4`,
      title: "2025 vs 2026 What's Changed In The 2026 Cars",
      desc: "Complete technical analysis of new regulations and car changes",
    },
    {
      id: 4,
      type: "video",
      src: `${BASE_VIDEO_URL}/Day_2_Highlights_2026_Bahrain_Pre-Season_Test_2_720P.mp4`,
      title: "Day 2 Highlights 2026 Bahrain Pre-Season Test 2",
      desc: "Second day testing highlights and performance analysis",
    },
    {
      id: 5,
      type: "video",
      src: `${BASE_VIDEO_URL}/Day_1_Highlights_2026_Bahrain_Pre-Season_Test_2_720P.mp4`,
      title: "Day 1 Highlights 2026 Bahrain Pre-Season Test 2",
      desc: "Opening day action and first impressions from winter testing",
    },
    {
      id: 6,
      type: "video",
      src: `${BASE_VIDEO_URL}/Extended_Highlights_2025_British_Grand_Prix_720P.mp4`,
      title: "Extended Highlights 2025 British Grand Prix",
      desc: "Complete race highlights from the iconic Silverstone Circuit",
    },
  ];

  const heroSlides = [
    {
      id: 1,
      image: `${API_BASE_URL}/uploads/hero.avif`,
      title: "Hamilton feels 'winning mentality' at Ferrari 'more than ever'",
      newsId: 21,
    },
    {
      id: 2,
      image: `${API_BASE_URL}/uploads/hero%201.avif`,
      title:
        " “Norris targets success in 2026 as reigning World Champion.” ",
      newsId: 20,
    },
  ];

  const [videoScrollPosition, setVideoScrollPosition] = useState(0);

  const scrollVideos = (direction) => {
    const container = document.getElementById('video-scroll-track');
    const scrollAmount = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Hero click handler
  const openHeroNews = (newsId) => {
    const found = news.find((n) => n.id === newsId);
    if (found) {
      navigate(`/news/${newsId}`, { state: { newsItem: found } });
    } else {
      navigate(`/news/${newsId}`);
    }
  };

  // Handle video metadata load
  const handleVideoMetadata = (id, duration) => {
    setVideoDurations((prev) => ({
      ...prev,
      [id]: duration,
    }));
  };

  return (
    <div className={`user-dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
    


      {/* Hero Section */}
      <section className="hero-section">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === activeHero ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <h1
                className="hero-title clickable"
                onClick={() => openHeroNews(slide.newsId)}
              >
                {slide.title}
              </h1>
<span
  className="hero-read clickable"
  onClick={() => openHeroNews(slide.newsId)}
>
  READ →
</span>
            </div>
          </div>
        ))}

        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={i === activeHero ? "dot active" : "dot"}
              onClick={() => setActiveHero(i)}
            />
          ))}
        </div>
      </section>

      {/* Quick navigation links */}
      <section className="quick-nav-section">
        <div className="quick-nav-container">
          <div className="quick-nav-card" onClick={() => navigate("/schedule/2026")}>
            <span>2026 SCHEDULE</span>
            <div className="nav-external-icon">↗</div>
          </div>
          <div className="quick-nav-card" onClick={() => navigate("/standings")}>
            <span>2025 STANDINGS</span>
            <div className="nav-external-icon">↗</div>
          </div>
          <div className="quick-nav-card" onClick={() => navigate("/news")}>
            <span>LATEST NEWS</span>
            <div className="nav-external-icon">↗</div>
          </div>
          <div className="quick-nav-card" onClick={scrollToVideos}>
            <span>LATEST VIDEO</span>
            <div className="nav-external-icon">↗</div>
          </div>
        </div>
      </section>

      {/* Next race section */}
      <section className="explore-f1-section">
        {nextRaces[0] && (
          <div className="explore-f1-card">
            <div className="explore-text">
              <h2>Next Race</h2>
              <p>
                {nextRaces[0].circuit?.country} - {nextRaces[0].raceName}
              </p>
              <p>
                Round {nextRaces[0].roundNumber} • {new Date(nextRaces[0].startDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
              </p>
              <button onClick={() => navigate(`/race/${nextRaces[0].id}`)}>GO TO RACE →</button>
            </div>

            <div className="explore-image">
              <img
                src={nextRaces[0].circuit?.trackImage 
                  ? `${API_BASE_URL}${nextRaces[0].circuit.trackImage}`
                  : `${API_BASE_URL}/uploads/race.jpg`}
                alt="Next Race"
              />
            </div>
          </div>
        )}
      </section>

      {/* Featured Videos Section */}
      <section className="featured-videos-section">
        <div className="featured-header">
          <h2 className="section-heading">
            <span className="red-line"></span>FEATURED VIDEO
          </h2>
          <div className="featured-actions">
            <button className="nav-btn" onClick={() => scrollVideos('left')}>‹</button>
            <button className="nav-btn" onClick={() => scrollVideos('right')}>›</button>
          </div>
        </div>

        <div className="featured-video-scroll-wrapper">
          <div className="featured-video-track" id="video-scroll-track">
            {featuredVideos.map((v) => (
              <div
                key={v.id}
                className="featured-video-card"
                onClick={() => setActiveVideo(v.src)}
              >
                <div className="video-container">
                  <video
                    src={v.src}
                    muted
                    preload="metadata"
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                    onLoadedMetadata={(e) => handleVideoMetadata(v.id, e.target.duration)}
                  />
                  <div className="video-overlay">
                    <span className="play-btn">▶</span>
                    <span className="video-duration">
                      {formatDuration(videoDurations[v.id])}
                    </span>
                  </div>
                </div>

                <div className="video-text">
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore F1 sections */}
      <section className="explore-f1-section">
        <div className="explore-f1-card">
          <div className="explore-text">
            <h2>Drivers</h2>
            <p>
              Explore all Formula 1 drivers, profiles, stats, and career
              highlights.
            </p>
            <button onClick={() => navigate("/drivers")}>GO TO DRIVERS →</button>
          </div>

          <div className="explore-image">
            <img
              src={`${API_BASE_URL}/uploads/drivers.avif`}
              alt="Drivers"
            />
          </div>
        </div>

        <div className="explore-f1-card reverse">
          <div className="explore-text">
            <h2>Teams</h2>
            <p>
              Discover Formula 1 teams, constructors history, cars, and
              championships.
            </p>
            <button onClick={() => navigate("/teams")}>GO TO TEAMS →</button>
          </div>

          <div className="explore-image">
            <img src={`${API_BASE_URL}/uploads/race.avif`} alt="Teams" />
          </div>
        </div>

        <div className="explore-f1-card">
          <div className="explore-text">
            <h2>Races</h2>
            <p>
              View race calendar, circuits, locations, and full race weekend
              details.
            </p>
            <button onClick={() => navigate("/schedule/2026")}>
              GO TO RACES →
            </button>
          </div>

          <div className="explore-image">
            <img src={`${API_BASE_URL}/uploads/race.jpg`} alt="Races" />
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <h2 className="section-heading"><span className="red-line"></span>HIGHLIGHTS</h2>

        <div className="highlights-wrapper">
          {/* LEFT ARROW */}
          <button
            className="highlight-arrow left"
            onClick={() =>
              document
                .getElementById("highlights-track")
                .scrollBy({ left: -450, behavior: "smooth" })
            }
          >
            ‹
          </button>

          {/* IMAGE TRACK */}
          <div className="highlights-track" id="highlights-track">
            {highlightImages.map((img) => (
              <div
                key={img}
                className="highlight-card"
                onClick={() =>
                  setActiveHighlight(
                    `${API_BASE_URL}/uploads/highlights/${img}.jpg`
                  )
                }
              >
                <img
                  src={`${API_BASE_URL}/uploads/highlights/${img}.jpg`}
                  alt={`highlight-${img}`}
                />
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            className="highlight-arrow right"
            onClick={() =>
              document
                .getElementById("highlights-track")
                .scrollBy({ left: 450, behavior: "smooth" })
            }
          >
            ›
          </button>
        </div>

        <div className="highlight-indicator">
          {/* Optional: Add indicator text if needed */}
        </div>
      </section>

      {/* Latest news section */}
      <section className="latest-news-section">
        <h2 className="section-heading"><span className="red-line"></span>LATEST NEWS</h2>

        {newsLoading ? (
          <p className="text-center text-muted">Loading news...</p>
        ) : (
          <>
            <div className="latest-news-grid">
              {/* Featured news article */}
              {news[0] && (
                <div
                  className="featured-news"
                  onClick={() => navigate(`/news/${news[0].id}`, { state: { newsItem: news[0] } })}
                >
                  <img
                    src={`${API_BASE_URL}${news[0].imageUrl}`}
                    alt={news[0].title}
                    className="news-image"
                  />

                  <div className="news-overlay">
                    <span className="news-date">
                      {new Date(news[0].createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <h3>{news[0].title}</h3>
                    <span className="news-read">READ</span>
                  </div>
                </div>
              )}

              {/* Side news articles */}
              <div className="side-news-grid">
                {news.slice(1, 3).map((article) => (
                  <div
                    key={article.id}
                    className="side-news-card"
                    onClick={() => navigate(`/news/${article.id}`, { state: { newsItem: article } })}
                  >
                    <img
                      src={`${API_BASE_URL}${article.imageUrl}`}
                      alt={article.title}
                      className="news-image"
                    />

                    <div className="news-overlay small">
                      <span className="news-date">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <h4>{article.title}</h4>
                      <span className="news-read">READ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="see-all-news">
              {/* Optional: Add "View All" button */}
            </div>
          </>
        )}
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveVideo(null)}>
              ✕
            </button>
            <video src={activeVideo} controls autoPlay />
          </div>
        </div>
      )}

      {/* Highlight Modal */}
      {activeHighlight && (
        <div className="highlight-modal" onClick={() => setActiveHighlight(null)}>
          <span className="highlight-close" onClick={() => setActiveHighlight(null)}>✕</span>
          <img src={activeHighlight} alt="highlight-full" />
        </div>
      )}

      {/* Theme Toggle Footer */}
      <div className="theme-toggle-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}