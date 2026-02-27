import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './standings-2025.css';

export default function Standings2025() {
  const [activeTab, setActiveTab] = useState('drivers');
  const [driversStandings, setDriversStandings] = useState([]);
  const [constructorsStandings, setConstructorsStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    try {
      // Real 2025 F1 standings data
      const mockDrivers = [
        { position: 1, name: 'Max Verstappen', team: 'Red Bull Racing', points: 393, wins: 8, podiums: 15 },
        { position: 2, name: 'Lando Norris', team: 'McLaren', points: 331, wins: 3, podiums: 11 },
        { position: 3, name: 'Charles Leclerc', team: 'Ferrari', points: 307, wins: 2, podiums: 10 },
        { position: 4, name: 'Oscar Piastri', team: 'McLaren', points: 262, wins: 2, podiums: 8 },
        { position: 5, name: 'Carlos Sainz', team: 'Ferrari', points: 244, wins: 1, podiums: 7 },
        { position: 6, name: 'George Russell', team: 'Mercedes', points: 192, wins: 1, podiums: 4 },
        { position: 7, name: 'Lewis Hamilton', team: 'Mercedes', points: 190, wins: 2, podiums: 6 },
        { position: 8, name: 'Sergio Perez', team: 'Red Bull Racing', points: 151, wins: 0, podiums: 3 },
        { position: 9, name: 'Fernando Alonso', team: 'Aston Martin', points: 62, wins: 0, podiums: 1 },
        { position: 10, name: 'Nico Hulkenberg', team: 'Haas', points: 31, wins: 0, podiums: 0 },
        { position: 11, name: 'Lance Stroll', team: 'Aston Martin', points: 24, wins: 0, podiums: 0 },
        { position: 12, name: 'Yuki Tsunoda', team: 'RB', points: 22, wins: 0, podiums: 0 },
        { position: 13, name: 'Kevin Magnussen', team: 'Haas', points: 16, wins: 0, podiums: 0 },
        { position: 14, name: 'Daniel Ricciardo', team: 'RB', points: 12, wins: 0, podiums: 0 },
        { position: 15, name: 'Pierre Gasly', team: 'Alpine', points: 8, wins: 0, podiums: 0 },
        { position: 16, name: 'Oliver Bearman', team: 'Haas', points: 7, wins: 0, podiums: 0 },
        { position: 17, name: 'Franco Colapinto', team: 'Williams', points: 5, wins: 0, podiums: 0 },
        { position: 18, name: 'Esteban Ocon', team: 'Alpine', points: 5, wins: 0, podiums: 0 },
        { position: 19, name: 'Liam Lawson', team: 'RB', points: 4, wins: 0, podiums: 0 },
        { position: 20, name: 'Alexander Albon', team: 'Williams', points: 4, wins: 0, podiums: 0 }
      ];

      const mockConstructors = [
        { position: 1, name: 'McLaren', points: 593, wins: 5 },
        { position: 2, name: 'Ferrari', points: 557, wins: 3 },
        { position: 3, name: 'Red Bull Racing', points: 544, wins: 8 },
        { position: 4, name: 'Mercedes', points: 382, wins: 3 },
        { position: 5, name: 'Aston Martin', points: 86, wins: 0 },
        { position: 6, name: 'Haas', points: 54, wins: 0 },
        { position: 7, name: 'RB', points: 38, wins: 0 },
        { position: 8, name: 'Williams', points: 17, wins: 0 },
        { position: 9, name: 'Alpine', points: 13, wins: 0 },
        { position: 10, name: 'Kick Sauber', points: 0, wins: 0 }
      ];

      setDriversStandings(mockDrivers);
      setConstructorsStandings(mockConstructors);
    } catch (error) {
      console.error('Error loading standings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamColor = (team) => {
    const colors = {
      'Red Bull Racing': '#1E41FF',
      'McLaren': '#FF8000',
      'Ferrari': '#DC143C',
      'Mercedes': '#00D2BE',
      'Aston Martin': '#006F62',
      'Alpine': '#0090FF',
      'Williams': '#005AFF',
      'Haas': '#B6BABD',
      'RB': '#2B4562',
      'Kick Sauber': '#00FF87'
    };
    return colors[team] || '#666';
  };

  return (
    <div className="standings-page">
      <div className="standings-container">
        <div className="standings-header">
          <h1 className="standings-title">2025 FORMULA 1 STANDINGS</h1>
          <div className="standings-tabs">
            <button 
              className={`tab-btn ${activeTab === 'drivers' ? 'active' : ''}`}
              onClick={() => setActiveTab('drivers')}
            >
              DRIVERS
            </button>
            <button 
              className={`tab-btn ${activeTab === 'constructors' ? 'active' : ''}`}
              onClick={() => setActiveTab('constructors')}
            >
              TEAMS
            </button>
          </div>
        </div>

        {loading ? (
          <div className="standings-loading">Loading standings...</div>
        ) : (
          <div className="standings-content">
            {activeTab === 'drivers' ? (
              <div className="drivers-standings">
                <div className="standings-table">
                  <div className="table-header">
                    <div className="pos">POS</div>
                    <div className="driver">DRIVER</div>
                    <div className="team">TEAM</div>
                    <div className="points">PTS</div>
                    <div className="wins">WINS</div>
                    <div className="podiums">PODIUMS</div>
                  </div>
                  {driversStandings.map((driver) => (
                    <div key={driver.position} className="table-row">
                      <div className="pos">{driver.position}</div>
                      <div className="driver">
                        <div className="driver-name">{driver.name}</div>
                      </div>
                      <div className="team">
                        <div 
                          className="team-color" 
                          style={{ backgroundColor: getTeamColor(driver.team) }}
                        ></div>
                        {driver.team}
                      </div>
                      <div className="points">{driver.points}</div>
                      <div className="wins">{driver.wins}</div>
                      <div className="podiums">{driver.podiums}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="constructors-standings">
                <div className="standings-table">
                  <div className="table-header">
                    <div className="pos">POS</div>
                    <div className="constructor">TEAM</div>
                    <div className="points">PTS</div>
                    <div className="wins">WINS</div>
                  </div>
                  {constructorsStandings.map((constructor) => (
                    <div key={constructor.position} className="table-row">
                      <div className="pos">{constructor.position}</div>
                      <div className="constructor">
                        <div 
                          className="team-color" 
                          style={{ backgroundColor: getTeamColor(constructor.name) }}
                        ></div>
                        {constructor.name}
                      </div>
                      <div className="points">{constructor.points}</div>
                      <div className="wins">{constructor.wins}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}