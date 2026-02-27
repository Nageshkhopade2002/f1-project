import React, { useState, useEffect } from 'react';
import './AdminTickets.css';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [races, setRaces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    raceEventId: '',
    ticketType: 'GENERAL',
    price: '',
    totalSeats: '',
    availableSeats: ''
  });

  useEffect(() => {
    fetchTickets();
    fetchRaces();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchRaces = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/schedule');
      const data = await response.json();
      setRaces(data);
    } catch (error) {
      console.error('Error fetching races:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingTicket 
        ? `http://localhost:8080/api/admin/tickets/${editingTicket.id}`
        : 'http://localhost:8080/api/admin/tickets';
      
      const method = editingTicket ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          raceEventId: parseInt(formData.raceEventId),
          price: parseFloat(formData.price),
          totalSeats: parseInt(formData.totalSeats),
          availableSeats: parseInt(formData.availableSeats)
        })
      });

      if (response.ok) {
        alert(editingTicket ? 'Ticket updated successfully' : 'Ticket created successfully');
        setShowForm(false);
        setEditingTicket(null);
        setFormData({
          raceEventId: '',
          ticketType: 'GENERAL',
          price: '',
          totalSeats: '',
          availableSeats: ''
        });
        fetchTickets();
      } else {
        alert('Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Operation failed');
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      raceEventId: ticket.raceEventId.toString(),
      ticketType: ticket.ticketType,
      price: ticket.price.toString(),
      totalSeats: ticket.totalSeats.toString(),
      availableSeats: ticket.availableSeats.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Ticket deleted successfully');
        fetchTickets();
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Delete failed');
    }
  };

  const getRaceName = (raceEventId) => {
    const race = races.find(r => r.id === raceEventId);
    return race ? race.raceName : 'Unknown Race';
  };

  return (
    <div className="admin-tickets-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Manage Race Tickets</h1>
          <button 
            className="add-btn"
            onClick={() => setShowForm(true)}
          >
            Add New Ticket
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="form-container">
              <h2>{editingTicket ? 'Edit Ticket' : 'Add New Ticket'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Race Event:</label>
                  <select
                    value={formData.raceEventId}
                    onChange={(e) => setFormData({...formData, raceEventId: e.target.value})}
                    required
                  >
                    <option value="">Select Race</option>
                    {races.map(race => (
                      <option key={race.id} value={race.id}>
                        {race.raceName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ticket Type:</label>
                  <select
                    value={formData.ticketType}
                    onChange={(e) => setFormData({...formData, ticketType: e.target.value})}
                  >
                    <option value="GENERAL">General</option>
                    <option value="VIP">VIP</option>
                    <option value="PADDOCK">Paddock</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Seats:</label>
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Available Seats:</label>
                  <input
                    type="number"
                    value={formData.availableSeats}
                    onChange={(e) => setFormData({...formData, availableSeats: e.target.value})}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    {editingTicket ? 'Update' : 'Create'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTicket(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="tickets-table">
          <table>
            <thead>
              <tr>
                <th>Race</th>
                <th>Type</th>
                <th>Price</th>
                <th>Total Seats</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{getRaceName(ticket.raceEventId)}</td>
                  <td>{ticket.ticketType}</td>
                  <td>₹{ticket.price}</td>
                  <td>{ticket.totalSeats}</td>
                  <td>{ticket.availableSeats}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(ticket)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;