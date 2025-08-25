import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { getAuth } from 'firebase/auth';
import { Building2, MapPin, Mail, Eye, Trash2, CheckCircle, Calendar, CreditCard,IndianRupee, AlertTriangle, X } from 'lucide-react';
import './UserBookings.css';

const dashboardStyles = {
  card: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md",
  cardHeader: "bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4",
  cardTitle: "text-xl font-bold text-white flex items-center space-x-3",
  cardBadge: "bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-medium text-black",
  tableContainer: "overflow-x-auto",
  table: "w-full divide-y divide-gray-200",
  tableHeader: "bg-gray-50 border-b border-gray-200",
  tableHeaderCell: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
  tableBody: "bg-white divide-y divide-gray-200",
  tableRow: "transition-all duration-200 hover:bg-blue-50 hover:shadow-md",
  tableCell: "px-6 py-4 whitespace-nowrap text-sm",
  primaryButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200",
  secondaryButton: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200",
  dangerButton: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2",
  successButton: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2",
  iconButton: "text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200",
  avatar: "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white bg-gradient-to-r from-blue-400 to-purple-500",
};

const Toast = ({ message, type, onClose }) => {
  const toastStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
    warning: 'bg-yellow-500 border-yellow-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${toastStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg border-l-4 flex items-center space-x-2 min-w-[300px] animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white hover:text-gray-200">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ConfirmDialog = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100] ${show ? '' : 'hidden'}`}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-modalSlideIn">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-['Inter']">{title}</h3>
              <p className="text-sm text-gray-500 font-['Inter']">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 font-['Inter']">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onHide}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200 font-['Inter']"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 font-['Inter']"
            >
              <Trash2 className="h-4 w-4" />
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
        showToast('❌ Failed to load your bookings. Please try again.', 'error');
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
      case 'confirmed': return 'text-green-600 font-medium';
      case 'pending': return 'text-yellow-600 font-medium';
      case 'completed': return 'text-blue-600 font-medium';
      case 'cancelled': return 'text-red-600 font-medium';
      case 'declined': return 'text-gray-600 font-medium';
      default: return 'text-gray-600';
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
      showToast('⚠️ Booking has been cancelled.', 'warning');
    } catch (err) {
      showToast('❌ Failed to cancel booking. Please try again.', 'error');
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
      showToast('✅ Booking marked as completed successfully!', 'success');
    } catch (err) {
      showToast('❌ Failed to complete booking. Please try again.', 'error');
    }
  };

  const handlePayment = (booking) => {
    navigate('/payment', {
      state: { bookingId: booking._id, price: booking.price },
    });
    showToast('💳 Redirecting to payment page...', 'info');
  };

  const confirmAndExecute = (actionFn, bookingId, actionType) => {
    setConfirmAction(() => () => actionFn(bookingId));
    setShowConfirm(true);
  };

  const renderBookingCard = (booking, index) => (
    <tr
      key={booking._id}
      className={`${dashboardStyles.tableRow} animate-slideInUp`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className={dashboardStyles.tableCell}>
        <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
          #{booking._id.substring(0, 6)}
        </span>
      </td>
      <td className={dashboardStyles.tableCell}>
        <div className="flex items-center space-x-3">
          <div className={dashboardStyles.avatar}>
            {(booking.serviceDetails || booking.serviceName || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 font-['Inter']">{booking.serviceDetails || booking.serviceName || 'Service'}</div>
            <div className="text-xs text-gray-500 font-['Inter']">{formatDate(booking.scheduledTime || booking.date)}</div>
          </div>
        </div>
      </td>
      <td className={dashboardStyles.tableCell}>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-['Inter']">
            {booking.serviceId?.city && booking.serviceId?.state
              ? `${booking.serviceId.city}, ${booking.serviceId.state}`
              : booking.city && booking.state
                ? `${booking.city}, ${booking.state}`
                : '-'}
          </span>
        </div>
      </td>
      <td className={dashboardStyles.tableCell}>
        <span className={getStatusClassName(booking.status)}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
      </td>
      <td className={dashboardStyles.tableCell}>
        <div className="flex items-center space-x-1 justify-end">
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button
              onClick={() => confirmAndExecute(handleCancelBooking, booking._id, 'cancel')}
              className={dashboardStyles.dangerButton}
              title="Cancel Booking"
            >
              <Trash2 className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => confirmAndExecute(handleCompleteBooking, booking._id, 'complete')}
              className={dashboardStyles.successButton}
              title="Complete Booking"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete</span>
            </button>
          )}
          {booking.status === 'completed' && booking.paymentStatus === 'pending' && (
            <button
              onClick={() => handlePayment(booking)}
              className={dashboardStyles.primaryButton}
              title="Pay Now"
            >
              {/* <IndianRupee className="h-5 w-5 text-slate-400" />*/}Pay Now 
              
            </button>
          )}
          <button
            onClick={() => {
              setSelectedBooking(booking);
              setShowModal(true);
              showToast('Booking details loaded', 'info');
            }}
            className={dashboardStyles.iconButton}
            title="View Booking Details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderModal = () => {
    if (!showModal || !selectedBooking) return null;

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-modalSlideIn">
          <div className={dashboardStyles.cardHeader}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-white" />
                <h3 className="text-xl font-bold text-white font-['Inter']">Booking Details</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center font-['Inter']">
                <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                Service Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Service</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                    {selectedBooking.serviceDetails || selectedBooking.serviceName || 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Status</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm">
                    <span className={getStatusClassName(selectedBooking.status)}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center font-['Inter']">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                Provider Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Provider</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                    {selectedBooking.serviceId?.name || selectedBooking.providerName || 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Contact</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                    {selectedBooking.serviceId?.phoneNumber || selectedBooking.phoneNumber || 'Not available'}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center font-['Inter']">
                <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                Schedule & Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Date & Time</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                    {formatDate(selectedBooking.scheduledTime || selectedBooking.date)}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Location</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                    {selectedBooking.serviceId?.city && selectedBooking.serviceId?.state
                      ? `${selectedBooking.serviceId.city}, ${selectedBooking.serviceId.state}`
                      : selectedBooking.city && selectedBooking.state
                        ? `${selectedBooking.city}, ${selectedBooking.state}`
                        : 'Not specified'}
                  </div>
                </div>
                {selectedBooking.address && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-500 font-['Inter']">Address</span>
                    <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                      {selectedBooking.address}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center font-['Inter']">
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                Payment Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Price</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                    {selectedBooking.price
                      ? `₹${typeof selectedBooking.price === 'number' ? selectedBooking.price.toFixed(2) : selectedBooking.price}`
                      : selectedBooking.serviceId?.pricingModel
                        ? `₹${selectedBooking.serviceId.pricingModel}/hr`
                        : 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Payment Status</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm">
                    <span className={selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                      {selectedBooking.paymentStatus ? selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1) : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {selectedBooking.description && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-['Inter']">Description</h4>
                <p className="text-sm text-gray-600 font-['Inter']">{selectedBooking.description}</p>
              </div>
            )}
            {selectedBooking.confirmedAt && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center font-['Inter']">
                  <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                  Confirmation Details
                </h4>
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Confirmed At</span>
                  <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm font-['Inter']">
                    {formatDate(selectedBooking.confirmedAt)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className={dashboardStyles.secondaryButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
        }
        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <div className={dashboardStyles.card}>
        <div className={dashboardStyles.cardHeader}>
          <div className="flex items-center justify-between">
            <h3 className={dashboardStyles.cardTitle}>
              <Building2 className="h-6 w-6 text-white" />
              <span className="font-['Inter']">My Bookings</span>
            </h3>
            <div className={dashboardStyles.cardBadge}>
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'declined'].map((filter, index) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm font-['Inter'] transition-all duration-200 animate-slideInUp ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={dashboardStyles.tableContainer}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-['Inter']">Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-red-600 font-['Inter']">{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-['Inter']">No bookings found</h3>
              <p className="text-gray-500 text-sm mb-4 font-['Inter']">
                {activeFilter === 'all' ? 'You have no bookings yet.' : `You have no ${activeFilter} bookings.`}
              </p>
              <button className={dashboardStyles.primaryButton}>
                  <Link to="/" className={dashboardStyles.primaryButton}>
                    Book a Service
                  </Link>
              </button>
            </div>
          ) : (
            <table className={dashboardStyles.table}>
              <thead className={dashboardStyles.tableHeader}>
                <tr>
                  <th className={dashboardStyles.tableHeaderCell}>ID</th>
                  <th className={dashboardStyles.tableHeaderCell}>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>Service</span>
                    </div>
                  </th>
                  <th className={dashboardStyles.tableHeaderCell}>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                  </th>
                  <th className={dashboardStyles.tableHeaderCell}>Status</th>
                  <th className={dashboardStyles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className={dashboardStyles.tableBody}>
                {filteredBookings.map(renderBookingCard)}
              </tbody>
            </table>
          )}
        </div>

        {filteredBookings.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium font-['Inter']">Total Bookings</span>
                  <span className="text-gray-400">({filteredBookings.length})</span>
                </div>
              </div>
              <span className="font-medium font-['Inter']">
                Total: {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
              </span>
            </div>
          </div>
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
        title="Confirm Action"
        message="Do you really want to proceed with this action?"
      />
    </div>
  );
};

export default UserBookings;