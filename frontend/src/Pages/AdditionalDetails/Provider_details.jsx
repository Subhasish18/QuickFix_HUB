import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../UserLandingPage/Footer';
import Navbar from '../UserLandingPage/Navbar';
import Select from 'react-select';
import ConfirmDialog from '../../components/shared/ConfirmDialog';



const slideDownAnimation = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
      max-height: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      max-height: 1000px;
    }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('slideDownAnimation')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'slideDownAnimation';
  styleElement.textContent = slideDownAnimation;
  document.head.appendChild(styleElement);
}

const SERVICE_OPTIONS = [
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Landscaping', value: 'landscaping' },
  { label: 'Painting', value: 'painting' },
  { label: 'Carpentry', value: 'carpentry' },
  { label: 'Appliance Repair', value: 'appliance_repair' },
  { label: 'Pest Control', value: 'pest_control' },
  { label: 'Other', value: 'other' },
];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CSC_API_KEY = import.meta.env.VITE_CSC_API_KEY;

// Custom react-select styles (Bootstrap look)
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#0d6efd' : '#ced4da',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13,110,253,.25)' : 'none',
    '&:hover': { borderColor: '#0d6efd' },
    minHeight: '38px',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#0d6efd',
    color: 'white',
    borderRadius: '0.25rem',
    padding: '2px 6px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 500,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'white',
    ':hover': { backgroundColor: '#084298', color: 'white' },
  }),
};

const ProviderDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    description: '',
    pricingModel: '',
    availability: {},
    serviceTypes: [],
    state: '',
    city: '',
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          'https://api.countrystatecity.in/v1/countries/IN/states',
          { headers: { 'X-CSCAPI-KEY': CSC_API_KEY } }
        );
        setStates(response.data || []);
        toast.success('States loaded successfully 🚀');
      } catch (err) {
        console.error('❌ Error fetching states:', err);
        toast.error('Failed to load states. Please refresh and try again.');
        setStates([]);
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
    const selectedState = states.find((s) => s.name === formData.state);
    if (!selectedState) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState.iso2}/cities`,
          { headers: { 'X-CSCAPI-KEY': CSC_API_KEY } }
        );
        setCities(response.data || []);
        toast.success('Cities loaded successfully 📍');
      } catch (err) {
        console.error('❌ Error fetching cities:', err);
        toast.error('Failed to load cities. Please refresh and try again.');
        setCities([]);
      }
    };
    fetchCities();
  }, [formData.state, states]);

  // Autofill name/email from Firebase user if available
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.displayName || "",
        email: prev.email || currentUser.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmSubmit(); // Directly submit without confirmation dialog
  };

  const handleConfirmSubmit = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error('Please log in to submit provider details.');
        setConfirmOpen(false);
        return;
      }
      const token = await currentUser.getIdToken();

      const formattedAvailability = {};
      for (const day of WEEKDAYS) {
        const dayData = formData.availability[day];
        if (dayData?.start && dayData?.end) {
          formattedAvailability[day.toLowerCase().slice(0, 3)] = [dayData.start, dayData.end];
        }
      }

      const formattedData = {
        ...formData,
        name: formData.name || currentUser.displayName || "",
        email: formData.email || currentUser.email || "",
        city: formData.city || 'Rohini',
        state: formData.state || 'Delhi',
        availability: formattedAvailability,
        serviceTypes: formData.serviceTypes.map((s) => s.value),
      };

      const res = await axios.put(
        'http://localhost:5000/api/provider-details',
        formattedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Provider details submitted successfully:', res.data);
      toast.success(res.data.message || 'Provider details submitted successfully! 🚀');
      navigate('/login', { replace: true });
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error('❌ Error submitting provider details:', err);
      toast.error(err.response?.data?.message || 'Failed to submit provider details. Please try again.');
    } finally {
      setConfirmOpen(false);
    }
  };

  const getAvailabilityCount = () => {
    return WEEKDAYS.filter(
      (day) => formData.availability[day]?.start && formData.availability[day]?.end
    ).length;
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
        <div className="card shadow-lg p-4" style={{ maxWidth: 500, width: '100%' }}>
          <h2 className="mb-4 text-center text-primary">Provider Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Phone Number</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="Phone Number"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Profile Image URL</label>
              <input
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="form-control"
                placeholder="Profile Image URL"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Description"
                rows="3"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Pricing ₹/hr</label>
              <input
                name="pricingModel"
                value={formData.pricingModel}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter amount (e.g. 500 ₹/hr)"
              />
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-bold mb-0">Availability</label>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm d-flex align-items-center"
                  onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                  aria-expanded={isAvailabilityOpen}
                >
                  <span className="me-2">
                    {getAvailabilityCount() > 0
                      ? `${getAvailabilityCount()} day${getAvailabilityCount() > 1 ? 's' : ''} set`
                      : 'Set hours'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className={`bi bi-chevron-${isAvailabilityOpen ? 'up' : 'down'}`}
                    viewBox="0 0 16 16"
                    style={{ transition: 'transform 0.2s ease' }}
                  >
                    <path
                      fillRule="evenodd"
                      d={isAvailabilityOpen
                        ? 'm7.646 11.354-4-4a.5.5 0 0 1 .708-.708L8 10.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0z'
                        : 'm4.646 1.646 4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L7.293 2.5 3.646 5.854a.5.5 0 1 1-.708-.708l4-4a.5.5 0 0 1 .708 0z'}
                    />
                  </svg>
                </button>
              </div>
              {isAvailabilityOpen && (
                <div
                  className="mt-3"
                  style={{
                    animation: 'slideDown 0.3s ease-out',
                    transformOrigin: 'top',
                  }}
                >
                  <div className="border rounded-3 p-3 shadow-sm bg-light">
                    {WEEKDAYS.map((day) => (
                      <div
                        key={day}
                        className="d-flex align-items-center justify-content-between mb-2 p-2 bg-white rounded shadow-sm"
                      >
                        <span className="fw-semibold text-primary" style={{ width: 90 }}>
                          {day}:
                        </span>
                        <div className="d-flex align-items-center">
                          <input
                            type="time"
                            value={formData.availability[day]?.start || ''}
                            onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                            className="form-control form-control-sm mx-1 border-primary"
                            style={{ width: 120 }}
                          />
                          <span className="mx-2 text-muted">to</span>
                          <input
                            type="time"
                            value={formData.availability[day]?.end || ''}
                            onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                            className="form-control form-control-sm mx-1 border-primary"
                            style={{ width: 120 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <small className="text-muted">
                    ⏰ Set your available hours for each day.
                  </small>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Service Types</label>
              <Select
                isMulti
                options={SERVICE_OPTIONS}
                value={formData.serviceTypes}
                onChange={(selected) => setFormData({ ...formData, serviceTypes: selected || [] })}
                placeholder="Select Service Types"
                styles={selectStyles}
                className="shadow-sm"
              />
              <small className="text-muted">You can select multiple service types</small>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.iso2} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold">
              Submit Details
            </button>
          </form>
        </div>
      </div>
      <Footer />
      {/* <ConfirmDialog
        open={confirmOpen}
        title="Confirm Submission"
        message="Are you sure you want to submit your provider details?"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setConfirmOpen(false)}
      /> */}
    </>
  );
};

export default ProviderDetails;