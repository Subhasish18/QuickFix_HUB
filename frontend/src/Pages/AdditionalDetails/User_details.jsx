import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../UserLandingPage/Footer';
import Navbar from './Navbar';

const UserDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/user-details', formData);
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      console.error('Error submitting user details:', err);
      if (err.response && err.response.data && err.response.data.message) {
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