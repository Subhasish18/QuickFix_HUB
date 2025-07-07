import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UpcomingJobsCard = () => {
  const upcomingJobs = [
    {
      id: "job-4",
      customer: "Laura Martinez",
      type: "Water Heater Service",
      address: "456 Elm Street, Lakewood",
      date: "May 4, 2025",
      time: "2:00 PM - 4:30 PM",
    },
    {
      id: "job-5",
      customer: "Chucha Stark",
      type: "Bathroom Sink Installation",
      address: "234 Cedar Lane, Lakewood",
      date: "May 6, 2025",
      time: "10:00 AM - 12:00 PM",
    }
  ];

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
          Upcoming Jobs
        </motion.h2>
        {upcomingJobs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {upcomingJobs.map((job, index) => (
              <motion.div
                key={job.id}
                className="bg-indigo-50 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">{job.type}</h3>
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm">
                    {job.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{job.customer}</p>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-clock text-indigo-600"></i>
                    <span>{job.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bi bi-geo-alt text-indigo-600"></i>
                    <span>{job.address}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            No upcoming jobs
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UpcomingJobsCard;