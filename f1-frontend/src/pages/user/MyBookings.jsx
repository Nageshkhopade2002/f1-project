import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./my-bookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      const date = Array.isArray(dateString) 
        ? new Date(dateString[0], dateString[1] - 1, dateString[2])
        : new Date(dateString);
      
      return isNaN(date.getTime()) ? "TBD" : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "TBD";
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "TBD";
    try {
      const date = Array.isArray(dateTimeString)
        ? new Date(dateTimeString[0], dateTimeString[1] - 1, dateTimeString[2], 
                   dateTimeString[3] || 0, dateTimeString[4] || 0, dateTimeString[5] || 0)
        : new Date(dateTimeString);
      
      return isNaN(date.getTime()) ? "TBD" : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "TBD";
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.put(`/bookings/${bookingId}/cancel`);
        fetchBookings();
        alert("Booking cancelled successfully");
      } catch (error) {
        alert("Failed to cancel booking");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED": return "#4CAF50";
      case "PENDING": return "#FF9800";
      case "CANCELLED": return "#f44336";
      default: return "#666";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "SUCCESS": return "#4CAF50";
      case "PENDING": return "#FF9800";
      case "FAILED": return "#f44336";
      default: return "#666";
    }
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <h1 className="page-title">MY BOOKINGS</h1>
        
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
            <button 
              className="browse-events-btn"
              onClick={() => navigate("/schedule")}
            >
              Browse Races
            </button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.bookingId} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-logo">F1 HUB</div>
                  <div className="ticket-status-badges">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.bookingStatus) }}
                    >
                      {booking.bookingStatus}
                    </span>
                    <span 
                      className="payment-badge"
                      style={{ backgroundColor: getPaymentStatusColor(booking.paymentStatus) }}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="ticket-race-info">
                  <h2 className="ticket-race-name">{booking.raceName || 'TBD'}</h2>
                  <div className="ticket-circuit">{booking.circuitName || 'TBD'}</div>
                  <div className="ticket-location">{booking.circuitLocation || 'TBD'}</div>
                </div>

                <div className="ticket-divider"></div>

                <div className="ticket-details-grid">
                  <div className="ticket-detail-item">
                    <div className="detail-label">RACE DATE</div>
                    <div className="detail-value">{formatDate(booking.raceDate)}</div>
                  </div>
                  <div className="ticket-detail-item">
                    <div className="detail-label">TICKET TYPE</div>
                    <div className="detail-value ticket-type-badge">
                      <span className={`type-${booking.ticketType?.toLowerCase() || 'general'}`}>
                        {booking.ticketType || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="ticket-detail-item">
                    <div className="detail-label">QUANTITY</div>
                    <div className="detail-value">×{booking.quantity}</div>
                  </div>
                  <div className="ticket-detail-item">
                    <div className="detail-label">TOTAL AMOUNT</div>
                    <div className="detail-value ticket-price">₹{booking.totalAmount}</div>
                  </div>
                </div>

                <div className="ticket-divider"></div>

                <div className="ticket-booking-info">
                  <div className="booking-info-row">
                    <span>Booking ID:</span>
                    <span className="booking-id">#{booking.bookingId}</span>
                  </div>
                  <div className="booking-info-row">
                    <span>Booked On:</span>
                    <span>{formatDateTime(booking.bookingDate)}</span>
                  </div>
                  {booking.razorpayPaymentId && (
                    <div className="booking-info-row">
                      <span>Payment ID:</span>
                      <span className="payment-id-text">{booking.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>
                
                {booking.bookingStatus === "CONFIRMED" && (
                  <div className="ticket-actions">
                    <button 
                      className="cancel-ticket-btn"
                      onClick={() => handleCancelBooking(booking.bookingId)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                <div className="ticket-barcode"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}