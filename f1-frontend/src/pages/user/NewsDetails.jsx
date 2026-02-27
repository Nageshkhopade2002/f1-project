import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import './news-details.css';

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.newsItem || null);
  const [loading, setLoading] = useState(!article);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!article) {
      loadArticle();
    }
  }, [id, article]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/news/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error loading article:', error);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="news-details-container">
        <div className="loading">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="news-details-container">
        <div className="error">{error || 'Article not found'}</div>
      </div>
    );
  }

  return (
    <div className="news-details-container">
      <div className="news-details-header">
        <button className="back-btn" onClick={() => navigate('/news')}>
          ← Back to News
        </button>
      </div>

      <div className="news-details-content">
        <div className="news-meta">
          <span className="news-date">{formatDate(article.createdAt)}</span>
          {article.source && <span className="news-source">Source: {article.source}</span>}
        </div>

        <h1 className="news-title">{article.title}</h1>

        <div className="news-image-container">
          <img 
            src={`http://localhost:8080${article.imageUrl}`} 
            alt={article.title}
            className="news-image"
          />
        </div>

        <div className="news-content">
          {article.description && (
            <div className="news-description">
              {article.description}
            </div>
          )}

          {article.content && (
            <div className="news-full-content">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}