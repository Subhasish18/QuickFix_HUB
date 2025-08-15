import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserBookings.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData=JSON.parse(localStorage.getItem('userData'));
  const userId = userData ? userData.id : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `http://localhost:5000/api/user-bookings/user/${userId}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookings();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });

  const getStatusClassName = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'Declined': return 'status-declined';
      default: return '';
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      if (!response.ok) throw new Error('Failed to mark as completed');

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'completed' } : b))
      );
    } catch (err) {
      alert('Failed to complete booking');
      console.error(err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) throw new Error('Failed to cancel booking');

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      alert('Failed to cancel booking');
      console.error(err);
    }
  };

  const handlePayment = (booking) => {
    navigate('/payment', {
      state: {
        bookingId: booking._id,
        price: booking.price
      }
    });
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
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
              {booking.serviceId?.name || booking.providerName || '-'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Date & Time:</span>
            <span className="info-value">{formatDate(booking.scheduledTime || booking.date)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Location:</span>
            <span className="info-value">
              {booking.serviceId?.city && booking.serviceId?.state
                ? `${booking.serviceId.city}, ${booking.serviceId.state}`
                : booking.city && booking.state
                  ? `${booking.city}, ${booking.state}`
                  : '-'}
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

        {booking.status === 'confirmed' && booking.confirmedAt && (
          <div className="info-row">
            <span className="info-label">Confirmed At:</span>
            <span className="info-value">{formatDate(booking.confirmedAt)}</span>
          </div>
        )}
      </div>

      <div className="booking-actions">
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-sm rounded-full shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-300"
            >
              Cancel Booking
            </button>
        )}

        {booking.status === 'confirmed' && (
          <>
            <button
              onClick={() => handleCompleteBooking(booking._id)}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm rounded-full shadow-md hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              Job Done – Click to Confirm
            </button>
            <button onClick={() => alert('Contacting provider')} className="contact-provider-button">
              Contact Provider
            </button>
          </>
        )}

        {booking.status === 'cancelled' && (
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-red-100 text-red-700 font-medium shadow-sm">
            ❌ This booking was cancelled
          </span>
        )}

        {booking.status === 'Declined' && (
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-red-100 text-red-700 font-medium shadow-sm">
            ❌ This booking was declined by provider
          </span>
        )}

        {booking.status === 'completed' && booking.paymentStatus === 'pending' && (
          <button
            onClick={() => handlePayment(booking)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm rounded-full shadow-md"
          >
            💳 Pay Now
          </button>
        )}

        {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium shadow-sm">
            ✅ Payment Done
          </span>
        )}

        {booking.status === 'completed' && (
          <button
            onClick={() => alert('Leave review')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-full shadow-md"
          >
            ✍️ Leave Review
          </button>
        )}

        <button onClick={() => openModal(booking)} className="details-button">
          View Details
        </button>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!isModalOpen || !selectedBooking) return null;

    return (
      <div className="modal-overlay" onClick={handleModalOverlayClick}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Booking Details</h2>
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="modal-section">
              <h3>Service Information</h3>
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-label">Service:</span>
                  <span className="modal-value">{selectedBooking.serviceDetails || selectedBooking.serviceName}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Status:</span>
                  <span className={`modal-status ${getStatusClassName(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Booking ID:</span>
                  <span className="modal-value">{selectedBooking._id}</span>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3>Provider Information</h3>
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-label">Provider:</span>
                  <span className="modal-value">
                    {selectedBooking.serviceId?.name || selectedBooking.providerName || 'Not specified'}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Contact:</span>
                  <span className="modal-value">
                    {selectedBooking.serviceId?.contact || selectedBooking.providerContact || 'Not available'}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3>Schedule & Location</h3>
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-label">Date & Time:</span>
                  <span className="modal-value">{formatDate(selectedBooking.scheduledTime || selectedBooking.date)}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Location:</span>
                  <span className="modal-value">
                    {selectedBooking.serviceId?.city && selectedBooking.serviceId?.state
                      ? `${selectedBooking.serviceId.city}, ${selectedBooking.serviceId.state}`
                      : selectedBooking.city && selectedBooking.state
                        ? `${selectedBooking.city}, ${selectedBooking.state}`
                        : 'Not specified'}
                  </span>
                </div>
                {selectedBooking.address && (
                  <div className="modal-info-item">
                    <span className="modal-label">Address:</span>
                    <span className="modal-value">{selectedBooking.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-section">
              <h3>Payment Information</h3>
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-label">Price:</span>
                  <span className="modal-value">
                    {selectedBooking.price
                      ? `$${typeof selectedBooking.price === 'number' ? selectedBooking.price.toFixed(2) : selectedBooking.price}`
                      : (selectedBooking.serviceId?.pricingModel ? `$${selectedBooking.serviceId.pricingModel}/hr` : 'Not specified')}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Payment Status:</span>
                  <span className={`modal-status ${selectedBooking.paymentStatus === 'paid' ? 'status-completed' : 'status-pending'}`}>
                    {selectedBooking.paymentStatus ? selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1) : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {selectedBooking.description && (
              <div className="modal-section">
                <h3>Description</h3>
                <p className="modal-description">{selectedBooking.description}</p>
              </div>
            )}

            {selectedBooking.confirmedAt && (
              <div className="modal-section">
                <h3>Confirmation Details</h3>
                <div className="modal-info-item">
                  <span className="modal-label">Confirmed At:</span>
                  <span className="modal-value">{formatDate(selectedBooking.confirmedAt)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="modal-close-footer-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="user-bookings">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <div className="booking-filters">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'Declined'].map((filter) => (
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
          <div className="bookings-list">{filteredBookings.map(renderBookingCard)}</div>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default UserBookings;