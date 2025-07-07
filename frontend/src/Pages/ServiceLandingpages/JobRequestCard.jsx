import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const jobRequests = [
  {
    id: "job-1",
    customer: "Erwin",
    type: "Pipe Leak",
    address: "123 Maple St, Lakewood",
    date: "May 5, 2025",
    time: "10:00 AM - 12:00 PM",
    description: "Water leaking from under kitchen sink, needs urgent attention.",
    status: "pending"
  },
  {
    id: "job-2",
    customer: "James",
    type: "Toilet Installation",
    address: "45 Oak Ave, Lakewood",
    date: "May 7, 2025",
    time: "1:00 PM - 4:00 PM",
    description: "New toilet needs installation in master bathroom.",
    status: "pending"
  },
  {
    id: "job-3",
    customer: "John",
    type: "Shower Repair",
    address: "789 Pine Dr, Lakewood",
    date: "May 8, 2025",
    time: "9:00 AM - 11:00 AM",
    description: "Shower head not working properly, low water pressure.",
    status: "pending"
  }
];

const JobRequestsCard = () => {
  const [requests, setRequests] = useState(jobRequests);
  const [activeTab, setActiveTab] = useState('pending');

  const acceptJob = (jobId) => {
    setRequests(prevRequests =>
      prevRequests.map(job => 
        job.id === jobId ? { ...job, status: "accepted" } : job
      )
    );
    alert("Job Accepted: You've successfully accepted this job request.");
  };

  const declineJob = (jobId) => {
    setRequests(prevRequests =>
      prevRequests.map(job => 
        job.id === jobId ? { ...job, status: "declined" } : job
      )
    );
    alert("Job Declined: You've declined this job request.");
  };

  const pendingRequests = requests.filter(job => job.status === "pending");
  const acceptedRequests = requests.filter(job => job.status === "accepted");

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
              {tab.count > 0 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs sm:text-sm">
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
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
                      key={job.id}
                      className="bg-indigo-50 p-4 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-800">{job.type}</h3>
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs sm:text-sm">
                          {job.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{job.customer}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{job.description}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{job.address}</p>
                      <p className="text-xs text-gray-600">Time: {job.time}</p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        <motion.button
                          className="px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg"
                          onClick={() => acceptJob(job.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-indigo-100 hover:text-indigo-800"
                          onClick={() => declineJob(job.id)}
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
                  acceptedRequests.map((job, index) => (
                    <motion.div
                      key={job.id}
                      className="bg-indigo-50 p-4 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-800">{job.type}</h3>
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs sm:text-sm">
                          {job.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{job.customer}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{job.description}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{job.address}</p>
                      <p className="text-xs text-gray-600">Time: {job.time}</p>
                    </motion.div>
                  ))
                ) : (
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