import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./news-page.css";

export default function NewsPage() {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Analysis",
    "Technical",
    "Lifestyle & Culture",
    "F1 Unlocked",
    "F2",
    "F3",
    "F1 Academy",
  ];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await api.get("/news/all");
      setNews(response.data);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const newsDate = new Date(date);
    const diffInMinutes = Math.floor((now - newsDate) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) {
      const hrs = Math.floor(diffInMinutes / 60);
      return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    }
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="news-page">
      <div className="news-container">
        <h1 className="news-page-title">LATEST F1 NEWS</h1>

        {/* FILTERS */}
        <div className="news-filters">
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="sort-dropdown">
            <select className="sort-select">
              <option>All</option>
            </select>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="news-loading">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="news-loading">No news articles found.</div>
        ) : (
          <div className="news-grid">
            {/* LEFT COLUMN – 2 BIG CARDS */}
            <div className="news-column left">
              {news.slice(0, 2).map((article, index) => (
                <div
                  key={article.id}
                  className="news-card featured"
                  onClick={() =>
                    navigate(`/news/${article.id}`, {
                      state: { newsItem: article },
                    })
                  }
                >
                  <div className="news-image-container">
                    <img
                      src={`http://localhost:8080${article.imageUrl}`}
                      alt={article.title}
                      className="news-image"
                    />

                    {index === 1 && (
                      <div className="news-tag">TEAM PREVIEWS 2026</div>
                    )}
                  </div>

                  <div className="news-content">
                    <h3 className="news-title">{article.title}</h3>
                    <div className="news-meta">
                      <span className="news-time">
                        {getTimeAgo(article.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN – SMALL CARDS */}
            <div className="news-column right">
              {news.slice(2).map((article) => (
                <div
                  key={article.id}
                  className="news-card small"
                  onClick={() =>
                    navigate(`/news/${article.id}`, {
                      state: { newsItem: article },
                    })
                  }
                >
                  <div className="news-image-container">
                    <img
                      src={`http://localhost:8080${article.imageUrl}`}
                      alt={article.title}
                      className="news-image"
                    />
                  </div>

                  <div className="news-content">
                    <h3 className="news-title">{article.title}</h3>
                    <div className="news-meta">
                      <span className="news-time">
                        {getTimeAgo(article.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
