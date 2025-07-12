import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Footer from '../UserLandingPage/Footer';
import Navbar from '../UserLandingPage/Navbar';

const SERVICE_OPTIONS = [
  "Plumbing", "Electrical", "Cleaning", "Landscaping", "Painting",
  "Carpentry", "Appliance Repair", "Pest Control", "Other"
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
    availability: {},
    serviceTypes: [],
    location: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "serviceTypes") {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData({ ...formData, serviceTypes: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert('You must be logged in to submit provider details.');
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
        availability: formattedAvailability,
        serviceTypes: formData.serviceTypes
      };

      console.log('📤 Submitting provider data:', formattedData);

      const res = await axios.post(
        'http://localhost:5000/api/provider-details',
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(res.data.message);
      navigate('/', { replace: true });
      setTimeout(() => window.location.reload(), 100);

    } catch (err) {
      console.error('❌ Error submitting provider details:', err);
      alert(err.response?.data?.message || 'Failed to submit provider details. Please try again.');
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
              <input name="name" value={formData.name} onChange={handleChange} required className="form-control" placeholder="Name" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" placeholder="Email" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Phone Number</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-control" placeholder="Phone Number" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Profile Image URL</label>
              <input name="profileImage" value={formData.profileImage} onChange={handleChange} className="form-control" placeholder="Profile Image URL" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" placeholder="Description" rows="3" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Pricing Model</label>
              <input name="pricingModel" value={formData.pricingModel} onChange={handleChange} className="form-control" placeholder="Pricing Model (e.g., hourly, fixed)" />
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
                value={formData.serviceTypes}
                onChange={handleChange}
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
              <input name="location" value={formData.location} onChange={handleChange} className="form-control" placeholder="Location" />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold">Submit Details</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProviderDetails;
