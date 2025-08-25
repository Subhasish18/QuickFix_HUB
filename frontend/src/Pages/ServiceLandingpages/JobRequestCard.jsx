import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { MapPin, ChevronDown, ChevronUp, CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react';
import Map from '../Components/Map';
// import './JobRequestsCard.css';

const dashboardStyles = {
  card: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md",
  cardHeader: "bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4",
  cardTitle: "text-xl font-bold text-white flex items-center space-x-3",
  primaryButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2",
  secondaryButton: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2",
};

const Toast = ({ message, type, onClose }) => {
  const toastStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
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
              <AlertTriangle className="h-4 w-4" />
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobRequestsCard = () => {
  const [jobRequests, setJobRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mapCollapsedStates, setMapCollapsedStates] = useState({});

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 2000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const [toasts, setToasts] = useState([]);

  const fetchJobRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in.');
        showToast('Please log in to view job requests.', 'error');
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      const res = await axios.get('http://localhost:5000/api/provider-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobRequests(res.data.bookings || []);
      setMapCollapsedStates(
        res.data.bookings.reduce((acc, job) => ({ ...acc, [job._id]: true }), {})
      );
      showToast('Job requests loaded successfully 🚀', 'success');
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch job requests');
      showToast('❌ Failed to fetch job requests. Please try again.', 'error');
      setLoading(false);
      console.error('JobRequestsCard: Error fetching job requests:', err);
    }
  };

  useEffect(() => {
    fetchJobRequests();
  }, []);

  const acceptJob = async (jobId) => {
    try {
      const now = new Date().toISOString();
      const response = await fetch(`http://localhost:5000/api/bookings/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', confirmedAt: now }),
      });
      if (!response.ok) throw new Error('Failed to update booking status');
      await response.json();
      await fetchJobRequests();
      showToast('Job request accepted successfully 🎉', 'success');
    } catch (err) {
      showToast('❌ Failed to accept job request. Please try again.', 'error');
      console.error('Error accepting job:', err);
    }
  };

  const declineJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Declined' }),
      });
      if (!response.ok) throw new Error('Failed to update booking status');
      await response.json();
      await fetchJobRequests();
      showToast('Job request rejected ❌', 'info');
    } catch (err) {
      showToast('❌ Failed to decline job request. Please try again.', 'error');
      console.error('Error declining job:', err);
    }
  };

  const confirmAndExecute = (actionFn, jobId, actionType) => {
    setConfirmAction(() => () => actionFn(jobId));
    setShowConfirm(true);
  };

  const toggleMap = (jobId) => {
    setMapCollapsedStates(prev => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const pendingRequests = jobRequests.filter((job) => job.status === 'pending');
  const acceptedRequests = jobRequests.filter((job) => job.status === 'confirmed');
  const declinedRequests = jobRequests.filter((job) => job.status === 'Declined');

  return (
    <motion.div
      className={dashboardStyles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        .collapsible-section {
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
          overflow: hidden;
        }
        .collapsible-section.collapsed {
          max-height: 0;
          opacity: 0;
        }
        .collapsible-section.expanded {
          max-height: 300px; /* Adjust based on map height */
          opacity: 1;
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

      <div className={dashboardStyles.cardHeader}>
        <h2 className={dashboardStyles.cardTitle}>
          <MapPin className="h-6 w-6 text-white" />
          <span className="font-['Inter']">Job Requests</span>
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-500 font-['Inter'] animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          Manage your incoming service requests
        </p>

        <div className="flex flex-wrap gap-2 mb-4 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          {[
            { key: 'pending', label: 'Pending', count: pendingRequests.length },
            { key: 'accepted', label: 'Accepted', count: acceptedRequests.length },
            { key: 'declined', label: 'Declined', count: declinedRequests.length },
          ].map((tab, index) => (
            <motion.button
              key={tab.key}
              className={`px-4 py-2 rounded-lg font-medium text-sm font-['Inter'] flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {tab.label}
              {Number.isFinite(tab.count) && tab.count > 0 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-['Inter']">Loading job requests...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-xl p-4 text-center animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <p className="text-red-600 font-['Inter']">{error}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'pending' && (
                <div className="flex flex-col gap-4">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((job, index) => (
                      <motion.div
                        key={job._id}
                        className="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start mb-2">
                          <h3 className="text-base font-semibold text-gray-800 font-['Inter']">
                            {job.serviceDetails || job.type}
                          </h3>
                          <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs text-center leading-snug font-['Inter']">
                            {job.scheduledTime
                              ? new Date(job.scheduledTime).toLocaleDateString()
                              : job.date}
                            <br />
                            {job.scheduledTime
                              ? new Date(job.scheduledTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : job.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                          {job.customer || job.userId?.name || ''}
                        </p>
                        <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                          {job.description}
                        </p>
                        <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                          {job.address
                            ? `${job.address}${job.city && job.state ? `, ${job.city}, ${job.state}` : ''}`
                            : job.city && job.state
                              ? `${job.city}, ${job.state}`
                              : job.userId?.city && job.userId?.state
                                ? `${job.userId.city}, ${job.userId.state}`
                                : 'Location not specified'}
                        </p>
                        {job.userId?.city && job.userId?.state && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center font-['Inter']">
                                <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                                Location
                              </h4>
                              <button
                                onClick={() => toggleMap(job._id)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-2 font-['Inter']"
                                aria-expanded={!mapCollapsedStates[job._id]}
                                aria-label={mapCollapsedStates[job._id] ? 'Show location map' : 'Hide location map'}
                              >
                                {mapCollapsedStates[job._id] ? (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    <span>Show Map</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span>Hide Map</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className={`collapsible-section ${mapCollapsedStates[job._id] ? 'collapsed' : 'expanded'}`}>
                              <div className="w-full rounded-lg overflow-hidden shadow-md">
                                <Map city={job.userId.city} state={job.userId.state} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 mt-3">
                          <motion.button
                            className={dashboardStyles.primaryButton}
                            onClick={() => confirmAndExecute(acceptJob, job._id, 'accept')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Accept</span>
                          </motion.button>
                          <motion.button
                            className={dashboardStyles.secondaryButton}
                            onClick={() => confirmAndExecute(declineJob, job._id, 'decline')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Decline</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-4 text-gray-600 text-sm font-['Inter']"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      No pending requests
                    </motion.div>
                  )}
                </div>
              )}
              {activeTab === 'accepted' && (
                <div className="flex flex-col gap-4">
                  {acceptedRequests.length > 0 ? (
                    acceptedRequests.map((job, index) => (
                      <motion.div
                        key={job._id}
                        className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-slate-700 font-['Inter']">Customer:</span>
                            <span className="text-sm text-slate-600 font-medium font-['Inter']">
                              {job.customer || job.userId?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                            <span className="text-sm font-semibold text-slate-700 font-['Inter']">Description:</span>
                            <span className="text-sm text-slate-600 leading-relaxed font-['Inter']">
                              {job.serviceDetails || job.type}
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                            <span className="text-sm font-semibold text-slate-700 font-['Inter']">Location:</span>
                            <span className="text-sm text-slate-600 font-['Inter']">
                              {job.city && job.state
                                ? `${job.city}, ${job.state}`
                                : job.address || job.userId?.location || 'Location not specified'}
                            </span>
                          </div>
                          {job.userId?.city && job.userId?.state && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-900 flex items-center font-['Inter']">
                                  <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                                  Location
                                </h4>
                                <button
                                  onClick={() => toggleMap(job._id)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-2 font-['Inter']"
                                  aria-expanded={!mapCollapsedStates[job._id]}
                                  aria-label={mapCollapsedStates[job._id] ? 'Show location map' : 'Hide location map'}
                                >
                                  {mapCollapsedStates[job._id] ? (
                                    <>
                                      <ChevronDown className="h-4 w-4" />
                                      <span>Show Map</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronUp className="h-4 w-4" />
                                      <span>Hide Map</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className={`collapsible-section ${mapCollapsedStates[job._id] ? 'collapsed' : 'expanded'}`}>
                                <div className="w-full rounded-lg overflow-hidden shadow-md">
                                  <Map city={job.userId.city} state={job.userId.state} />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                              <span className="text-sm font-bold text-indigo-800 font-['Inter']">Job Schedule</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                <span className="text-xs font-semibold text-indigo-600 block mb-1 font-['Inter']">📅 Date:</span>
                                <span className="text-sm text-indigo-800 font-medium font-['Inter']">
                                  {job.scheduledTime
                                    ? new Date(job.scheduledTime).toLocaleDateString()
                                    : job.date}
                                </span>
                              </div>
                              <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                <span className="text-xs font-semibold text-indigo-600 block mb-1 font-['Inter']">⏰ Time:</span>
                                <span className="text-sm text-indigo-800 font-medium font-['Inter']">
                                  {job.scheduledTime
                                    ? new Date(job.scheduledTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : job.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {job.confirmedAt && (
                          <div className="mt-6">
                            <div className="w-full sm:max-w-md px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-md text-center">
                              <span className="block text-sm font-semibold mb-1 font-['Inter']">✓ CONFIRMED</span>
                              <span className="block text-sm opacity-90 font-['Inter']">
                                {new Date(job.confirmedAt).toLocaleDateString()}
                              </span>
                              <span className="block text-sm opacity-90 font-['Inter']">
                                {new Date(job.confirmedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-4 text-gray-600 text-sm font-['Inter']"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      No accepted jobs
                    </motion.div>
                  )}
                </div>
              )}
              {activeTab === 'declined' && (
                <div className="flex flex-col gap-4">
                  {declinedRequests.length > 0 ? (
                    declinedRequests.map((job, index) => (
                      <motion.div
                        key={job._id}
                        className="bg-red-50 p-4 rounded-lg border border-red-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start mb-2">
                          <h3 className="text-base font-semibold text-gray-800 font-['Inter']">
                            {job.serviceDetails || job.type}
                          </h3>
                          <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs text-center leading-snug font-['Inter']">
                            {job.scheduledTime
                              ? new Date(job.scheduledTime).toLocaleDateString()
                              : job.date}
                            <br />
                            {job.scheduledTime
                              ? new Date(job.scheduledTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : job.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                          {job.customer || job.userId?.name || ''}
                        </p>
                        <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                          {job.description}
                        </p>
                        <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                          {job.address
                            ? `${job.address}${job.city && job.state ? `, ${job.city}, ${job.state}` : ''}`
                            : job.city && job.state
                              ? `${job.city}, ${job.state}`
                              : job.userId?.city && job.userId?.state
                                ? `${job.userId.city}, ${job.userId.state}`
                                : 'Location not specified'}
                        </p>
                        <div className="mt-3">
                          <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-['Inter']">
                            Declined
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-4 text-gray-600 text-sm font-['Inter']"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      No declined requests
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <motion.div
          className="mt-4 pt-4 border-t border-gray-200 animate-slideInUp"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.button
            className={dashboardStyles.secondaryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchJobRequests}
          >
            <span>Refresh Requests</span>
          </motion.button>
        </motion.div>
      </div>

      <ConfirmDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={() => {
          if (confirmAction) confirmAction();
          setShowConfirm(false);
        }}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
      />
    </motion.div>
  );
};

export default JobRequestsCard;