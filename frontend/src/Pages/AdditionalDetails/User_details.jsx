import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/user-details', formData);
      alert(res.data.message); // Show success message
      navigate('/'); // Redirect to home page after successful submission
    } catch (err) {
      console.error('Error submitting user details:', err);

      // Display a user-friendly error message
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Failed to submit user details. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        name="name"
        onChange={handleChange}
        value={formData.name}
        placeholder="Name"
        required
        className="border p-2 rounded w-full mb-4"
      />
      <input
        name="email"
        type="email"
        onChange={handleChange}
        value={formData.email}
        placeholder="Email"
        required
        className="border p-2 rounded w-full mb-4"
      />
      <input
        name="phoneNumber"
        onChange={handleChange}
        value={formData.phoneNumber}
        placeholder="Phone Number"
        className="border p-2 rounded w-full mb-4"
      />
      <input
        name="location"
        onChange={handleChange}
        value={formData.location}
        placeholder="Location"
        className="border p-2 rounded w-full mb-4"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Submit Details
      </button>
    </form>
  );
};

export default UserDetails;
