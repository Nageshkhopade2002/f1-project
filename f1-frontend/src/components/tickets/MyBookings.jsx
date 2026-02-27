import React, { useState, useEffect } from 'react';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } else {
        alert('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#00d4aa';
      case 'PENDING': return '#ff6b35';
      case 'CANCELLED': return '#ff4444';
      default: return '#888';
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
            <a href="/tickets" className="browse-tickets-btn">Browse Tickets</a>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">Booking #{booking.id}</div>
                  <div 
                    className="booking-status"
                    style={{ color: getStatusColor(booking.bookingStatus) }}
                  >
                    {booking.bookingStatus}
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="detail-row">
                    <span>Quantity:</span>
                    <span>{booking.quantity} tickets</span>
                  </div>
                  <div className="detail-row">
                    <span>Total Amount:</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                  <div className="detail-row">
                    <span>Booking Date:</span>
                    <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Payment Status:</span>
                    <span style={{ color: getStatusColor(booking.paymentStatus) }}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                {booking.bookingStatus === 'CONFIRMED' && (
                  <div className="booking-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;