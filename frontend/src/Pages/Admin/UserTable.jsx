import React, { useState } from 'react';
import { Users, Mail, Eye, Trash2, MoreHorizontal, UserPlus, User, X, Phone, Calendar, AlertTriangle } from 'lucide-react';
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

// Consistent Design System (aligned with ProviderTable and BookingTable)
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
  iconButton: "text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200",
  dangerButton: "text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-100 transition-all duration-200",
  avatar: "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white",
  avatarLarge: "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white bg-gradient-to-r from-blue-400 to-purple-500"
};

const UserTable = ({ users = [], onView, onRefresh }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [localUsers, setLocalUsers] = useState(users);

  // Update localUsers when prop changes
  React.useEffect(() => {
    setLocalUsers(users);
  }, [users]);

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

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    showToast('User details loaded', 'info');
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    
    setIsDeleting(true);
    try {
      const response = await axios.delete(`https://quickfix-hub.onrender.com/api/admin/users/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        showToast('✅ User deleted successfully', 'success');
        setLocalUsers(prev => prev.filter(u => u._id !== deleteUserId));
        if (onRefresh) onRefresh();
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast(`❌ Failed to delete user: ${error.response?.data?.message || 'Try again'}`, 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteUserId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
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
              <Users className="h-6 w-6 text-white" />
              <span>Registered Users</span>
            </h3>
            <div className={dashboardStyles.cardBadge}>
              {localUsers.length} {localUsers.length === 1 ? 'user' : 'users'}
            </div>
          </div>
        </div>

        <div className={dashboardStyles.tableContainer}>
          {localUsers && localUsers.length > 0 ? (
            <table className={dashboardStyles.table}>
              <thead className={dashboardStyles.tableHeader}>
                <tr>
                  <th className={dashboardStyles.tableHeaderCell}>ID</th>
                  <th className={dashboardStyles.tableHeaderCell}>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>User</span>
                    </div>
                  </th>
                  <th className={dashboardStyles.tableHeaderCell}>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                  </th>
                  <th className={dashboardStyles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className={dashboardStyles.tableBody}>
                {localUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`${dashboardStyles.tableRow} ${hoveredRow === index ? 'transform scale-[1.01]' : ''}`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className={dashboardStyles.tableCell}>
                      <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
                        {truncateId(user._id)}
                      </span>
                    </td>
                    <td className={dashboardStyles.tableCell}>
                      <div className="flex items-center space-x-3">
                        <div className={dashboardStyles.avatarLarge}>
                          {(user.name || 'N/A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name || 'Unknown User'}</div>
                          <div className="text-xs text-gray-500">Customer</div>
                        </div>
                      </div>
                    </td>
                    <td className={dashboardStyles.tableCell}>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900" title={user.email}>
                          {truncateEmail(user.email)}
                        </span>
                      </div>
                    </td>
                    <td className={dashboardStyles.tableCell}>
                      <div className="flex items-center space-x-1 justify-end">
                        <button
                          onClick={() => handleViewUser(user)}
                          className={dashboardStyles.iconButton}
                          title="View User Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          className={dashboardStyles.dangerButton}
                          title="Delete User"
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
                  <UserPlus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users registered</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Customer accounts will appear here once users start registering.
                </p>
                <button className={dashboardStyles.primaryButton}>
                  Invite Users
                </button>
              </div>
            </div>
          )}
        </div>

        {localUsers && localUsers.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Registered Users</span>
                  <span className="text-gray-400">({localUsers.length})</span>
                </div>
              </div>
              <span className="font-medium">
                Total: {localUsers.length} {localUsers.length === 1 ? 'user' : 'users'}
              </span>
            </div>
          </div>
        )}

        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-white" />
                    <h3 className="text-xl font-bold text-white">User Details</h3>
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
                        <User className="h-5 w-5 text-blue-600 mr-2" />
                        User Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">User ID</span>
                          <div className="font-mono text-sm bg-white px-3 py-2 rounded-lg border mt-1">
                            {selectedUser._id}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Name</span>
                          <div className="flex items-center mt-1">
                            <div className={dashboardStyles.avatarLarge}>
                              {(selectedUser.name || 'N/A').charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900 text-lg ml-3">
                              {selectedUser.name || 'Not Available'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Role</span>
                          <div className="bg-white px-3 py-2 rounded-lg border mt-1 text-sm">
                            {selectedUser.role || 'Customer'}
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
                              {selectedUser.email || 'Not Available'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-500">Phone</div>
                            <div className="font-medium text-gray-900">
                              {selectedUser.phoneNumber || 'Not Available'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(selectedUser.createdAt || selectedUser.updatedAt) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                      Registration Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {selectedUser.createdAt && (
                        <div>
                          <span className="font-medium text-gray-500">Registered On</span>
                          <div className="text-gray-900 mt-1">
                            {formatDate(selectedUser.createdAt).fullDate}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {formatDate(selectedUser.createdAt).fullTime}
                          </div>
                        </div>
                      )}
                      {selectedUser.updatedAt && (
                        <div>
                          <span className="font-medium text-gray-500">Last Updated</span>
                          <div className="text-gray-900 mt-1">
                            {formatDate(selectedUser.updatedAt).fullDate}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {formatDate(selectedUser.updatedAt).fullTime}
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
                    onClick={() => handleDeleteClick(selectedUser._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete User</span>
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
                    <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this user? This will also remove all associated bookings.
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
      </div>
    </>
  );
};

export default UserTable;