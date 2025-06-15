import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirection
import { getAuth } from 'firebase/auth'; // ⬅️ Import Firebase Authentication

const UserDetails = () => {
  // State to store form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const navigate = useNavigate(); // Hook for redirecting after submission

  // Update form data state on each input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔐 Step 1: Get current Firebase user
      const auth = getAuth();
      const user = auth.currentUser;

      // ❗ If user is not logged in, stop here
      if (!user) {
        alert("You must be logged in to submit details.");
        return;
      }

      // 🔑 Step 2: Get Firebase ID token
      const idToken = await user.getIdToken();

      // 🚀 Step 3: Send POST request with Authorization header
      const res = await axios.post(
        'http://localhost:5000/api/user-details',
        formData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // 🔐 Pass token to backend
          },
        }
      );

      // ✅ Success: Show message and redirect
      alert(res.data.message);
      navigate('/'); // Redirect after success

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
