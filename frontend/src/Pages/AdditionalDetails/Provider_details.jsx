import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // ✅ Firebase auth for token
import Footer from '../UserLandingPage/Footer';
import Navbar from './Navbar';

const ProviderDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    description: '',
    pricingModel: '',
    availability: '',
    serviceTypes: '',
    location: ''
  });

  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ 1. Ensure user is authenticated
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert('You must be logged in to submit provider details.');
        return;
      }

      // ✅ 2. Get Firebase ID token for authentication
      const token = await currentUser.getIdToken();

      // ✅ 3. Parse and validate availability (must be JSON)
      let availabilityObj = {};
      if (formData.availability.trim()) {
        try {
          availabilityObj = JSON.parse(formData.availability);
        } catch (jsonError) {
          alert('Invalid availability format. Please use valid JSON.');
          console.warn('❌ Availability parsing error:', jsonError);
          return;
        }
      }

      // ✅ 4. Prepare request payload
      const formattedData = {
        ...formData,
        availability: availabilityObj,
        serviceTypes: formData.serviceTypes.split(',').map(type => type.trim())
      };

      console.log('📤 Submitting provider data:', formattedData);

      // ✅ 5. Send data to backend with Authorization header
      const res = await axios.post(
        'http://localhost:5000/api/provider-details',
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}` // 🔐 Secure Firebase token
          }
        }
      );

      console.log('✅ Provider submitted successfully:', res.data);
      alert(res.data.message);

      // ✅ 6. Redirect to home after short delay
      navigate('/', { replace: true });
      setTimeout(() => window.location.reload(), 100);

    } catch (err) {
      console.error('❌ Error submitting provider details:', err);

      // Handle detailed backend error if available
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Failed to submit provider details. Please try again.');
      }
    }
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
                onChange={handleChange}
                value={formData.name}
                placeholder="Name"
                required
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Email"
                required
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Phone Number</label>
              <input
                name="phoneNumber"
                onChange={handleChange}
                value={formData.phoneNumber}
                placeholder="Phone Number"
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Profile Image URL</label>
              <input
                name="profileImage"
                onChange={handleChange}
                value={formData.profileImage}
                placeholder="Profile Image URL"
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                name="description"
                onChange={handleChange}
                value={formData.description}
                placeholder="Description"
                rows="3"
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Pricing Model</label>
              <input
                name="pricingModel"
                onChange={handleChange}
                value={formData.pricingModel}
                placeholder="Pricing Model (e.g., hourly, fixed)"
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Availability</label>
              <textarea
                name="availability"
                onChange={handleChange}
                value={formData.availability}
                placeholder='Availability (e.g., {"mon": ["9:00", "17:00"]})'
                rows="3"
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Service Types</label>
              <input
                name="serviceTypes"
                onChange={handleChange}
                value={formData.serviceTypes}
                placeholder="Service Types (comma-separated)"
                className="form-control"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Location</label>
              <input
                name="location"
                onChange={handleChange}
                value={formData.location}
                placeholder="Location"
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold">
              Submit Details
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProviderDetails;
