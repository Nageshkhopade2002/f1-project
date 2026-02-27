import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookTicket.css';

const BookTicket = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [race, setRace] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const ticketResponse = await fetch(`http://localhost:8080/api/tickets/${ticketId}`);
      const ticketData = await ticketResponse.json();
      setTicket(ticketData);

      const raceResponse = await fetch(`http://localhost:8080/api/schedule/${ticketData.raceEventId}`);
      const raceData = await raceResponse.json();
      setRace(raceData);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    setBooking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          raceTicketId: parseInt(ticketId),
          quantity: quantity
        })
      });

      if (response.ok) {
        const booking = await response.json();
        // Redirect to payment
        initiatePayment(booking);
      } else {
        const error = await response.text();
        alert('Booking failed: ' + error);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const initiatePayment = (booking) => {
    const options = {
      key: 'rzp_test_your_key_id', // Replace with your Razorpay key
      amount: booking.totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'F1 Hub',
      description: `${race?.raceName} - ${ticket?.ticketType} Ticket`,
      order_id: booking.razorpayOrderId,
      handler: function (response) {
        verifyPayment(response);
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com'
      },
      theme: {
        color: '#ff1e1e'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch('http://localhost:8080/api/bookings/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature
        })
      });

      if (response.ok) {
        alert('Payment successful! Booking confirmed.');
        navigate('/my-bookings');
      } else {
        alert('Payment verification failed.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed.');
    }
  };

  if (loading) {
    return <div className="loading">Loading ticket details...</div>;
  }

  if (!ticket || !race) {
    return <div className="error">Ticket not found</div>;
  }

  const totalAmount = ticket.price * quantity;

  return (
    <div className="book-ticket-page">
      <div className="container">
        <div className="booking-card">
          <h1 className="page-title">Book Ticket</h1>
          
          <div className="ticket-info">
            <h2>{race.raceName}</h2>
            <div className="ticket-type">{ticket.ticketType}</div>
            <div className="race-details">
              <p><strong>Date:</strong> {new Date(race.raceDate).toLocaleDateString()}</p>
              <p><strong>Circuit:</strong> {race.circuitName}</p>
              <p><strong>Price per ticket:</strong> ₹{ticket.price}</p>
              <p><strong>Available seats:</strong> {ticket.availableSeats}</p>
            </div>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Number of tickets:</label>
            <select 
              id="quantity"
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            >
              {[...Array(Math.min(ticket.availableSeats, 10))].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="total-amount">
            <h3>Total Amount: ₹{totalAmount}</h3>
          </div>

          <div className="booking-actions">
            <button 
              className="book-btn"
              onClick={handleBooking}
              disabled={booking}
            >
              {booking ? 'Processing...' : 'Proceed to Payment'}
            </button>
            <button 
              className="cancel-btn"
              onClick={() => navigate('/tickets')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;