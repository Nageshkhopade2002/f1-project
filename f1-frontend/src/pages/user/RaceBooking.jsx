import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRaceDetails } from "../../services/api";
import api from "../../services/api";
import "./race-booking.css";

export default function RaceBooking() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [race, setRace] = useState(null);
  const [raceTicket, setRaceTicket] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchRaceAndTickets();
    loadRazorpayScript();
  }, [raceId]);

  const fetchRaceAndTickets = async () => {
    try {
      const [raceResponse, ticketResponse] = await Promise.all([
        getRaceDetails(raceId),
        api.get(`/race-tickets/race/${raceId}`)
      ]);
      
      setRace(raceResponse);
      setRaceTicket(ticketResponse.data);
    } catch (error) {
      console.error("Error fetching race details:", error);
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
        raceEventId: parseInt(raceId),
        numberOfTickets,
      });

      const booking = response.data;
      
      const options = {
        key: "rzp_test_your_key_id", // Replace with your Razorpay key
        amount: booking.totalAmount * 100,
        currency: "INR",
        name: "F1 Hub",
        description: `Tickets for ${race.race.raceName}`,
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
      <div className="race-booking-page">
        <div className="loading">Loading race details...</div>
      </div>
    );
  }

  if (!race || !raceTicket) {
    return (
      <div className="race-booking-page">
        <div className="error">Race tickets not available</div>
      </div>
    );
  }

  const totalAmount = raceTicket.ticketPrice * numberOfTickets;

  return (
    <div className="race-booking-page">
      <div className="booking-container">
        <div className="booking-card">
          <h1 className="booking-title">Book Race Tickets</h1>
          
          <div className="race-summary">
            <h2>{race.race.raceName}</h2>
            <p className="race-venue">{race.circuit.name}, {race.circuit.country}</p>
            <p className="race-date">
              {new Date(race.race.startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
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
                {[...Array(Math.min(10, raceTicket.availableSeats))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Price per ticket:</span>
                <span>₹{raceTicket.ticketPrice}</span>
              </div>
              <div className="price-row">
                <span>Number of tickets:</span>
                <span>{numberOfTickets}</span>
              </div>
              <div className="price-row">
                <span>Available seats:</span>
                <span>{raceTicket.availableSeats}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              className="book-btn"
              onClick={handleBooking}
              disabled={booking || raceTicket.availableSeats === 0}
            >
              {booking ? "Processing..." : 
               raceTicket.availableSeats === 0 ? "Sold Out" : 
               "Pay & Book Tickets"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}