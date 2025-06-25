import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../UserLandingPage/Footer';
import Navbar from './Navbar';

const SERVICE_OPTIONS = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Landscaping",
  "Painting",
  "Carpentry",
  "Appliance Repair",
  "Pest Control",
  "Other"
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ProviderDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    description: '',
    pricingModel: '',
    availability: {}, // Change to object
    serviceTypes: [],
    location: ''
  });

  const navigate = useNavigate();

  // Handle all input changes except availability
  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === "serviceTypes") {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData({ ...formData, serviceTypes: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle availability changes
  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert availability to the required format
      const formattedAvailability = {};
      for (const day of WEEKDAYS) {
        const dayData = formData.availability[day];
        if (dayData && dayData.start && dayData.end) {
          formattedAvailability[day.toLowerCase().slice(0,3)] = [dayData.start, dayData.end];
        }
      }
      const formattedData = {
        ...formData,
        availability: formattedAvailability,
        serviceTypes: formData.serviceTypes
      };

      const res = await axios.post('http://localhost:5000/api/provider-details', formattedData);
      alert(res.data.message);
      navigate('/', { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error('Error submitting provider details:', err);
      alert('Failed to submit provider details');
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
              <div className="border rounded p-2 bg-white">
                {WEEKDAYS.map(day => (
                  <div key={day} className="d-flex align-items-center mb-2">
                    <span style={{ width: 90 }}>{day}:</span>
                    <input
                      type="time"
                      value={formData.availability[day]?.start || ""}
                      onChange={e => handleAvailabilityChange(day, "start", e.target.value)}
                      className="form-control form-control-sm mx-1"
                      style={{ width: 110 }}
                    />
                    <span className="mx-1">to</span>
                    <input
                      type="time"
                      value={formData.availability[day]?.end || ""}
                      onChange={e => handleAvailabilityChange(day, "end", e.target.value)}
                      className="form-control form-control-sm mx-1"
                      style={{ width: 110 }}
                    />
                  </div>
                ))}
              </div>
              <small className="text-muted">Set your available hours for each day.</small>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Service Types</label>
              <select
                name="serviceTypes"
                multiple
                onChange={handleChange}
                value={formData.serviceTypes}
                className="form-control"
                style={{ height: "120px" }}
              >
                {SERVICE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <small className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
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