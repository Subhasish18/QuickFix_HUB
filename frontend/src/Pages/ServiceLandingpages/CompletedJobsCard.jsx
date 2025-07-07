import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const completedJobs = [
  {
    id: "comp1",
    customer: "Ari",
    type: "Drain Cleaning",
    date: "Apr 28, 2025",
    payment: "₹120",
    rating: 5,
    feedback: "Excellent service, drain works perfect now."
  },
  {
    id: "comp2",
    customer: "Maharaj",
    type: "Faucet Replacement",
    date: "Apr 25, 2025",
    payment: "₹195",
    rating: 4,
    feedback: "Good work, very professional."
  },
  {
    id: "comp3",
    customer: "Subh",
    type: "Pipe Repair",
    date: "Apr 22, 2025",
    payment: "₹150",
    rating: 5,
    feedback: "Fixed our emergency leak quickly. Would hire again!"
  }
];

const CompletedJobsCard = () => {
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
        <div className="flex flex-col gap-4">
          {completedJobs.map((job, index) => (
            <motion.div
              key={job.id}
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
                    <span className="text-sm text-gray-600">{job.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mt-2">{job.type}</h3>
                  <p className="text-sm text-gray-600 mb-1">{job.customer}</p>
                  <div className="flex items-center gap-1">{renderStars(job.rating)}</div>
                  <p className="text-sm italic text-gray-600 mt-1">"{job.feedback}"</p>
                </div>
                <span className="text-base font-semibold text-green-600">{job.payment}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CompletedJobsCard;