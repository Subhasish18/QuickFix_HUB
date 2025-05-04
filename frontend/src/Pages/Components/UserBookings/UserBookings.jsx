import React, { useState, useEffect } from 'react';
import './UserBookings.css';

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // 🛠️ Future Backend Integration Point:
        // const response = await fetch(`/api/users/${userId}/bookings`);
        // const data = await response.json();
        // setBookings(data);

        // 🔧 Mock data (to be replaced with real API later)
        const mockBookings = [
          {
            id: 'b1',
            serviceId: 's1',
            serviceName: 'Plumbing Repair',
            providerName: 'John Smith',
            date: '2025-05-10T14:00:00',
            status: 'confirmed',
            price: 85,
            address: '123 Main St, Anytown',
          },
          {
            id: 'b2',
            serviceId: 's2',
            serviceName: 'House Cleaning',
            providerName: 'Clean Team Inc.',
            date: '2025-05-15T10:00:00',
            status: 'pending',
            price: 120,
            address: '123 Main St, Anytown',
          },
          {
            id: 'b3',
            serviceId: 's3',
            serviceName: 'Electrical Wiring',
            providerName: 'Sparky Electric',
            date: '2025-04-25T09:30:00',
            status: 'completed',
            price: 150,
            address: '123 Main St, Anytown',
          },
          {
            id: 'b4',
            serviceId: 's4',
            serviceName: 'Lawn Mowing',
            providerName: 'Green Thumb Gardens',
            date: '2025-04-20T13:00:00',
            status: 'cancelled',
            price: 45,
            address: '123 Main St, Anytown',
          }
        ];

        setTimeout(() => {
          setBookings(mockBookings);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load bookings');
        setLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
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
    <div key={booking.id} className="booking-card">
      <div className="booking-header">
        <h3>{booking.serviceName}</h3>
        <span className={`booking-status ${getStatusClassName(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="booking-details">
        <div className="booking-info">
          <div className="info-row">
            <span className="info-label">Provider:</span>
            <span className="info-value">{booking.providerName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date & Time:</span>
            <span className="info-value">{formatDate(booking.date)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Location:</span>
            <span className="info-value">{booking.address}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Price:</span>
            <span className="info-value">
              ${typeof booking.price === 'number' ? booking.price.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="booking-actions">
        {booking.status === 'pending' && (
          <>
            <button onClick={() => alert(`Cancel booking ${booking.id}`)} className="cancel-booking-button">
              Cancel
            </button>
            <button onClick={() => alert(`Reschedule booking ${booking.id}`)} className="reschedule-button">
              Reschedule
            </button>
          </>
        )}
        {booking.status === 'confirmed' && (
          <>
            <button onClick={() => alert(`Cancel booking ${booking.id}`)} className="cancel-booking-button">
              Cancel
            </button>
            <button onClick={() => alert(`Contacting ${booking.providerName}`)} className="contact-provider-button">
              Contact Provider
            </button>
          </>
        )}
        {booking.status === 'completed' && (
          <button onClick={() => alert(`Leave review for ${booking.serviceName}`)} className="review-button">
            Leave Review
          </button>
        )}
        <button onClick={() => alert(`Viewing details for booking ${booking.id}`)} className="details-button">
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
