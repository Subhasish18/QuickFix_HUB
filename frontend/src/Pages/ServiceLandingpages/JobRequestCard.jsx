import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const JobRequestsCard = () => {
  // Get providerId from localStorage (stored as 'userid')
  const providerId = localStorage.getItem('userId');
 console.log('Provider ID:', providerId);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchJobRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch job requests for this provider from backend
        console.log('Fetching job requests for provider:', providerId);
        const url = `http://localhost:5000/api/provider-bookings/provider/${providerId}`;
        console.log('Fetching job requests from:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch job requests');
        }
        const data = await response.json();
        setRequests(data.bookings || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job requests');
        setLoading(false);
        console.error('JobRequestsCard: Error fetching job requests:', err);
      }
    };

  useEffect(() => {
    if (providerId) {
      fetchJobRequests();
    }
  }, [providerId]);

  const acceptJob = async (jobId) => {
    try {
      const now = new Date().toISOString();
      const response = await fetch(`http://localhost:5000/api/bookings/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', confirmedAt: now })
      });
      if (!response.ok) throw new Error('Failed to update booking status');
      await response.json();
      fetchJobRequests();
      alert("Job Confirmed: You've successfully confirmed this job request.");
    } catch (err) {
      alert("Failed to confirm job.");
      console.error(err);
    }
  };

  const declineJob = async (jobId) => {
    // You may want to call an API to update status in DB
    setRequests(prevRequests =>
      prevRequests.map(job =>
        job._id === jobId ? { ...job, status: "declined" } : job
      )
    );
    alert("Job Declined: You've declined this job request.");
  };

  const pendingRequests = requests.filter(job => job.status === "pending");
  const acceptedRequests = requests.filter(job => job.status === "confirmed");
  

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 sm:p-6">
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-indigo-900 mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Job Requests
        </motion.h2>
        <motion.p
          className="text-xs sm:text-sm text-gray-600 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Manage your incoming service requests
        </motion.p>
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
          {[
            { key: 'pending', label: 'Pending', count: pendingRequests.length },
            { key: 'accepted', label: 'Accepted', count: acceptedRequests.length },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
              }`}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
              {Number.isFinite(tab.count) && tab.count > 0 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs sm:text-sm">
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-4 text-gray-600 text-xs sm:text-sm">
            Loading job requests...
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-600 text-xs sm:text-sm">
            {error}
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
                          className="bg-indigo-50 p-4 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start mb-2">
                            <h3 className="text-base font-semibold text-gray-800">
                              {job.serviceDetails || job.type}
                            </h3>
                            <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs sm:text-sm text-center leading-snug">
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

                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            {job.customer || job.userId?.name || ''}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            {job.description}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            {job.address || job.location || ''}
                          </p>

                          <div className="flex flex-col sm:flex-row gap-3 mt-3">
                            <motion.button
                              className="px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg"
                              onClick={() => acceptJob(job._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Accept
                            </motion.button>
                            <motion.button
                              className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-indigo-100 hover:text-indigo-800"
                              onClick={() => declineJob(job._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Decline
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="text-center py-4 text-gray-600 text-xs sm:text-sm"
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
                    acceptedRequests.map((job, index) => {
                      console.log(job); // Optional debug

                      return (
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
                              <span className="text-sm font-semibold text-slate-700">Customer:</span>
                              <span className="text-sm text-slate-600 font-medium">
                                {job.customer || job.userId?.name || 'N/A'}
                              </span>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                              <span className="text-sm font-semibold text-slate-700">Description:</span>
                              <span className="text-sm text-slate-600 leading-relaxed">
                                {job.serviceDetails || job.type}
                              </span>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                              <span className="text-sm font-semibold text-slate-700">Location:</span>
                              <span className="text-sm text-slate-600">
                                {job.address || job.location || 'N/A'}
                              </span>
                            </div>

                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span className="text-sm font-bold text-indigo-800">Job Schedule</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                  <span className="text-xs font-semibold text-indigo-600 block mb-1">📅 Date:</span>
                                  <span className="text-sm text-indigo-800 font-medium">
                                    {job.scheduledTime
                                      ? new Date(job.scheduledTime).toLocaleDateString()
                                      : job.date}
                                  </span>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                  <span className="text-xs font-semibold text-indigo-600 block mb-1">⏰ Time:</span>
                                  <span className="text-sm text-indigo-800 font-medium">
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
                                <span className="block text-sm font-semibold mb-1">
                                  ✓ CONFIRMED
                                </span>
                                <span className="block text-sm opacity-90">
                                  {new Date(job.confirmedAt).toLocaleDateString()}
                                </span>
                                <span className="block text-sm opacity-90">
                                  {new Date(job.confirmedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  ): (
                    <motion.div
                      className="text-center py-4 text-gray-600 text-xs sm:text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      No accepted jobs
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
        <motion.div
          className="mt-4 pt-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.button
            className="w-full px-4 py-2 sm:px-6 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-indigo-100 hover:text-indigo-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Requests
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JobRequestsCard;