// src/SignupUser.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../../utils/Firebase";
import axios from "axios";

const SignupUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      

      alert('User signed up successfully!');
      navigate('/additional-details/user'); // Navigate to additional details page
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      alert('User signed up successfully with Google!');
      navigate('/additional-details/user'); // Navigate to additional details page
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">User Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
        {['name', 'email', 'password'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2 rounded"
            onChange={handleChange}
            value={formData[field]}
            required
          />
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
      <button
        onClick={handleGoogleSignup}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Sign Up with Google
      </button>
    </div>
  );
};

export default SignupUser;
