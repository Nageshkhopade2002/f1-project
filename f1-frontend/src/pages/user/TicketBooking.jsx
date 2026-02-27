import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ticket-booking.css";

export default function TicketBooking() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEvent();
    loadRazorpayScript();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book tickets");
      navigate("/login");
      return;
    }

    setBooking(true);
    try {
      const response = await api.post("/bookings", {
        eventId: parseInt(eventId),
        numberOfTickets,
      });

      const booking = response.data;
      
      const options = {
        key: "rzp_test_your_key_id", // Replace with your Razorpay key
        amount: booking.totalAmount * 100,
        currency: "INR",
        name: "F1 Hub",
        description: `Tickets for ${event.name}`,
        order_id: booking.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/bookings/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            alert("Payment successful! Booking confirmed.");
            navigate("/my-bookings");
          } catch (error) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
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
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="booking-page">
        <div className="error">Event not found</div>
      </div>
    );
  }

  const totalAmount = event.ticketPrice * numberOfTickets;

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-card">
          <h1 className="booking-title">Book Tickets</h1>
          
          <div className="event-summary">
            <h2>{event.name}</h2>
            <p className="event-venue">{event.venue}</p>
            <p className="event-date">
              {new Date(event.eventDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="booking-form">
            <div className="form-group">
              <label>Number of Tickets:</label>
              <select
                value={numberOfTickets}
                onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
              >
                {[...Array(Math.min(10, event.availableSeats))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Price per ticket:</span>
                <span>₹{event.ticketPrice}</span>
              </div>
              <div className="price-row">
                <span>Number of tickets:</span>
                <span>{numberOfTickets}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              className="book-btn"
              onClick={handleBooking}
              disabled={booking}
            >
              {booking ? "Processing..." : "Pay & Book Tickets"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}