import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./team-details.css";

// ✅ SAME BASE URL AS TeamsPage (IMPORTANT)
const BASE_URL = "http://localhost:8080/";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadTeamData();
    }
  }, [id]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError("");

      // ===== TEAM =====
      const teamRes = await api.get(`/teams/${id}`);
      setTeam(teamRes.data);

      // ===== DRIVERS (OPTIONAL) =====
      try {
        const driversRes = await api.get(`/drivers/team/${id}`);
        setDrivers(driversRes.data || []);
      } catch {
        setDrivers([]);
      }

      // ===== STATS (OPTIONAL) =====
      try {
        const statsRes = await api.get(`/team-stats/team/${id}`);
        setStats(statsRes.data || []);
      } catch {
        setStats([]);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="team-details-page">
        <div className="loading">Loading team details...</div>
      </div>
    );
  }

  // ===== ERROR =====
  if (error || !team) {
    return (
      <div className="team-details-page">
        <div className="error">{error || "Team not found"}</div>
        <button onClick={() => navigate("/teams")} className="back-btn">
          ← Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="team-details-page">
      <div className="team-container">

        {/* BACK BUTTON */}
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        {/* ===== HEADER ===== */}
        <div className="team-header">
          {team.logoImage && (
            <img
              src={BASE_URL + team.logoImage}
              alt={team.name}
              className="team-logo-large"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <h1>{team.name}</h1>
          <p className="team-base">{team.base}</p>
        </div>

        {/* ===== CAR IMAGE ===== */}
        {team.carImage && (
          <div className="car-section">
            <img
              src={BASE_URL + team.carImage}
              alt="Team Car"
              className="team-car-image"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        {/* ===== INFO ===== */}
        <div className="team-info">
          <div className="info-grid">
            <div><strong>Full Name:</strong> {team.fullName}</div>
            <div><strong>Team Chief:</strong> {team.teamChief}</div>
            <div><strong>Technical Chief:</strong> {team.technicalChief}</div>
            <div><strong>Power Unit:</strong> {team.powerUnit}</div>
            <div><strong>First Entry:</strong> {team.firstEntryYear}</div>
          </div>

          {team.description && (
            <p className="team-description">{team.description}</p>
          )}
        </div>

        {/* ===== DRIVERS ===== */}
        {drivers.length > 0 && (
          <>
            <h2 className="section-title">Drivers</h2>
            <div className="drivers-grid">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="f1-driver-card"
                  onClick={() => navigate(`/drivers/${driver.id}`)}
                >
                  {/* LEFT SIDE */}
                  <div className="card-left">
                    <h2>
                      {driver.firstName}
                      <br />
                      <span>{driver.lastName}</span>
                    </h2>
                    <div className="driver-number">
                      #{driver.driverNumber}
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="card-right">
                    {driver.profileImage && (
                      <img
                        src={BASE_URL + driver.profileImage}
                        alt={`${driver.firstName} ${driver.lastName}`}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== STATS ===== */}
        {stats.length > 0 && (
          <>
            <h2 className="section-title">Season Stats</h2>
            <div className="stats-table-wrapper">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Position</th>
                    <th>Points</th>
                    <th>Wins</th>
                    <th>Podiums</th>
                    <th>Poles</th>
                    <th>Fastest Laps</th>
                    <th>DNFs</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.id}>
                      <td>{s.seasonYear}</td>
                      <td>{s.seasonPosition}</td>
                      <td>{s.seasonPoints}</td>
                      <td>{s.wins}</td>
                      <td>{s.podiums}</td>
                      <td>{s.poles}</td>
                      <td>{s.fastestLaps}</td>
                      <td>{s.dnfs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default TeamDetails;
