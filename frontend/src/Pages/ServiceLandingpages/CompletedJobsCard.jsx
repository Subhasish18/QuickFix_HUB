import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CompletedJobsCard = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const providerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/provider-bookings/provider/${providerId}`);
        if (!response.ok) throw new Error('Failed to fetch completed jobs');
        const data = await response.json();
        // Filter for completed jobs only
        setCompletedJobs((data.bookings || []).filter(job => job.status === 'completed'));
        setLoading(false);
      } catch (err) {
        setError('Failed to load completed jobs');
        setLoading(false);
      }
    };
    if (providerId) fetchCompletedJobs();
  }, [providerId]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <motion.svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 h-3 sm:w-4 sm:h-4"
        fill={i < rating ? '#facc15' : '#e5e7eb'}
        viewBox="0 0 16 16"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </motion.svg>
    ));
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 sm:p-6">
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Recent Completed Jobs
        </motion.h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {completedJobs.length === 0 ? (
              <div>No completed jobs found.</div>
            ) : (
              completedJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  className="pb-4 border-b border-gray-200 last:border-b-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm flex items-center">
                          <i className="bi bi-check me-1"></i>
                          Completed
                        </span>
                        <span className="text-sm text-gray-600">
                          {job.scheduledTime
                            ? new Date(job.scheduledTime).toLocaleDateString()
                            : job.date}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-800 mt-2">{job.serviceDetails || job.type}</h3>
                      <p className="text-sm text-gray-600 mb-1">{job.customer || job.userId?.name || ''}</p>
                      {/* Optionally, add rating/feedback here if available */}
                    </div>
                    <span className="text-base font-semibold text-green-600">
                      {job.price ? `₹${job.price}` : ''}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompletedJobsCard;