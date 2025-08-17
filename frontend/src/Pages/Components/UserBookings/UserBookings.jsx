import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserBookings.css';

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const token = await user.getIdToken(true);
        const response = await fetch(`http://localhost:5000/api/user-bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError('Failed to load bookings');
        toast.error('❌ Failed to load your bookings. Please try again.', {
          toastId: 'bookings-fetch-error',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
        });
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
      case 'declined': return 'status-declined';
      default: return '';
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const token = await user.getIdToken(true);
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      toast.info('⚠️ Booking has been cancelled.', {
        toastId: 'booking-cancel-success',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error('❌ Failed to cancel booking. Please try again.', {
        toastId: 'booking-cancel-error',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const token = await user.getIdToken(true);
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (!response.ok) throw new Error('Failed to mark as completed');
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'completed' } : b))
      );
      toast.success('✅ Booking marked as completed successfully!', {
        toastId: 'booking-complete-success',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error('❌ Failed to complete booking. Please try again.', {
        toastId: 'booking-complete-error',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  const handlePayment = (booking) => {
    navigate('/payment', {
      state: { bookingId: booking._id, price: booking.price },
    });
    toast.info('💳 Redirecting to payment page...', {
      toastId: 'payment-redirect',
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
    });
  };

  const confirmAndExecute = (actionFn, bookingId, actionType) => {
    setConfirmAction(() => () => actionFn(bookingId));
    setShowConfirm(true);
  };

  const renderBookingCard = (booking) => (
    <Card key={booking._id} className="shadow-sm mb-3">
      <Card.Body>
        <Card.Title>{booking.serviceDetails || booking.serviceName || 'Service'}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {formatDate(booking.scheduledTime || booking.date)}
        </Card.Subtitle>
        <Card.Text>
          <strong>Status:</strong>{' '}
          <span className={getStatusClassName(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
          <br />
          <strong>Payment:</strong>{' '}
          {booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 'Pending'}
          <br />
          <strong>Provider:</strong> {booking.serviceId?.name || booking.providerName || '-'}
          <br />
          <strong>Location:</strong>{' '}
          {booking.serviceId?.city && booking.serviceId?.state
            ? `${booking.serviceId.city}, ${booking.serviceId.state}`
            : booking.city && booking.state
              ? `${booking.city}, ${booking.state}`
              : '-'}
          <br />
          <strong>Price:</strong>{' '}
          {booking.price
            ? `₹${typeof booking.price === 'number' ? booking.price.toFixed(2) : booking.price}`
            : booking.serviceId?.pricingModel
              ? `₹${booking.serviceId.pricingModel}/hr`
              : 'N/A'}
        </Card.Text>
        <div className="d-flex gap-2 flex-wrap">
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => confirmAndExecute(handleCancelBooking, booking._id, 'cancel')}
            >
              Cancel
            </Button>
          )}
          {booking.status === 'confirmed' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => confirmAndExecute(handleCompleteBooking, booking._id, 'complete')}
            >
              Complete
            </Button>
          )}
          {booking.status === 'completed' && booking.paymentStatus === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handlePayment(booking)}
            >
              Pay Now
            </Button>
          )}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              setSelectedBooking(booking);
              setShowModal(true);
            }}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const renderModal = () => {
    if (!showModal || !selectedBooking) return null;

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h5>Service Information</h5>
            <div className="modal-info-grid">
              <div>
                <strong>Service:</strong>{' '}
                {selectedBooking.serviceDetails || selectedBooking.serviceName || 'Not specified'}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <span className={getStatusClassName(selectedBooking.status)}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h5>Provider Information</h5>
            <div className="modal-info-grid">
              <div>
                <strong>Provider:</strong>{' '}
                {selectedBooking.serviceId?.name || selectedBooking.providerName || 'Not specified'}
              </div>
              <div>
                <strong>Contact:</strong>{' '}
                {selectedBooking.serviceId?.phoneNumber || selectedBooking.phoneNumber || 'Not available'}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h5>Schedule & Location</h5>
            <div className="modal-info-grid">
              <div>
                <strong>Date & Time:</strong>{' '}
                {formatDate(selectedBooking.scheduledTime || selectedBooking.date)}
              </div>
              <div>
                <strong>Location:</strong>{' '}
                {selectedBooking.serviceId?.city && selectedBooking.serviceId?.state
                  ? `${selectedBooking.serviceId.city}, ${selectedBooking.serviceId.state}`
                  : selectedBooking.city && selectedBooking.state
                    ? `${selectedBooking.city}, ${selectedBooking.state}`
                    : 'Not specified'}
              </div>
              {selectedBooking.address && (
                <div>
                  <strong>Address:</strong> {selectedBooking.address}
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <h5>Payment Information</h5>
            <div className="modal-info-grid">
              <div>
                <strong>Price:</strong>{' '}
                {selectedBooking.price
                  ? `₹${typeof selectedBooking.price === 'number' ? selectedBooking.price.toFixed(2) : selectedBooking.price}`
                  : selectedBooking.serviceId?.pricingModel
                    ? `₹${selectedBooking.serviceId.pricingModel}/hr`
                    : 'Not specified'}
              </div>
              <div>
                <strong>Payment Status:</strong>{' '}
                <span className={selectedBooking.paymentStatus === 'paid' ? 'status-completed' : 'status-pending'}>
                  {selectedBooking.paymentStatus ? selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1) : 'Pending'}
                </span>
              </div>
            </div>
          </div>
          {selectedBooking.description && (
            <div className="mb-3">
              <h5>Description</h5>
              <p>{selectedBooking.description}</p>
            </div>
          )}
          {selectedBooking.confirmedAt && (
            <div className="mb-3">
              <h5>Confirmation Details</h5>
              <div>
                <strong>Confirmed At:</strong> {formatDate(selectedBooking.confirmedAt)}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="user-bookings">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <div className="booking-filters">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'declined'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="me-2 mb-2"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      <div className="bookings-content">
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading your bookings...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : filteredBookings.length === 0 ? (
          <Alert variant="info" className="text-center">
            {activeFilter === 'all' ? 'You have no bookings yet.' : `You have no ${activeFilter} bookings.`}
          </Alert>
        ) : (
          <div className="d-grid gap-3">{filteredBookings.map(renderBookingCard)}</div>
        )}
      </div>
      {renderModal()}
      <ConfirmDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={() => {
          if (confirmAction) confirmAction();
          setShowConfirm(false);
        }}
        title="Are you sure?"
        message="Do you really want to proceed with this action?"
      />
    </div>
  );
};

export default UserBookings;