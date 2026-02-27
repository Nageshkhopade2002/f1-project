import { useEffect, useState, useMemo } from "react";
import { getScheduleByYear } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./schedule.css";

export default function Schedule2026() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getScheduleByYear(2026).then(setEvents);
  }, []);

  const nextRace = useMemo(() => {
    const today = new Date();
    return events
      .filter((e) => e.eventType !== "TESTING" && new Date(e.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
  }, [events]);

  return (
    <div className="schedule-page">
      {/* ================= HEADER ================= */}
      <div className="schedule-header">
        <h1 className="schedule-title">
          2026 FIA FORMULA ONE WORLD CHAMPIONSHIP™ <br /> RACE CALENDAR
        </h1>
      </div>

      {/* ================= HERO ================= */}
      {nextRace && (
        <div
          className="f1-hero"
          onClick={() => navigate(`/race/${nextRace.id}`)}
        >
          <div className="f1-hero-content">
            <span className="hero-badge">NEXT RACE</span>
            <h1>{nextRace.raceName}</h1>
            <h3>{nextRace.circuit.country}</h3>
            <p>
              {new Date(nextRace.startDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
              })}{" "}
              –{" "}
              {new Date(nextRace.endDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
              })}
            </p>
          </div>

          {nextRace.circuit.trackOutline && (
            <img
              src={`http://localhost:8080${nextRace.circuit.trackOutline}`}
              className="f1-hero-track"
              alt="track"
            />
          )}
        </div>
      )}

      {/* ================= UPCOMING ================= */}
      <div className="upcoming-section">
        <h3 className="upcoming-title">UPCOMING</h3>

        <div className="f1-upcoming-row">
          {events
            .filter(
              (e) =>
                e.eventType !== "TESTING" &&
                new Date(e.startDate) >= new Date()
            )
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 2)
            .map((e) => (
              <div
                key={e.id}
                className="f1-mini-card"
                onClick={() => navigate(`/race/${e.id}`)}
                style={{
                  backgroundImage: e.circuit.trackImage
                    ? `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.95)), url(http://localhost:8080${e.circuit.trackImage})`
                    : "linear-gradient(180deg, #111, #000)",
                }}
              >
                <span className="mini-type">{`ROUND ${e.roundNumber}`}</span>

                <h4>{e.circuit.country}</h4>
                <p>{e.raceName}</p>

                <span className="mini-date">
                  {new Date(e.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="schedule-grid">
        {events.map((e) => (
          <div
            key={e.id}
            className={`race-card ${e.eventType === "TESTING" ? "testing" : ""}`}
            onClick={() => navigate(`/race/${e.id}`)}
            style={{
              backgroundImage: e.circuit.trackImage
                ? `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.95)), url(http://localhost:8080${e.circuit.trackImage})`
                : "linear-gradient(180deg, #111, #000)",
            }}
          >
            <span className="round">
              {e.eventType === "TESTING" ? "TESTING" : `ROUND ${e.roundNumber}`}
            </span>

            <h2>{e.circuit.country}</h2>
            <p className="race-name">{e.raceName.toUpperCase()} 2026</p>

            <div className="race-bottom">
              <span>
                {new Date(e.startDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                –{" "}
                {new Date(e.endDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
              {/* {e.eventType !== "TESTING" && (
                <button 
                  className="book-tickets-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/race/${e.id}/tickets`);
                  }}
                >
                  Book Tickets
                </button>
              )} */}
            </div>

            {/* 🔥 TRACK OUTLINE WATERMARK */}
            {e.circuit.trackOutline && (
              <img
                src={`http://localhost:8080${e.circuit.trackOutline}`}
                className="track-outline"
                alt="track outline"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
