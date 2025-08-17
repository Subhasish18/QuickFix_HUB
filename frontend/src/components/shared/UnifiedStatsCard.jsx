import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Seeded random number generator for consistent stats
const seededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

// Create seed from string (providerId or providerName)
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
  title = 'Performance Stats',
  mode = 'default',
  showTitle = true,
  customStats = null,
  className = '',
}) => {
  const [stats, setStats] = useState([]);
  const [otherStats, setOtherStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateRandomStats = () => {
    try {
      const seedSource = providerId || providerName || 'default';
      const seed = createSeed(seedSource);
      const random = seededRandom(seed);

      const randomPercent = (min = 60, max = 100) => Math.floor(random() * (max - min + 1)) + min;
      const randomJobs = (min = 5, max = 25) => Math.floor(random() * (max - min + 1)) + min;
      const randomEarnings = (min = 1000, max = 8000) => Math.floor(random() * (max - min + 1)) + min;

      const newStats = [
        {
          title: 'This Month',
          jobs: randomJobs(8, 25),
          earnings: `${randomEarnings(2000, 8000)}`,
          percent: randomPercent(70, 95),
        },
        {
          title: 'Previous Month',
          jobs: randomJobs(5, 20),
          earnings: `${randomEarnings(1500, 6000)}`,
          percent: randomPercent(65, 90),
        },
      ];

      const newOtherStats = [
        {
          label: 'Acceptance Rate',
          value: `${Math.floor(random() * 16) + 85}%`,
          icon: 'bi-check-circle',
          color: 'text-success',
        },
        {
          label: 'Avg. Rating',
          value: `${(random() * 1.3 + 3.7).toFixed(1)}/5`,
          icon: 'bi-star-fill',
          color: 'text-warning',
        },
        {
          label: 'Response Time',
          value: `${Math.floor(random() * 35) + 5} min`,
          icon: 'bi-clock',
          color: 'text-primary',
        },
      ];

      setStats(newStats);
      setOtherStats(newOtherStats);
      setLoading(false);
      toast.success('Performance stats loaded successfully 🚀', { toastId: 'stats-loaded' });
    } catch (error) {
      toast.error('Failed to load performance stats ❌', { toastId: 'stats-error' });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customStats) {
      try {
        setStats(
          customStats.mainStats || [
            {
              title: 'This Month',
              jobs: customStats.jobsCompleted || 0,
              earnings: `${customStats.earnings || 0}`,
              percent: parseFloat(customStats.satisfactionRate) || 0,
            },
          ],
        );
        setOtherStats(
          customStats.otherStats || [
            {
              label: 'Acceptance Rate',
              value: `${customStats.acceptanceRate || '0%'}`,
              icon: 'bi-check-circle',
              color: 'text-success',
            },
            {
              label: 'Avg. Rating',
              value: `${customStats.satisfactionRate || '0/5'}`,
              icon: 'bi-star-fill',
              color: 'text-warning',
            },
            {
              label: 'Response Time',
              value: `${customStats.responseTime || '0 min'}`,
              icon: 'bi-clock',
              color: 'text-primary',
            },
          ],
        );
        toast.info('Showing custom performance stats 📊', { toastId: 'stats-custom' });
        setLoading(false);
      } catch {
        toast.error('Error applying custom stats ❌', { toastId: 'stats-custom-error' });
        setLoading(false);
      }
    } else {
      generateRandomStats();
    }
  }, [providerId, providerName, customStats]);

  if (loading) {
    return (
      <Card className={`shadow-sm border-0 ${className}`}>
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading performance stats...</p>
        </Card.Body>
      </Card>
    );
  }

  if (mode === 'minimal') {
    return (
      <motion.div
        as={Card}
        className={`shadow-sm border-0 ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card.Body>
          <div className="row g-3">
            {otherStats.map((item, index) => (
              <div key={index} className="col-4 text-center">
                <p className="text-muted small mb-1">{item.label}</p>
                <p className="fw-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </Card.Body>
      </motion.div>
    );
  }

  if (mode === 'compact') {
    return (
      <motion.div
        as={Card}
        className={`shadow-sm border-0 ${className}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card.Body>
          {showTitle && (
            <h5 className="fw-bold mb-4">{providerName ? `${providerName}'s ${title}` : title}</h5>
          )}
          <div className="row g-3">
            {otherStats.map((item, index) => (
              <div key={index} className="col-4">
                <div className="bg-light p-3 rounded text-center">
                  <p className="text-muted small mb-1">{item.label}</p>
                  <p className="fw-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </motion.div>
    );
  }

  return (
    <motion.div
      as={Card}
      className={`shadow-sm border-0 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card.Body className="p-4">
        {showTitle && (
          <motion.h5
            className="fw-bold mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {providerName ? `${providerName}'s ${title}` : title}
          </motion.h5>
        )}

        <div className="row g-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-12 col-sm-6">
              <motion.div
                className="bg-light p-3 rounded d-flex align-items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="me-3">
                  <div className="position-relative" style={{ width: '64px', height: '64px' }}>
                    <svg className="w-100 h-100" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e9ecef"
                        strokeWidth="3"
                      />
                      <motion.path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0d6efd"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${stat.percent}, 100`}
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-primary fw-bold">
                      {stat.percent}%
                    </div>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{stat.title}</h6>
                  <p className="text-muted small mb-1">
                    <i className="bi bi-briefcase me-1"></i>
                    {stat.jobs} jobs completed
                  </p>
                  <p className="text-primary fw-bold">
                    <i className="bi bi-currency-dollar me-1"></i>
                    {stat.earnings}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          className="row g-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          {otherStats.map((item, index) => (
            <div key={index} className="col-12 col-sm-4">
              <motion.div
                className="bg-white p-3 rounded border shadow-sm text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon && (
                  <i className={`bi ${item.icon} fs-4 ${item.color} mb-2`}></i>
                )}
                <p className="text-muted small mb-1">{item.label}</p>
                <p className="fw-bold">{item.value}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 pt-4 border-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="d-flex justify-content-between text-muted small">
            <span>
              <i className="bi bi-trending-up text-success me-1"></i>
              Performance trending upward
            </span>
            <span>
              <i className="bi bi-shield-check text-primary me-1"></i>
              Verified provider
            </span>
          </div>
        </motion.div>
      </Card.Body>
    </motion.div>
  );
};

export default UnifiedStatsCard;