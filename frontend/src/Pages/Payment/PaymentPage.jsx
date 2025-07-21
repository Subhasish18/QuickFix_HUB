import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [price, setPrice] = useState(location.state?.price || '');
  const [bookingId, setBookingId] = useState(location.state?.bookingId || '');
  const [loading, setLoading] = useState(false);

  // If state is missing, try to get bookingId from query params or prompt user
  useEffect(() => {
    if (!bookingId) {
      // Optionally, get from query params or prompt user
      // For now, just show error
      return;
    }
    if (!price && bookingId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/bookings/${bookingId}`)
        .then(res => res.json())
        .then(data => {
          setPrice(data.booking.price);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [bookingId, price]);

  const handlePayment = () => {
    // Here you would integrate with a real payment gateway
    alert('Payment processed!');
    // Optionally, redirect back to bookings
    navigate('/user-bookings');
  };

  if (!bookingId) {
    return <div>Invalid payment request.</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="payment-page">
      <h2>Payment for Booking</h2>
      <div>
        <label>Amount to Pay:</label>
        <input type="text" value={price} readOnly style={{ background: '#eee' }} />
      </div>
      <button onClick={handlePayment} className="pay-now-button">
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;