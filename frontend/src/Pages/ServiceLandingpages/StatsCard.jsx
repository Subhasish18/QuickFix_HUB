import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const StatsCard = () => {
  const stats = [
    { 
      title: "This Month",
      jobs: 8,
      earnings: "₹970",
      percent: 75
    },
    { 
      title: "Previous Month",
      jobs: 12,
      earnings: "₹1,435",
      percent: 92
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
          Performance Stats
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#d6d6d6"
                    strokeWidth="3"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeDasharray={`${stat.percent}, 100`}
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600 text-sm font-semibold">
                  {stat.percent}%
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">{stat.title}</h3>
                <p className="text-sm text-gray-600">{stat.jobs} jobs</p>
                <p className="text-base font-semibold text-indigo-600">{stat.earnings}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          {[
            { label: 'Acceptance Rate', value: '89%' },
            { label: 'Avg. Rating', value: '4.8/5' },
            { label: 'Response Time', value: '20 min' },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-indigo-50 p-3 rounded-lg text-center"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs text-gray-600 mb-1">{item.label}</p>
              <p className="text-base font-semibold text-indigo-900">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsCard;