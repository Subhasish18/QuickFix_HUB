import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Footer from './Footer';
import Navbar from './Navbar';

const CSC_API_KEY = import.meta.env.VITE_CSC_API_KEY;

const UserDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    state: '',
    city: '',
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData((prevData) => ({
          ...prevData,
          name: currentUser.displayName || '',
          email: currentUser.email || '',
        }));
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          'https://api.countrystatecity.in/v1/countries/IN/states',
          { headers: { 'X-CSCAPI-KEY': CSC_API_KEY } }
        );
        setStates(response.data || []);
      } catch (err) {
        setStates([]);
      }
    };
    fetchStates();
  }, []);

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
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState.iso2}/cities`,
          { headers: { 'X-CSCAPI-KEY': CSC_API_KEY } }
        );
        setCities(response.data || []);
      } catch (err) {
        setCities([]);
      }
    };
    fetchCities();
  }, [formData.state, states]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Authentication error. Please log in again.");
      return;
    }

    try {
      const idToken = await user.getIdToken();
      // Use PUT for update
      const res = await axios.put(
        'http://localhost:5000/api/user-details',
        formData,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      alert(res.data.message || "Details updated!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user details. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h3 className="mb-4 text-center text-primary">Enter Your Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">Name</label>
              <input
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Enter your name"
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                required
                className="form-control"
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label fw-semibold">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                onChange={handleChange}
                value={formData.phoneNumber}
                placeholder="Enter your phone number"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="state" className="form-label fw-semibold">State</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.iso2} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="form-label fw-semibold">City</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold">
              Submit Details
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserDetails;