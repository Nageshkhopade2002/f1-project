import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketList.css';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    fetchRaces();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRaces = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/schedule/2026');
      const data = await response.json();
      setRaces(data);
    } catch (error) {
      console.error('Error fetching races:', error);
    }
  };

  const getRaceName = (raceEventId) => {
    const race = races.find(r => r.id === raceEventId);
    if (race) {
      return `${race.raceName} - ${race.circuit?.country || race.circuit?.name || ''}`;
    }
    
    const fallbackNames = {
      1: 'Bahrain Grand Prix',
      2: 'Saudi Arabian Grand Prix', 
      3: 'Australian Grand Prix',
      4: 'Japanese Grand Prix',
      5: 'Chinese Grand Prix',
      6: 'Miami Grand Prix',
      7: 'Emilia Romagna Grand Prix',
      8: 'Monaco Grand Prix'
    };
    
    return fallbackNames[raceEventId] || `Race ${raceEventId}`;
  };

  const getRaceDetails = (raceEventId) => {
    const race = races.find(r => r.id === raceEventId);
    return race || null;
  };

  const getRaceTickets = (raceEventId) => {
    return tickets.filter(t => t.raceEventId === raceEventId);
  };

  const hasAvailableTickets = (raceEventId) => {
    const raceTickets = getRaceTickets(raceEventId);
    return raceTickets.some(t => t.availableSeats > 0);
  };

  const getTicketTypesCount = (raceEventId) => {
    return getRaceTickets(raceEventId).length;
  };

  const handleRaceClick = (raceEventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/race/${raceEventId}/tickets`);
  };

  const uniqueRaceIds = [...new Set(tickets.map(t => t.raceEventId))];

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div className="ticket-list-page">
      <div className="container">
        <h1 className="page-title">F1 Race Tickets 2026</h1>
        
        <div className="races-grid">
          {uniqueRaceIds.map(raceId => {
            const race = getRaceDetails(raceId);
            const available = hasAvailableTickets(raceId);
            const ticketCount = getTicketTypesCount(raceId);
            
            return (
              <div 
                key={raceId} 
                className="race-card"
                onClick={() => handleRaceClick(raceId)}
              >
                <div className="race-card-header">
                  <h3 className="race-name">{getRaceName(raceId)}</h3>
                  <span className={`availability-badge ${available ? 'available' : 'sold-out'}`}>
                    {available ? 'AVAILABLE' : 'SOLD OUT'}
                  </span>
                </div>
                
                {race && (
                  <>
                    <div className="race-circuit">{race.circuit?.name || 'Circuit'}</div>
                    <div className="race-date">{new Date(race.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </>
                )}
                
                <div className="race-card-footer">
                  <span className="ticket-types-indicator">🎫 {ticketCount} ticket types available</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TicketList;