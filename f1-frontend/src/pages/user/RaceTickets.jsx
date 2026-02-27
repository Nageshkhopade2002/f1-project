import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./race-tickets.css";

export default function RaceTickets() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [race, setRace] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingTicket, setBookingTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRaceAndTickets();
    loadRazorpayScript();
  }, [raceId]);

  const fetchRaceAndTickets = async () => {
    try {
      const [raceResponse, ticketsResponse] = await Promise.all([
        api.get(`/schedule/race/${raceId}`),
        api.get(`/tickets/race/${raceId}`)
      ]);
      
      setRace(raceResponse.data);
      setTickets(ticketsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const handleBookTicket = (ticket) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book tickets");
      navigate("/login");
      return;
    }
    setBookingTicket(ticket);
    setQuantity(1);
  };

  const confirmBooking = async () => {
    if (!bookingTicket) return;

    setProcessing(true);
    try {
      const response = await api.post("/bookings", {
        raceTicketId: bookingTicket.id,
        raceEventId: raceId,
        quantity: quantity
      });

      const booking = response.data;
      
      const options = {
        key: "rzp_test_SCDby0FyUYjR1q",
        amount: booking.totalAmount * 100,
        currency: "INR",
        name: "F1 Hub",
        description: `${bookingTicket.ticketType} Tickets for ${race.raceName}`,
        order_id: booking.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/bookings/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            
            alert("Payment successful! Booking confirmed.");
            navigate("/my-bookings");
          } catch (error) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "F1 Fan",
          email: "fan@f1hub.com",
        },
        theme: {
          color: "#ff0000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed!");
    } finally {
      setProcessing(false);
      setBookingTicket(null);
    }
  };

  if (loading) {
    return (
      <div className="race-tickets-page">
        <div className="loading">Loading race tickets...</div>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="race-tickets-page">
        <div className="error">Race not found</div>
      </div>
    );
  }

  return (
    <div className="race-tickets-page">
      <div className="race-header">
        <h1>{race.circuit.name}, {race.circuit.country}</h1>
      </div>

      <div className="tickets-container">
        <h2>Available Tickets</h2>
        
        {tickets.length === 0 ? (
          <div className="no-tickets">
            <p>No tickets available for this race yet.</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className={`ticket-card ${ticket.ticketType.toLowerCase()}`}>
                {ticket.ticketType.toLowerCase() === 'vip' && <span className="vip-badge">VIP</span>}
                <h3 className="ticket-type">{ticket.ticketType}</h3>
                <div className="price">₹{ticket.price}</div>
                <div className="availability">
                  {ticket.availableSeats > 0 ? (
                    <span className="available">{ticket.availableSeats} seats available</span>
                  ) : (
                    <span className="sold-out">Sold Out</span>
                  )}
                </div>
                <button
                  className="book-btn"
                  onClick={() => handleBookTicket(ticket)}
                  disabled={ticket.availableSeats === 0}
                >
                  {ticket.availableSeats === 0 ? "Sold Out" : "BOOK NOW"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingTicket && (
        <div className="booking-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Book {bookingTicket.ticketType} Tickets</h3>
              <button className="close-btn" onClick={() => setBookingTicket(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="quantity-selector">
                <label>Number of tickets:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                >
                  {[...Array(Math.min(10, bookingTicket.availableSeats))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="booking-summary">
                <div className="summary-row">
                  <span>Price per ticket:</span>
                  <span>₹{bookingTicket.price}</span>
                </div>
                <div className="summary-row">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{(bookingTicket.price * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setBookingTicket(null)}>
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={confirmBooking}
                disabled={processing}
              >
                {processing ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}