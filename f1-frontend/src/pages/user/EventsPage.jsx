import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./events-page.css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events/available");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-container">
        <h1 className="page-title">F1 EVENTS & TICKETS</h1>
        
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3 className="event-name">{event.name}</h3>
                <div className="event-category">{event.category}</div>
              </div>
              
              <div className="event-details">
                <p className="event-description">{event.description}</p>
                <div className="event-info">
                  <div className="info-item">
                    <span className="label">Date:</span>
                    <span className="value">{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Venue:</span>
                    <span className="value">{event.venue}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Price:</span>
                    <span className="value price">₹{event.ticketPrice}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Available Seats:</span>
                    <span className="value">{event.availableSeats}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="book-ticket-btn"
                onClick={() => navigate(`/events/${event.id}/book`)}
              >
                Book Tickets
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}