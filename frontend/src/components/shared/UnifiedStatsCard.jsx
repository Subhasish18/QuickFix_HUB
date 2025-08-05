import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';

// Seeded random number generator for consistent stats
const seededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

// Create seed from string (providerId or provider name)
const createSeed = (str) => {
  if (!str) return Math.floor(Math.random() * 100000);
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 5) - seed + str.charCodeAt(i);
    seed |= 0; // Convert to 32bit integer
  }
  return seed;
};

const UnifiedStatsCard = ({ 
  providerId, 
  providerName,
  title = "Performance Stats",
  mode = "default", 
  showTitle = true,
  customStats = null, 
  className = ""
}) => {
  const [stats, setStats] = useState([]);
  const [otherStats, setOtherStats] = useState([]);

  const generateRandomStats = () => {

    const seedSource = providerId || providerName || 'default';
    const seed = createSeed(seedSource);
    const random = seededRandom(seed);

    const randomPercent = (min = 60, max = 100) => Math.floor(random() * (max - min + 1)) + min;
    const randomJobs = (min = 5, max = 25) => Math.floor(random() * (max - min + 1)) + min;
    const randomEarnings = (min = 1000, max = 8000) => Math.floor(random() * (max - min + 1)) + min;

    const newStats = [
      {
        title: "This Month",
        jobs: randomJobs(8, 25),
        earnings: `${randomEarnings(2000, 8000)}`,
        percent: randomPercent(70, 95)
      },
      {
        title: "Previous Month",
        jobs: randomJobs(5, 20),
        earnings: `${randomEarnings(1500, 6000)}`,
        percent: randomPercent(65, 90)
      }
    ];

    const newOtherStats = [
      { 
        label: 'Acceptance Rate', 
        value: `${Math.floor(random() * 16) + 85}%`,
        icon: 'bi-check-circle',
        color: 'text-green-600'
      },
      { 
        label: 'Avg. Rating', 
        value: `${(random() * 1.3 + 3.7).toFixed(1)}/5`,
        icon: 'bi-star-fill',
        color: 'text-yellow-600'
      },
      { 
        label: 'Response Time', 
        value: `${Math.floor(random() * 35) + 5} min`,
        icon: 'bi-clock',
        color: 'text-blue-600'
      },
    ];

    setStats(newStats);
    setOtherStats(newOtherStats);
  };

  useEffect(() => {
    if (customStats) {
      setStats(customStats.mainStats || []);
      setOtherStats(customStats.otherStats || []);
    } else {
      generateRandomStats();
    }
  }, [providerId, providerName, customStats]);


  if (mode === "minimal") {
    return (
      <motion.div
        className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-4 ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-3 gap-3">
          {otherStats.map((item, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-indigo-900">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (mode === "compact") {
    return (
      <motion.div
        className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4">
          {showTitle && (
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {otherStats.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                <p className="text-base font-semibold text-indigo-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 sm:p-6">
        {showTitle && (
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {title}
          </motion.h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${stat.percent}, 100`}
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-bold">{stat.percent}%</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 mb-1">{stat.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <i className="bi bi-briefcase mr-1"></i>
                  {stat.jobs} jobs completed
                </p>
                <p className="text-lg font-bold text-indigo-600">
                  <i className="bi bi-currency-rupee mr-1"></i>
                  {stat.earnings}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          {otherStats.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-4 rounded-lg border border-indigo-100 text-center shadow-sm"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(79, 70, 229, 0.15)" }}
              transition={{ duration: 0.2 }}
            >
              {item.icon && (
                <i className={`${item.icon} text-2xl ${item.color || 'text-indigo-600'} mb-2 block`}></i>
              )}
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">{item.label}</p>
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 pt-4 border-t border-indigo-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="flex items-center">
              <i className="bi bi-trending-up text-green-500 mr-1"></i>
              Performance trending upward
            </span>
            <span className="flex items-center">
              <i className="bi bi-shield-check text-blue-500 mr-1"></i>
              Verified provider
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UnifiedStatsCard;
