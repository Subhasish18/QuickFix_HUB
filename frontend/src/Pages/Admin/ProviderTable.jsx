import React, { useState } from 'react';
import { Users, MapPin, Mail, Eye, Trash2, MoreHorizontal, Building2, X, Phone, Calendar, AlertTriangle } from 'lucide-react';
import axios from 'axios';

// Toast notification component
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

// Consistent Design System (aligned with BookingTable)
const dashboardStyles = {
  card: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md",
  cardHeader: "bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4", // Aligned with BookingTable
  cardTitle: "text-xl font-bold text-white flex items-center space-x-3", // Aligned with BookingTable
  cardBadge: "bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-medium text-black", // Aligned with BookingTable
  tableContainer: "overflow-x-auto",
  table: "w-full divide-y divide-gray-200",
  tableHeader: "bg-gray-50 border-b border-gray-200",
  tableHeaderCell: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
  tableBody: "bg-white divide-y divide-gray-200",
  tableRow: "transition-all duration-200 hover:bg-blue-50 hover:shadow-md",
  tableCell: "px-6 py-4 whitespace-nowrap text-sm",
  primaryButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200",
  secondaryButton: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200",
  iconButton: "text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200", // Aligned with BookingTable
  dangerButton: "text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-100 transition-all duration-200", // Aligned with BookingTable
  avatar: "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white",
  avatarLarge: "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white bg-gradient-to-r from-blue-400 to-purple-500" // Aligned with BookingTable
};

const ProviderTable = ({ providers = [], onView, onRefresh }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProviderId, setDeleteProviderId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [localProviders, setLocalProviders] = useState(providers);

  // Update localProviders when prop changes
  React.useEffect(() => {
    setLocalProviders(providers);
  }, [providers]);

  // Toast management
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const truncateId = (id) => {
    if (!id) return 'N/A';
    return `#${id.substring(0, 6)}`;
  };

  const truncateEmail = (email) => {
    if (!email) return 'N/A';
    if (email.length > 25) {
      return email.substring(0, 22) + '...';
    }
    return email;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        fullDate: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        fullTime: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    } catch {
      return { date: 'Invalid Date', time: '', fullDate: 'Invalid Date', fullTime: '' };
    }
  };

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
    showToast('Provider details loaded', 'info');
  };

  const handleDeleteClick = (providerId) => {
    setDeleteProviderId(providerId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProviderId) return;
    
    setIsDeleting(true);
    try {
      const response = await axios.delete(`https://quickfix-hub.onrender.com/api/admin/providers/${deleteProviderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        showToast('✅ Provider deleted successfully', 'success');
        // Update local state to rerender table
        setLocalProviders(prev => prev.filter(p => p._id !== deleteProviderId));
        // Trigger parent refresh
        if (onRefresh) onRefresh();
      } else {
        throw new Error(response.data.message || 'Failed to delete provider');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast(`❌ Failed to delete provider: ${error.response?.data?.message || 'Try again'}`, 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteProviderId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
  };

  return (
    <>
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
              <span>Service Providers</span>
            </h3>
            <div className={dashboardStyles.cardBadge}>
              {localProviders.length} {localProviders.length === 1 ? 'provider' : 'providers'} active
            </div>
          </div>
        </div>

        <div className={dashboardStyles.tableContainer}>
          {localProviders && localProviders.length > 0 ? (
            <table className={dashboardStyles.table}>
              <thead className={dashboardStyles.tableHeader}>
                <tr>
                  <th className={dashboardStyles.tableHeaderCell}>ID</th>
                  <th className={dashboardStyles.tableHeaderCell}>Provider</th>
                  <th className={dashboardStyles.tableHeaderCell}>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                  </th>
                  <th className={dashboardStyles.tableHeaderCell}>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>Contact</span>
                    </div>
                  </th>
                  <th className={dashboardStyles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className={dashboardStyles.tableBody}>
                {localProviders.map((provider, index) => (
                  <tr
                    key={provider._id}
                    className={`${dashboardStyles.tableRow} ${hoveredRow === index ? 'transform scale-[1.01]' : ''}`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className={dashboardStyles.tableCell}>
                      <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
                        {truncateId(provider._id)}
                      </span>
                    </td>
                    <td className={dashboardStyles.tableCell}>
                      <div className="flex items-center space-x-3">
                        <div className={dashboardStyles.avatarLarge}>
                          {(provider.name || 'N/A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{provider.name || 'Unknown Provider'}</div>
                          <div className="text-xs text-gray-500">Service Provider</div>
                        </div>
                      </div>
                    </td>
                    <td className={dashboardStyles.tableCell}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {provider.city
                              ? `${provider.city}${provider.state ? ', ' + provider.state : ''}, India`
                              : 'Not specified'}
                          </span>
                      </div>
                    </td>
                    <td className={dashboardStyles.tableCell}>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900" title={provider.email}>
                          {truncateEmail(provider.email)}
                        </span>
                      </div>
                    </td>
                    <td className={dashboardStyles.tableCell}>
                      <div className="flex items-center space-x-1 justify-end">
                        <button
                          onClick={() => handleViewProvider(provider)}
                          className={dashboardStyles.iconButton}
                          title="View Provider Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(provider._id)}
                          className={dashboardStyles.dangerButton}
                          title="Delete Provider"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {/* <button className={dashboardStyles.iconButton} title="More Options">
                          <MoreHorizontal className="h-4 w-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center max-w-sm">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No providers registered</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Service providers will appear here once they register on your platform.
                </p>
                <button className={dashboardStyles.primaryButton}>
                  Add New Provider
                </button>
              </div>
            </div>
          )}
        </div>

        {localProviders && localProviders.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium">Active Providers</span>
                  <span className="text-gray-400">({localProviders.length})</span>
                </div>
              </div>
              <span className="font-medium">
                Total: {localProviders.length} {localProviders.length === 1 ? 'provider' : 'providers'}
              </span>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Provider Details</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                      Provider Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Provider ID</span>
                        <div className="font-mono text-sm bg-white px-3 py-2 rounded-lg border mt-1">
                          {selectedProvider._id}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Provider Name</span>
                        <div className="flex items-center mt-1">
                          <div className={dashboardStyles.avatarLarge}>
                            {(selectedProvider.name || 'N/A').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 text-lg ml-3">
                            {selectedProvider.name || 'Not Available'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Service Type</span>
                        <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm">
                          {selectedProvider.serviceTypes || 'General Services'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Email</div>
                          <div className="font-medium text-gray-900">
                            {selectedProvider.email || 'Not Available'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Phone</div>
                          <div className="font-medium text-gray-900">
                            {selectedProvider.phoneNumber || 'Not Available'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">Location</div>
                          <div className="font-medium text-gray-900">
                           {selectedProvider.city 
                              ? `${selectedProvider.city}${selectedProvider.state ? ', ' + selectedProvider.state : ''}, India`
                              : 'Not Available'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 text-purple-600 mr-2" />
                  Service Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Description</span>
                    <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm min-h-[60px]">
                      {selectedProvider.description || 'No description provided'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">pricingModel ₹/hr</span>
                    <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm">
                      {`${selectedProvider.pricingModel}` || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
              {(selectedProvider.createdAt || selectedProvider.updatedAt) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                    Registration Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {selectedProvider.createdAt && (
                      <div>
                        <span className="font-medium text-gray-500">Registered On</span>
                        <div className="text-gray-900 mt-1">
                          {formatDate(selectedProvider.createdAt).fullDate}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {formatDate(selectedProvider.createdAt).fullTime}
                        </div>
                      </div>
                    )}
                    {selectedProvider.updatedAt && (
                      <div>
                        <span className="font-medium text-gray-500">Last Updated</span>
                        <div className="text-gray-900 mt-1">
                          {formatDate(selectedProvider.updatedAt).fullDate}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {formatDate(selectedProvider.updatedAt).fullTime}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={() => handleDeleteClick(selectedProvider._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Provider</span>
                </button>
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Provider</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this service provider? This will also remove all associated bookings.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
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
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        tbody tr {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default ProviderTable;