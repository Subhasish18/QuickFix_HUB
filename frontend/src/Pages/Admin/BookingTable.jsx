import React, { useState } from 'react';
import { Calendar, User, Settings, Clock, CheckCircle, AlertCircle, XCircle, Eye, X, MapPin, Mail, Phone, FileText } from 'lucide-react';

const BookingTable = ({ bookings = [] }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Status configuration with colors and icons
  const statusConfig = {
    confirmed: {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: CheckCircle,
      label: 'Confirmed'
    },
    pending: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: Clock,
      label: 'Pending'
    },
    cancelled: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      label: 'Cancelled'
    },
    completed: {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: CheckCircle,
      label: 'Completed'
    }
  };

  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    return statusConfig[normalizedStatus] || statusConfig.pending;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit'
        }),
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        fullTime: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })
      };
    } catch {
      return { date: 'Invalid Date', time: '', fullDate: 'Invalid Date', fullTime: '' };
    }
  };

  const truncateId = (id) => {
    if (!id) return 'N/A';
    return `${id.substring(0, 8)}...`;
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-white" />
            <h3 className="text-xl font-bold text-white">Service Bookings</h3>
            <div className="ml-auto bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">
                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
              </span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          {bookings && bookings.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Customer</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Settings className="h-4 w-4" />
                      <span>Service Provider</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Scheduled</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, index) => {
                  const statusInfo = getStatusConfig(booking.status);
                  const StatusIcon = statusInfo.icon;
                  const dateInfo = formatDate(booking.scheduledTime);
                  const isHovered = hoveredRow === index;

                  return (
                    <tr
                      key={booking._id}
                      className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-md ${
                        isHovered ? 'transform scale-[1.01]' : ''
                      }`}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideInUp 0.6s ease-out forwards'
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {truncateId(booking._id)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {(booking.userId?.name || 'N/A').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.userId?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {booking.serviceId?.name || 'N/A'}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{dateInfo.date}</div>
                          <div className="text-gray-500 text-xs">{dateInfo.time}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={booking.serviceDetails}>
                            {booking.serviceDetails || 'No details provided'}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 hover:bg-blue-100 rounded-lg p-2"
                          title="View booking details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500 text-sm">
                  When customers make bookings, they'll appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {bookings && bookings.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex space-x-6">
                {Object.entries(
                  bookings.reduce((acc, booking) => {
                    const status = booking.status?.toLowerCase() || 'pending';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([status, count]) => {
                  const statusInfo = getStatusConfig(status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div key={status} className="flex items-center space-x-1">
                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                      <span className="capitalize">{status}: {count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-gray-500">
                Total: {bookings.length} bookings
              </div>
            </div>
          </div>
        )}

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
        `}</style>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
            style={{
              animation: 'modalSlideIn 0.3s ease-out forwards'
            }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Booking Details</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Booking Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      Booking Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Booking ID</span>
                        <div className="font-mono text-sm bg-white px-3 py-2 rounded-lg border mt-1">
                          {selectedBooking._id}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <div className="mt-1">
                          {(() => {
                            const statusInfo = getStatusConfig(selectedBooking.status);
                            const StatusIcon = statusInfo.icon;
                            return (
                              <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                <StatusIcon className="h-4 w-4 mr-2" />
                                {statusInfo.label}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Service Details</span>
                        <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm">
                          {selectedBooking.serviceDetails || 'No details provided'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Schedule Info */}
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      Schedule Information
                    </h4>
                    <div className="space-y-3">
                      {(() => {
                        const dateInfo = formatDate(selectedBooking.scheduledTime);
                        return (
                          <>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Date</span>
                              <div className="text-lg font-semibold text-gray-900 mt-1">
                                {dateInfo.fullDate}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Time</span>
                              <div className="text-lg font-semibold text-gray-900 mt-1">
                                {dateInfo.fullTime}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {(selectedBooking.userId?.name || 'N/A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Name</div>
                      <div className="font-semibold text-gray-900">
                        {selectedBooking.userId?.name || 'Not Available'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">
                        {selectedBooking.userId?.email || 'Not Available'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Provider Information */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 text-purple-600 mr-2" />
                  Service Provider Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {(selectedBooking.serviceId?.name || 'N/A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Provider Name</div>
                      <div className="font-semibold text-gray-900">
                        {selectedBooking.serviceId?.name || 'Not Available'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Location</div>
                      <div className="font-medium text-gray-900">
                        {selectedBooking.serviceId?.location || 'Not Available'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {selectedBooking.createdAt && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Created At</span>
                      <div className="text-gray-900 mt-1">
                        {formatDate(selectedBooking.createdAt).fullDate}
                      </div>
                    </div>
                    {selectedBooking.updatedAt && (
                      <div>
                        <span className="font-medium text-gray-500">Last Updated</span>
                        <div className="text-gray-900 mt-1">
                          {formatDate(selectedBooking.updatedAt).fullDate}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </>
  );
};

export default BookingTable;