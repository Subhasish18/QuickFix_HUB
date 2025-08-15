import { useState, useEffect } from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditProviderModal from '../../Pages/ServiceLandingpages/EditProviderModal';
import Map from '../../Pages/Components/Map';
import { useProfile } from '../../context/ProfileContext';

const UnifiedProfileCard = ({ 
  serviceData, 
  mode = 'view', 
  onUpdate 
}) => {
  const { provider, loading: profileLoading, error: profileError, updateProfile } = useProfile();
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
    city: '',
    state: '',
  });

  // Location dropdown states
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [loading, setLoading] = useState(false);

  const CSC_API_KEY = import.meta.env.VITE_CSC_API_KEY;

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name || '',
        email: provider.email || '',
        phoneNumber: provider.phoneNumber || '',
        profileImage: provider.profileImage || '',
        description: provider.description || '',
        pricingModel: provider.pricingModel || '',
        availability: provider.availability
          ? Object.entries(provider.availability)
              .map(([day, hours]) => `${day}: ${hours.join('-')}`)
              .join('; ')
          : '',
        serviceTypes: provider.serviceTypes?.join(', ') || '',
        city: provider.city || '',
        state: provider.state || '',
      });
    }
  }, [provider]);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get('https://api.countrystatecity.in/v1/countries/IN/states', {
          headers: { 'X-CSCAPI-KEY': CSC_API_KEY },
        });
        setStates(response.data || []);
      } catch (err) {
        console.error('❌ Error fetching states:', err);
        setStateError('Could not load states.');
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      return;
    }
    const selectedState = states.find(s => s.name === formData.state);
    if (!selectedState) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        setCityError('');
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState.iso2}/cities`,
          { headers: { 'X-CSCAPI-KEY': CSC_API_KEY } }
        );
        setCities(response.data || []);
      } catch (err) {
        console.error('❌ Error fetching cities:', err);
        setCityError('Could not load cities.');
      }
    };
    fetchCities();
  }, [formData.state, states]);

  // Input handler: reset city if state changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData((prev) => ({ ...prev, state: value, city: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Update handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        // setError('Please log in to update profile.');
        setLoading(false);
        return;
      }

      const availabilityObj = {};
      if (formData.availability) {
        formData.availability.split(';').forEach((entry) => {
          const [day, hours] = entry.split(':').map((s) => s.trim());
          if (day && hours) {
            availabilityObj[day.toLowerCase().slice(0, 3)] = hours.split('-').map((h) => h.trim());
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
        city: formData.city,
        state: formData.state,
      };

      const token = await user.getIdToken();
      const res = await axios.put('http://localhost:5000/api/provider-details/edit', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      updateProfile(res.data.provider);
      setShowEditModal(false);
      // setError('');
      if (onUpdate) onUpdate(res.data.provider);
    } catch (err) {
      console.error('Error updating provider:', err);
      // setError(err.response?.data?.message || 'Failed to update profile.');
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
    city: 'Unknown',
    state: 'Unknown',
    rating: 4.2,
  };

  // Use fetched provider data or fallback
  const providerData = provider || serviceData || defaultData;
  console.log('providerData', providerData);

  // Safely get the primary service type to prevent runtime errors
  const primaryService = (providerData.serviceTypes && providerData.serviceTypes.length > 0)
    ? providerData.serviceTypes[0]
    : 'General Services';

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
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
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
    const name = providerName || ''; // Ensure providerName is a string to prevent errors
    let seed = 0;
    for (let i = 0; i < name.length; i++) {
      seed = ((seed << 5) - seed) + name.charCodeAt(i);
      seed |= 0; // Convert to 32bit integer, more conventional
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
  console.log('stats', stats);

  // Format availability
  const formatAvailability = (availability) => {
    if (!availability || Object.keys(availability).length === 0) return 'Not specified';
    return Object.entries(availability)
      .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.join(' - ')}`)
      .join(', ');
  };

  if (profileLoading) {
    return (
      <motion.div
        className={mode === 'edit' ? 
          "bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 text-center text-gray-600" :
          "card shadow-sm p-4 text-center text-muted"
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Loading profile...
      </motion.div>
    );
  }

  if (profileError && mode === 'edit') {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 text-center text-danger"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {profileError}
      </motion.div>
    );
  }

  if (mode === 'view') {
    return (
      <Card className="shadow-sm">
        <Card.Header>
          <Card.Title as="h5" className="mb-0">Service Provider Profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={providerData.profileImage}
                alt="Profile"
                className="rounded-circle border border-primary"
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.outerHTML = `<div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; font-size: 1.5rem;">${getInitials(providerData.name)}</div>`;
                }}
              />
              <div>
                <h5 className="mb-1">{providerData.name}</h5>
                <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>{providerData.description}</p>
                
              </div>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <div className="bg-light p-3 rounded">
                  <span className="d-block" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Experience</span>
                  <span className="fs-5 fw-semibold">{stats.experience} year{stats.experience !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-3 rounded">
                  <span className="d-block" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Jobs Completed</span>
                  <span className="fs-5 fw-semibold">{stats.jobsCompleted}</span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-4">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Profile Completion</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{stats.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${stats.profileCompletion}%` }}
                  />
                </div>
              </div>
              
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="text-center p-2 border rounded">
                    <div className="fs-6 fw-bold text-success">{stats.responseTime}h</div>
                    <div style={{ fontSize: '0.75rem' }} className="text-muted">Avg Response</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-2 border rounded">
                    <div className="fs-6 fw-bold text-primary">{stats.successRate}%</div>
                    <div style={{ fontSize: '0.75rem' }} className="text-muted">Success Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Repeat Customers</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{stats.repeatCustomers}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${stats.repeatCustomers}%` }}
                  />
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Skills</span>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <Badge bg="primary">{primaryService}</Badge>
                  {getSkillsForCategory(primaryService).slice(0, 4).map((skill, index) => (
                    <Badge key={index} bg="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
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
                      e.target.outerHTML = `<div class="rounded-full bg-white/50 text-indigo-900 flex items-center justify-content-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-xl sm:text-2xl font-semibold">${getInitials(providerData.name)}</div>`;
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
                  
                </div>
              </div>
            </motion.div>

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
                  { icon: 'bi-geo-alt', label: 'Location', value: providerData.city && providerData.state
                    ? `${providerData.city}, ${providerData.state}`
                    : 'Location not specified' },
                  { icon: 'bi-currency-rupee', label: 'Pricing Model', value: providerData.pricingModel || 'Not specified' },
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
            {/* Map Section */}
            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-indigo-900 mb-4">Provider Location</h3>
              <Map city={providerData.city} state={providerData.state} />
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
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${stats.profileCompletion}%` }}
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
                  <div className="text-base font-bold text-green-600">{stats.successRate}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
                </motion.div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  <span>Repeat Customers</span>
                  <span>{stats.repeatCustomers}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${stats.repeatCustomers}%` }}
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
                    {primaryService}
                  </motion.span>
                  {getSkillsForCategory(primaryService)
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

      {/* Pass location data and error handlers to the modal */}
      <EditProviderModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleUpdate={handleUpdate}
        loading={loading}
        states={states}
        cities={cities}
        stateError={stateError}
        cityError={cityError}
      />
    </>
  );
};

export default UnifiedProfileCard;
