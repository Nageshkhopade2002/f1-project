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
    
    // Fallback race names for common IDs
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

  const getTicketTypeColor = (type) => {
    switch (type) {
      case 'GENERAL': return '#00d4aa';
      case 'VIP': return '#ff6b35';
      case 'PADDOCK': return '#ffd700';
      default: return '#00d4aa';
    }
  };

  const handleBookTicket = (ticket) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Navigate to race tickets page where booking is handled
    navigate(`/race/${ticket.raceEventId}/tickets`);
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div className="ticket-list-page">
      <div className="container">
        <h1 className="page-title">F1 Race Tickets</h1>
        
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3 className="race-name">{getRaceName(ticket.raceEventId)}</h3>
                <span 
                  className="ticket-type"
                  style={{ backgroundColor: getTicketTypeColor(ticket.ticketType) }}
                >
                  {ticket.ticketType}
                </span>
              </div>
              
              <div className="ticket-details">
                <div className="price">₹{ticket.price}</div>
                <div className="availability">
                  {ticket.availableSeats} seats available
                </div>
              </div>
              
              <button 
                className="book-btn"
                onClick={() => handleBookTicket(ticket)}
                disabled={ticket.availableSeats === 0}
              >
                {ticket.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketList;