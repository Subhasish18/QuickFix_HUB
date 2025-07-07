import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditProviderModal from './EditProviderModal';

const ProviderProfileCard = ({ serviceData }) => {
  const [provider, setProvider] = useState(serviceData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    description: '',
    pricingModel: '',
    availability: '',
    serviceTypes: '',
    location: '',
  });

  // Fetch provider data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError('Please log in to view profile data.');
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:5000/api/provider-details/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProvider(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phoneNumber: res.data.phoneNumber || '',
          profileImage: res.data.profileImage || '',
          description: res.data.description || '',
          pricingModel: res.data.pricingModel || '',
          availability: res.data.availability
            ? Object.entries(res.data.availability)
                .map(([day, hours]) => `${day}: ${hours.join('-')}`)
                .join('; ')
            : '',
          serviceTypes: res.data.serviceTypes?.join(', ') || '',
          location: res.data.location || '',
        });
        setError('');
      } catch (err) {
        console.error('Error fetching provider:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    });

    // Poll for updates every 30 seconds
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          const res = await axios.get('http://localhost:5000/api/provider-details/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProvider(res.data);
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
            phoneNumber: res.data.phoneNumber || '',
            profileImage: res.data.profileImage || '',
            description: res.data.description || '',
            pricingModel: res.data.pricingModel || '',
            availability: res.data.availability
              ? Object.entries(res.data.availability)
                  .map(([day, hours]) => `${day}: ${hours.join('-')}`)
                  .join('; ')
              : '',
            serviceTypes: res.data.serviceTypes?.join(', ') || '',
            location: res.data.location || '',
          });
        } catch (err) {
          console.error('Error polling provider:', err);
        }
      }
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for profile updates
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError('Please log in to update profile.');
        setLoading(false);
        return;
      }

      const availabilityObj = {};
      if (formData.availability) {
        formData.availability.split(';').forEach((entry) => {
          const [day, hours] = entry.split(':').map((s) => s.trim());
          if (day && hours) {
            availabilityObj[day] = hours.split('-').map((h) => h.trim());
          }
        });
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        profileImage: formData.profileImage,
        description: formData.description,
        pricingModel: formData.pricingModel,
        availability: availabilityObj,
        serviceTypes: formData.serviceTypes.split(',').map((type) => type.trim()),
        location: formData.location,
      };

      const token = await user.getIdToken();
      const res = await axios.put('http://localhost:5000/api/provider-details/edit', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProvider(res.data.provider);
      setFormData({
        name: res.data.provider.name || '',
        email: res.data.provider.email || '',
        phoneNumber: res.data.provider.phoneNumber || '',
        profileImage: res.data.provider.profileImage || '',
        description: res.data.provider.description || '',
        pricingModel: res.data.provider.pricingModel || '',
        availability: res.data.provider.availability
          ? Object.entries(res.data.provider.availability)
              .map(([day, hours]) => `${day}: ${hours.join('-')}`)
              .join('; ')
          : '',
        serviceTypes: res.data.provider.serviceTypes?.join(', ') || '',
        location: res.data.provider.location || '',
      });
      setShowEditModal(false);
      setError('');
    } catch (err) {
      console.error('Error updating provider:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Default data for fallback
  const defaultData = {
    name: 'Service Provider',
    email: 'provider@example.com',
    phoneNumber: '',
    profileImage: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
    description: 'Professional Service Provider',
    pricingModel: 'hourly',
    availability: { mon: ['9:00', '17:00'] },
    serviceTypes: ['General Services'],
    location: 'Unknown',
    rating: 4.2,
  };

  // Use fetched provider data or fallback
  const providerData = provider || serviceData || defaultData;

  // Render star ratings
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <motion.svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 sm:w-5 sm:h-5"
        fill={star <= rating ? '#facc15' : '#e5e7eb'}
        viewBox="0 0 16 16"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </motion.svg>
    ));
  };

  // Generate initials from provider name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Map skills to categories
  const getSkillsForCategory = (category) => {
    const skillsMap = {
      Cleaning: ['Deep Cleaning', 'Sanitization', 'Carpet Care', 'Window Cleaning'],
      Gardening: ['Lawn Care', 'Pruning', 'Landscaping', 'Plant Care'],
      Plumbing: ['Pipe Fitting', 'Leak Repair', 'Drainage', 'Installation'],
      Electrical: ['Wiring', 'Installation', 'Repair', 'Maintenance'],
      HVAC: ['AC Repair', 'Installation', 'Maintenance', 'Diagnostics'],
      Painting: ['Interior Painting', 'Exterior Painting', 'Wall Prep', 'Color Consultation'],
      General: ['Home Repair', 'Maintenance', 'Installation', 'Consultation'],
    };
    return skillsMap[category] || skillsMap['General'];
  };

  // Generate consistent stats
  const generateStats = (providerName) => {
    let seed = 0;
    for (let i = 0; i < providerName.length; i++) {
      seed = ((seed << 5) - seed) + providerName.charCodeAt(i);
      seed = seed & seed;
    }

    const seededRandom = (min, max) => {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return Math.floor(rnd * (max - min + 1)) + min;
    };

    const ratingMultiplier = providerData.rating / 5;
    const baseExperience = seededRandom(1, 8);
    const experience = Math.max(1, Math.floor(baseExperience * (0.7 + ratingMultiplier * 0.6)));
    const baseJobs = seededRandom(5, 150);
    const jobsCompleted = Math.floor(baseJobs * (0.5 + ratingMultiplier * 0.8));
    const baseCompletion = seededRandom(40, 95);
    const profileCompletion = Math.floor(baseCompletion * (0.7 + ratingMultiplier * 0.4));
    const responseTime = seededRandom(1, 24);
    const successRate = seededRandom(85, 99);
    const repeatCustomers = seededRandom(30, 85);

    return { experience, jobsCompleted, profileCompletion: Math.min(profileCompletion, 98), responseTime, successRate, repeatCustomers };
  };

  const stats = generateStats(providerData.name);

  // Format availability
  const formatAvailability = (availability) => {
    if (!availability || Object.keys(availability).length === 0) return 'Not specified';
    return Object.entries(availability)
      .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.join(' - ')}`)
      .join(', ');
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 text-center text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Loading profile...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 text-center text-red-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            {/* <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-900">Service Provider Profile</h2> */}
            <motion.button
              className="px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
              onClick={() => setShowEditModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-pencil"></i>
              Edit Profile
            </motion.button>
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Enhanced Provider Header */}
            <motion.div
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 sm:p-6 rounded-t-xl shadow-md border-b border-indigo-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                {providerData.profileImage ? (
                  <motion.img
                    src={providerData.profileImage}
                    alt="Profile"
                    className="rounded-full border-4 border-white w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover"
                    onError={(e) => {
                      e.target.outerHTML = `<div class="rounded-full bg-white/50 text-indigo-900 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-xl sm:text-2xl font-semibold">${getInitials(providerData.name)}</div>`;
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : (
                  <motion.div
                    className="rounded-full bg-white/50 text-indigo-900 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-xl sm:text-2xl font-semibold"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getInitials(providerData.name)}
                  </motion.div>
                )}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{providerData.name}</h3>
                  <p className="text-sm sm:text-base italic text-white/90">{providerData.description}</p>
                  <div className="flex items-center gap-2 mt-2 bg-amber-200 rounded-full px-2 py-1 inline-flex">
                    {renderStars(providerData.rating)}
                    <span className="text-sm text-gray-900">({providerData.rating})</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Details Section */}
            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: 'bi-envelope', label: 'Email', value: providerData.email },
                  { icon: 'bi-telephone', label: 'Phone', value: providerData.phoneNumber || 'Not specified' },
                  { icon: 'bi-geo-alt', label: 'Location', value: providerData.location || 'Not specified' },
                  { icon: 'bi-currency-dollar', label: 'Pricing Model', value: providerData.pricingModel || 'Not specified' },
                  { icon: 'bi-clock', label: 'Availability', value: formatAvailability(providerData.availability) },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded-md transition-colors"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className={`bi ${item.icon} text-indigo-600 text-lg sm:text-xl hover:text-indigo-800`}></i>
                    <div>
                      <span className="block text-xs sm:text-sm font-medium text-gray-600">{item.label}</span>
                      <span className="text-sm sm:text-base text-gray-800 break-words">{item.value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.div
                className="bg-indigo-50 p-4 rounded-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <span className="block text-xs sm:text-sm font-medium text-gray-600">Experience</span>
                <span className="text-base sm:text-lg font-semibold text-indigo-900">
                  {stats.experience} year{stats.experience !== 1 ? 's' : ''}
                </span>
              </motion.div>
              <motion.div
                className="bg-indigo-50 p-4 rounded-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <span className="block text-xs sm:text-sm font-medium text-gray-600">Jobs Completed</span>
                <span className="text-base sm:text-lg font-semibold text-indigo-900">{stats.jobsCompleted}</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-gray-600">
                  <span>Profile Completion</span>
                  <span>{stats.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <motion.div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${stats.profileCompletion}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.profileCompletion}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="text-center p-3 border border-indigo-100 rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-base font-bold text-green-600">{stats.responseTime}h</div>
                  <div className="text-xs sm:text-sm text-gray-600">Avg Response</div>
                </motion.div>
                <motion.div
                  className="text-center p-3 border border-indigo-100 rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-base font-bold text-indigo-600">{stats.successRate}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
                </motion.div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  <span>Repeat Customers</span>
                  <span>{stats.repeatCustomers}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${stats.repeatCustomers}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.repeatCustomers}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs sm:text-sm font-medium text-gray-600">Skills</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <motion.span
                    className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs sm:text-sm"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {providerData.serviceTypes[0] || 'General Services'}
                  </motion.span>
                  {getSkillsForCategory(providerData.serviceTypes[0] || 'General')
                    .slice(0, 4)
                    .map((skill, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <EditProviderModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleUpdate={handleUpdate}
        loading={loading}
      />
    </>
  );
};

export default ProviderProfileCard;