import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRaceDetails } from "../../services/api";
import api from "../../services/api";
import "./race-details.css";

export default function RaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("MY");
  const [ticketEvent, setTicketEvent] = useState(null);

  useEffect(() => {
    getRaceDetails(id).then(setData);
    fetchTicketEvent();
  }, [id]);

  const fetchTicketEvent = async () => {
    try {
      const response = await api.get("/events/available");
      // Try to match with race name
      const event = response.data.find(e => 
        e.name.toLowerCase().includes("grand prix") ||
        e.name.toLowerCase().includes("practice")
      );
      setTicketEvent(event);
    } catch (error) {
      console.error("Error fetching ticket events:", error);
    }
  };

  if (!data) return <p className="loading">Loading...</p>;

  const formatTime = (utcTime) => {
    if (!utcTime) return "TBC";
    const date = new Date(utcTime + "Z");

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone:
        mode === "TRACK"
          ? data.circuit.timezone
          : Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  const trackImage = data.circuit.trackImage
    ? `http://localhost:8080${data.circuit.trackImage}`
    : null;

  const trackOutline = data.circuit.trackOutline
    ? `http://localhost:8080${data.circuit.trackOutline}`
    : null;

  return (
    <div className="f1-page">

      {/* HERO */}
      <div
        className="f1-hero"
        style={{ backgroundImage: `url(${trackImage})` }}
      >
        <div className="f1-hero-overlay">
          <h1>{data.race.raceName}</h1>
          <p>{data.circuit.name}, {data.circuit.country}</p>
        </div>
      </div>

      {/* CIRCUIT SECTION */}
      <div className="circuit-section">

        {/* LEFT – Outline */}
        <div className="circuit-image-wrapper">
          {trackOutline && (
            <img
              src={trackOutline}
              alt="Track Outline"
              className="track-outline-img"
            />
          )}
        </div>
<div className="circuit-stats with-lines">
  <div className="stat full">
    <span>Circuit Length</span>
    <h3>{data.circuit.circuitLengthKm} km</h3>
  </div>

  <div className="stat">
    <span>First Grand Prix</span>
    <h3>2021</h3>
  </div>

  <div className="stat">
    <span>Number of Laps</span>
    <h3>{data.circuit.numberOfLaps}</h3>
  </div>

  <div className="stat">
    <span>Fastest Lap</span>
    <h3>1:30.734</h3>
    <small>Lewis Hamilton (2021)</small>
  </div>

  <div className="stat">
    <span>Race Distance</span>
    <h3>{data.circuit.raceDistanceKm} km</h3>
  </div>
</div>
</div> 

      {/* SCHEDULE */}
      <div className="schedule-section">
        <div className="schedule-header">
          <h2>SCHEDULE</h2>

          <div className="toggle">
            <button
              className={mode === "MY" ? "active" : ""}
              onClick={() => setMode("MY")}
            >
              My Time
            </button>
            <button
              className={mode === "TRACK" ? "active" : ""}
              onClick={() => setMode("TRACK")}
            >
              Track Time
            </button>
          </div>
        </div>

        <div className="schedule-card">
          {data.sessions.map((s, index) => (
            <div className="schedule-row" key={s.id}>
              <div className="date-col">
                <span>APR</span>
                <strong>{17 + index}</strong>
              </div>
              <div className="session-name">{s.sessionName}</div>
              <div className="session-time">
                {formatTime(s.startTimeUtc)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TICKET BOOKING SECTION */}
      {ticketEvent && (
        <div className="ticket-booking-section">
          <div className="ticket-card">
            <h2>🎫 Book Your Tickets</h2>
            <div className="ticket-info">
              <div className="ticket-details">
                <h3>{ticketEvent.name}</h3>
                <p>{ticketEvent.description}</p>
                <div className="ticket-meta">
                  <span className="price">₹{ticketEvent.ticketPrice}</span>
                  <span className="seats">{ticketEvent.availableSeats} seats available</span>
                </div>
              </div>
              <button 
                className="book-now-btn"
                onClick={() => navigate(`/events/${ticketEvent.id}/book`)}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
