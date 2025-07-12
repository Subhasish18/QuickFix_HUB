import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirection
import { getAuth } from 'firebase/auth'; // Firebase Authentication
import Footer from '../UserLandingPage/Footer';
import Navbar from '../UserLandingPage/Navbar';

const UserDetails = () => {
  // State to store form input values - removed role from state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const navigate = useNavigate(); // Hook for redirection

  // Update form data state on each input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Get current Firebase user
      const auth = getAuth();
      const user = auth.currentUser;

      // If user is not logged in, stop here
      if (!user) {
        alert("You must be logged in to submit details.");
        return;
      }

      // Step 2: Get Firebase ID token
      const idToken = await user.getIdToken();

      // Step 3: Send POST request with Authorization header
      // Role will automatically default to 'user' from backend schema
      const res = await axios.post(
        'http://localhost:5000/api/user-details',
        formData, // Only sending name, email, phoneNumber, location
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Pass token to backend
          },
        }
      );

      // Success: Show message and redirect
      alert(res.data.message);
      navigate('/');

    } catch (err) {
      console.error('Error submitting user details:', err);

      // Show specific backend error if available
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Failed to submit user details. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
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
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter your email"
                required
                className="form-control"
                autoComplete="off"
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
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="form-label fw-semibold">Location</label>
              <input
                id="location"
                name="location"
                onChange={handleChange}
                value={formData.location}
                placeholder="Enter your location"
                className="form-control"
                autoComplete="off"
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

export default UserDetails;