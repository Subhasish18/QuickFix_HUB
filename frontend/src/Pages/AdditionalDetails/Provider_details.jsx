import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProviderDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    description: '',
    pricingModel: '',
    availability: '', // JSON string (e.g., '{"mon": ["9:00", "17:00"]}')
    serviceTypes: '', // Comma-separated string (e.g., 'Plumbing, Electrical')
    location: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data before sending it to the backend
      const formattedData = {
        ...formData,
        availability: JSON.parse(formData.availability || '{}'), // Parse JSON string
        serviceTypes: formData.serviceTypes.split(',').map(type => type.trim()) // Convert to array
      };

      const res = await axios.post('http://localhost:5000/api/provider-details', formattedData);
      alert(res.data.message); // Show success message
      navigate('/'); // Redirect to the home page after successful submission
    } catch (err) {
      console.error('Error submitting provider details:', err);
      alert('Failed to submit provider details');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        name="name"
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="email"
        type="email"
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="phoneNumber"
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <input
        name="profileImage"
        onChange={handleChange}
        placeholder="Profile Image URL"
      />
      <textarea
        name="description"
        onChange={handleChange}
        placeholder="Description"
        rows="3"
      />
      <input
        name="pricingModel"
        onChange={handleChange}
        placeholder="Pricing Model (e.g., hourly, fixed)"
      />
      <textarea
        name="availability"
        onChange={handleChange}
        placeholder='Availability (e.g., {"mon": ["9:00", "17:00"], "tue": ["9:00", "17:00"]})'
        rows="3"
      />
      <input
        name="serviceTypes"
        onChange={handleChange}
        placeholder="Service Types (comma-separated)"
      />
      <input
        name="location"
        onChange={handleChange}
        placeholder="Location"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit Details
      </button>
    </form>
  );
};

export default ProviderDetails;
