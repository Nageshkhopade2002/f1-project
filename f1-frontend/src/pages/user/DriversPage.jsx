import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./drivers-page.css";

const API = "http://localhost:8080/api/drivers";
const BASE_URL = "http://localhost:8080/";

const TEAM_THEME = {
  Ferrari: { gradient: "linear-gradient(135deg,#7b0000,#c40000)" },
  McLaren: { gradient: "linear-gradient(135deg,#ff7a00,#c85a00)" },
  Mercedes: { gradient: "linear-gradient(135deg,#0a3d3a,#00d2be)" },
  "Red Bull Racing": { gradient: "linear-gradient(135deg,#060e2b,#1e41ff)" },
  "Aston Martin": { gradient: "linear-gradient(135deg,#00352f,#006f62)" },
  Alpine: { gradient: "linear-gradient(135deg,#003b7a,#0090ff)" },
  Williams: { gradient: "linear-gradient(135deg,#002a7a,#005aff)" },
  Haas: { gradient: "linear-gradient(135deg,#6b6f72,#b6babd)" },

  /* Sauber variations */
  "Kick Sauber": { gradient: "linear-gradient(135deg,#004b2f,#00ff87)" },
  Sauber: { gradient: "linear-gradient(135deg,#004b2f,#00ff87)" },
  "Stake F1 Team": { gradient: "linear-gradient(135deg,#004b2f,#00ff87)" },

  /* RB variations */
  RB: { gradient: "linear-gradient(135deg,#121e2b,#2b4562)" },
  "Visa Cash App RB": { gradient: "linear-gradient(135deg,#121e2b,#2b4562)" },
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API).then(res => setDrivers(res.data));
  }, []);

  const groupedByTeam = drivers.reduce((acc, d) => {
    const team = d.team?.name || "Unknown";
    acc[team] = acc[team] || [];
    acc[team].push(d);
    return acc;
  }, {});

  return (
    <div className="drivers-page">
        {/* HERO SECTION */}
  <section className="drivers-hero">
    <h1 className="drivers-title">F1 DRIVERS 2026</h1>
    <h3>Find the current Formula 1 drivers for the 2026 season</h3>
  </section>
<br /><br />
      {Object.entries(groupedByTeam).map(([team, teamDrivers]) => (
        <div key={team} className="team-row">
          {teamDrivers.map(driver => (
            <div
              key={driver.id}
              className="f1-driver-card"
              style={{
                background:
                  TEAM_THEME[team]?.gradient ||
                  "linear-gradient(135deg,#333,#111)",
              }}
              onClick={() => navigate(`/drivers/${driver.id}`)}
            >
              {/* LEFT SIDE */}
              <div className="card-left">
                <h2>
                  {driver.firstName}
                  <br />
                  <span>{driver.lastName}</span>
                </h2>

                <p className="team-name">{team}</p>

                <div className="driver-number">
                  {driver.driverNumber}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="card-right">
                <img
                  src={BASE_URL + driver.profileImage}
                  alt={driver.firstName}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
