import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { MapPin, ChevronDown, ChevronUp, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import Map from '../Components/Map';
// import './CompletedJobsCard.css';

const dashboardStyles = {
  card: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md",
  cardHeader: "bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4",
  cardTitle: "text-xl font-bold text-white flex items-center space-x-3",
};

const Toast = ({ message, type, onClose }) => {
  const toastStyles = {
    error: 'bg-red-500 border-red-600',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${toastStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg border-l-4 flex items-center space-x-2 min-w-[300px] animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white hover:text-gray-200">
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
};

const CompletedJobsCard = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [mapCollapsedStates, setMapCollapsedStates] = useState({});

  const showToast = (message, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 2000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          showToast('You must be logged in to view completed jobs.');
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch('https://quickfix-hub.onrender.com/api/provider-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch completed jobs');

        const data = await response.json();
        const jobs = (data.bookings || []).filter(job => job.status === 'completed');
        setCompletedJobs(jobs);
        setMapCollapsedStates(
          jobs.reduce((acc, job) => ({ ...acc, [job._id]: true }), {})
        );
      } catch (err) {
        showToast('Failed to load completed jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedJobs();
  }, []);

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Unpaid':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleMap = (jobId) => {
    setMapCollapsedStates(prev => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

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
          <span className="font-['Inter']">Recent Completed Jobs</span>
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 animate-slideInUp">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-['Inter']">Loading completed jobs...</p>
          </div>
        ) : completedJobs.length === 0 ? (
          <div className="text-gray-500 text-sm font-['Inter'] text-center py-4 animate-slideInUp">
            No completed jobs found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {completedJobs.map((job, index) => (
              <motion.div
                key={job._id}
                className="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
                  {/* Left Section */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm flex items-center font-['Inter']">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                      <span className="text-sm text-gray-600 font-['Inter']">
                        {job.scheduledTime
                          ? new Date(job.scheduledTime).toLocaleDateString()
                          : 'Date not available'}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-800 font-['Inter']">
                      {job.serviceDetails || job.type || 'Service completed'}
                    </h3>

                    <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                      {job.customer || job.userId?.name || 'Unknown Customer'}
                    </p>

                    <p className="text-sm text-gray-600 mb-1 font-['Inter']">
                      {job.address
                        ? `${job.address}${job.city && job.state ? `, ${job.city}, ${job.state}` : ''}`
                        : job.userId?.city && job.userId?.state
                        ? `${job.userId.city}, ${job.userId.state}`
                        : 'Location not specified'}
                    </p>

                    {/* Map */}
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
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end">
                    <span className="text-base font-semibold text-green-600 font-['Inter']">
                      {job.price ? `₹${job.price}` : ''}
                    </span>

                    {job.paymentStatus && (
                      <span
                        className={`mt-1 px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 font-['Inter'] ${getPaymentStatusStyle(job.paymentStatus)}`}
                      >
                        {job.paymentStatus === 'Paid' && <CheckCircle className="h-4 w-4" />}
                        {job.paymentStatus === 'Pending' && <Hourglass className="h-4 w-4" />}
                        {job.paymentStatus === 'Unpaid' && <XCircle className="h-4 w-4" />}
                        {job.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompletedJobsCard;