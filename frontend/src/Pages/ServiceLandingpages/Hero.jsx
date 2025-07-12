import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../UserLandingPage/Navbar';
import UpcomingJobsCard from './UpcomingJobs';
import StatsCard from './StatsCard';
import RatingsCard from './RatingsCard';
import ProviderProfileCard from './ProviderProfileCard';
import JobRequestsCard from './JobRequestCard';
import CompletedJobsCard from './CompletedJobsCard';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Removed Bootstrap CSS to avoid conflicts with Tailwind

const Hero = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { key: 'profile', label: 'Profile & Ratings', icon: 'bi-person' },
    { key: 'stats', label: 'Stats', icon: 'bi-bar-chart' },
    { key: 'jobRequests', label: 'Job Requests', icon: 'bi-inbox' },
    { key: 'upcomingJobs', label: 'Upcoming Jobs', icon: 'bi-calendar-event' },
    { key: 'completedJobs', label: 'Completed Jobs', icon: 'bi-check-circle' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="flex flex-col gap-4">
            <ProviderProfileCard />
            <RatingsCard />
          </div>
        );
      case 'stats':
        return <StatsCard />;
      case 'jobRequests':
        return <JobRequestsCard />;
      case 'upcomingJobs':
        return <UpcomingJobsCard />;
      case 'completedJobs':
        return <CompletedJobsCard />;
      default:
        return (
          <div className="flex flex-col gap-4">
            <ProviderProfileCard />
            <RatingsCard />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-indigo-900 text-center lg:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        </motion.h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div
            className={`lg:w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 ${
              isSidebarOpen ? 'block' : 'hidden lg:block'
            }`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.key}
                  className={`flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm sm:text-base text-left transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
                  }`}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                >
                  <i className={`bi ${tab.icon} mr-2`}></i>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Mobile Sidebar Toggle Button */}
          <button
            className="lg:hidden mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'} mr-2`}></i>
            {isSidebarOpen ? 'Close Menu' : 'Menu'}
          </button>

          {/* Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 sm:p-6">{renderContent()}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;