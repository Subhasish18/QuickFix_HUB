import React, { useState, useEffect } from 'react';
import './UserBookings.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Debug logs
        console.log('UserBookings: userId from localStorage:', userId);

        const url = `http://localhost:5000/api/user-bookings/user/${userId}`;
        console.log('UserBookings: Fetching from URL:', url);

        const response = await fetch(url);
        console.log('UserBookings: Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('UserBookings: Error response text:', errorText);
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        console.log('UserBookings: Data received:', data);

        setBookings(data.bookings || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings');
        setLoading(false);
        console.error('UserBookings: Error fetching bookings:', err);
      }
    };

    if (userId) {
      fetchBookings();
    } else {
      console.warn('UserBookings: No userId found in localStorage');
    }
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });

  const getStatusClassName = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const renderBookingCard = (booking) => (
    <div key={booking._id} className="booking-card">
      <div className="booking-header">
        <h3>{booking.serviceDetails || booking.serviceName}</h3>
        <span className={`booking-status ${getStatusClassName(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="booking-details">
        <div className="booking-info">
          <div className="info-row">
            <span className="info-label">Provider:</span>
            <span className="info-value">
              {booking.serviceId?.name  || booking.providerName || '-'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Date & Time:</span>
            <span className="info-value">{formatDate(booking.scheduledTime || booking.date)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Location:</span>
            <span className="info-value">
              {booking.serviceId?.location || booking.address || '-'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Price:</span>
            <span className="info-value">
              {booking.price
                ? `$${typeof booking.price === 'number' ? booking.price.toFixed(2) : booking.price}`
                : (booking.serviceId?.pricingModel ? `$${booking.serviceId.pricingModel}/hr` : 'N/A')}
            </span>
          </div>
        </div>
      </div>

      <div className="booking-actions">
        {booking.status === 'pending' && (
          <>
            <button onClick={() => alert(`Cancel booking ${booking._id}`)} className="cancel-booking-button">
              Cancel
            </button>
            <button onClick={() => alert(`Reschedule booking ${booking._id}`)} className="reschedule-button">
              Reschedule
            </button>
          </>
        )}
        {booking.status === 'confirmed' && (
          <>
            <button onClick={() => alert(`Cancel booking ${booking._id}`)} className="cancel-booking-button">
              Cancel
            </button>
            <button onClick={() => alert(`Contacting provider`)} className="contact-provider-button">
              Contact Provider
            </button>
          </>
        )}
        {booking.status === 'completed' && (
          <button onClick={() => alert(`Leave review for booking`)} className="review-button">
            Leave Review
          </button>
        )}
        <button onClick={() => alert(`Viewing details for booking ${booking._id}`)} className="details-button">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="user-bookings">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <div className="booking-filters">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(filter => (
            <button
              key={filter}
              className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bookings-content">
        {loading ? (
          <div className="bookings-loading">Loading bookings...</div>
        ) : error ? (
          <div className="bookings-error">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="no-bookings">
            {activeFilter === 'all'
              ? 'You have no bookings yet.'
              : `You have no ${activeFilter} bookings.`}
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(renderBookingCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
