import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./driver-profile.css";

// ✅ SAME BASE URL USED EVERYWHERE
const BASE_URL = "http://localhost:8080/";

// 🎨 Team theme colors
const TEAM_THEME = {
  Ferrari: "linear-gradient(135deg,#7b0000,#c40000)",
  McLaren: "linear-gradient(135deg,#ff7a00,#c85a00)",
  Mercedes: "linear-gradient(135deg,#0a3d3a,#00d2be)",
  "Red Bull Racing": "linear-gradient(135deg,#060e2b,#1e41ff)",
  "Aston Martin": "linear-gradient(135deg,#00352f,#006f62)",
  Alpine: "linear-gradient(135deg,#003b7a,#0090ff)",
  Williams: "linear-gradient(135deg,#002a7a,#005aff)",
  Haas: "linear-gradient(135deg,#6b6f72,#b6babd)",
  "Kick Sauber": "linear-gradient(135deg,#004b2f,#00ff87)",
  Sauber: "linear-gradient(135deg,#004b2f,#00ff87)",
  RB: "linear-gradient(135deg,#121e2b,#2b4562)",
  "Visa Cash App RB": "linear-gradient(135deg,#121e2b,#2b4562)",
};

const DriverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchDriverData();
    }
  }, [id]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      setError("");

      // ===== DRIVER =====
      const driverRes = await api.get(`/drivers/${id}`);
      setDriver(driverRes.data);

      // ===== STATS (OPTIONAL) =====
      try {
        const statsRes = await api.get(`/driver-stats/driver/${id}`);
        setStats(statsRes.data || []);
      } catch {
        setStats([]);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load driver details");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="driver-profile-page">
        <div className="loading">Loading driver profile...</div>
      </div>
    );
  }

  // ===== ERROR =====
  if (error || !driver) {
    return (
      <div className="driver-profile-page">
        <div className="error">{error || "Driver not found"}</div>
        <button onClick={() => navigate("/drivers")} className="back-btn">
          ← Back to Drivers
        </button>
      </div>
    );
  }

  const heroBg =
    TEAM_THEME[driver.team?.name] ||
    "linear-gradient(135deg,#111,#000)";

  return (
    <div className="driver-profile-page">
     

      {/* ===== HERO ===== */}
     <section className="driver-hero" style={{ background: heroBg }}>
  <div className="hero-container">

    {/* LEFT CONTENT */}
    <div className="hero-left">
      <span className="driver-first">{driver.firstName}</span>
      <h1 className="driver-last">{driver.lastName}</h1>

      <div className="hero-meta">
        <span>{driver.nationality}</span>
        {driver.team && (
          <>
            <span> | </span>
            <span
              className="team-link"
              onClick={() => navigate(`/teams/${driver.team.id}`)}
            >
              {driver.team.name}
            </span>
            <span> | {driver.driverNumber}</span>
          </>
        )}
      </div>
    </div>

    {/* BIG NUMBER BG */}
    <div className="hero-number">{driver.driverNumber}</div>

    {/* RIGHT IMAGE */}
    {driver.profileImage && (
      <img
        className="hero-image"
        src={BASE_URL + driver.profileImage}
        alt={`${driver.firstName} ${driver.lastName}`}
      />
    )}
  </div>
</section>

      {/* ===== STATS ===== */}
      <section className="stats-section">

        <div className="season-stats">
          <h2>2026 Season</h2>
          <div className="stats-grid">
            <div><span>Grands Prix</span><strong>0</strong></div>
            <div><span>Wins</span><strong>0</strong></div>
            <div><span>Podiums</span><strong>0</strong></div>
            <div><span>Poles</span><strong>0</strong></div>
            <div><span>Fastest Laps</span><strong>0</strong></div>
            <div><span>DNFs</span><strong>0</strong></div>
          </div>
        </div>

        <div className="career-stats">
          <h2>Career Stats</h2>
          <ul>
            <li><span>Grands Prix</span><strong>{stats.length * 20}</strong></li>
            <li><span>Career Points</span><strong>1430</strong></li>
            <li><span>Wins</span><strong>44</strong></li>
            <li><span>Podiums</span><strong>44</strong></li>
            <li><span>Poles</span><strong>16</strong></li>
            <li><span>World Championships</span><strong>1</strong></li>
            <li><span>DNFs</span><strong>13</strong></li>
          </ul>
        </div>

      </section>
    </div>
  );
};

export default DriverProfile;
