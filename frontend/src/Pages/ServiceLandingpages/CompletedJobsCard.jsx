import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Map from '../Components/Map';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CompletedJobsCard = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          toast.error('You must be logged in to view completed jobs.');
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch('http://localhost:5000/api/provider-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch completed jobs');

        const data = await response.json();
        const jobs = (data.bookings || []).filter(job => job.status === 'completed');
        setCompletedJobs(jobs);
      } catch (err) {
        toast.error('Failed to load completed jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedJobs();
  }, []);

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-green-700 bg-green-100';
      case 'Pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'Unpaid':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
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
          <div className="flex justify-center py-8">
            <div className="spinner-border text-indigo-600" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : completedJobs.length === 0 ? (
          <div className="text-gray-500">No completed jobs found.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {completedJobs.map((job, index) => (
              <motion.div
                key={job._id}
                className="pb-4 border-b border-gray-200 last:border-b-0 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
                  {/* Left Section */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm flex items-center">
                        <i className="bi bi-check me-1"></i> Completed
                      </span>
                      <span className="text-sm text-gray-600">
                        {job.scheduledTime
                          ? new Date(job.scheduledTime).toLocaleDateString()
                          : 'Date not available'}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-800 mt-2">
                      {job.serviceDetails || job.type || 'Service completed'}
                    </h3>

                    <p className="text-sm text-gray-600 mb-1">
                      {job.customer || job.userId?.name || 'Unknown Customer'}
                    </p>

                    <p className="text-sm text-gray-600 mb-1">
                      {job.address
                        ? `${job.address}${job.city && job.state ? `, ${job.city}, ${job.state}` : ''}`
                        : job.userId?.city && job.userId?.state
                        ? `${job.userId.city}, ${job.userId.state}`
                        : 'Location not specified'}
                    </p>

                    {/* Map */}
                    {job.userId?.city && job.userId?.state && (
                      <div className="mt-4">
                        <div className="w-full aspect-video min-h-[200px] rounded-xl overflow-hidden shadow">
                          <Map city={job.userId.city} state={job.userId.state} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end">
                    <span className="text-base font-semibold text-green-600">
                      {job.price ? `₹${job.price}` : ''}
                    </span>

                    {job.paymentStatus && (
                      <span
                        className={`mt-1 px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${getPaymentStatusStyle(job.paymentStatus)}`}
                      >
                        {job.paymentStatus === 'Paid' && <i className="bi bi-check-circle-fill"></i>}
                        {job.paymentStatus === 'Pending' && <i className="bi bi-hourglass-split"></i>}
                        {job.paymentStatus === 'Unpaid' && <i className="bi bi-x-circle-fill"></i>}
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
