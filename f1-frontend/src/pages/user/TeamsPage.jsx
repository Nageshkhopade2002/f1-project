import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./teams-page.css";

const BASE_URL = "http://localhost:8080/";

const TEAM_COLORS = {
  Alpine: "linear-gradient(135deg, #0066ff, #00b4ff)",
  McLaren: "linear-gradient(135deg, #ff7a00, #ff9500)",
  Ferrari: "linear-gradient(135deg, #b30000, #ff1e1e)",
  Mercedes: "linear-gradient(135deg, #00d2be, #007a6c)",
  "Red Bull Racing": "linear-gradient(135deg, #1e41ff, #0b1d4d)",
  "Aston Martin": "linear-gradient(135deg, #006f62, #003f3a)",
  Williams: "linear-gradient(135deg, #005aff, #002a7f)",
  Haas: "linear-gradient(135deg, #9fa3a6, #6b6f72)",
  RB: "linear-gradient(135deg, #2b4562, #1a2a3b)",
  "Kick Sauber": "linear-gradient(135deg, #00ff87, #00994f)",
};

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, driversRes] = await Promise.all([
        api.get("/teams"),
        api.get("/drivers"),
      ]);
      setTeams(teamsRes.data);
      setDrivers(driversRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getTeamDrivers = (teamId) =>
    drivers.filter((d) => d.team?.id === teamId).slice(0, 2);

  return (
    <div className="teams-page">
      <div className="teams-container">
        <h1 className="page-title">F1 TEAMS 2026</h1>

        <div className="teams-grid">
          {teams.map((team) => {
            const teamDrivers = getTeamDrivers(team.id);
            const teamBg = TEAM_COLORS[team.name] || "#333";

            return (
              <div
                key={team.id}
                className="f1-team-card"
                style={{ background: teamBg }}
                onClick={() => navigate(`/teams/${team.id}`)}
              >
                {/* TOP CONTENT */}
                <div className="team-top">
                  <div className="team-header">
                    <h2 className="team-name">{team.name}</h2>

                    {team.logoImage && (
                      <div className="team-logo-circle">
                        <img
                          src={BASE_URL + team.logoImage}
                          alt={team.name}
                        />
                      </div>
                    )}
                  </div>

                  {/* DRIVERS UNDER TEAM NAME */}
                  <div className="team-drivers">
                    {teamDrivers.map((driver) => (
                      <div key={driver.id} className="driver-info">
                        {driver.profileImage && (
                          <img
                            src={BASE_URL + driver.profileImage}
                            alt={driver.firstName}
                            className="driver-avatar"
                          />
                        )}
                        <span>
                          {driver.firstName} {driver.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CAR */}
                {team.carImage && (
                  <div className="team-car">
                    <img
                      src={BASE_URL + team.carImage}
                      alt={`${team.name} car`}
                      className="car-image"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
