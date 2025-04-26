// src/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Choose your role</h1>
      <div className="space-x-6">
        <button onClick={() => navigate('/signup/user')} className="bg-blue-500 text-white px-6 py-3 rounded-lg">
          I am a User
        </button>
        <button onClick={() => navigate('/signup/provider')} className="bg-green-500 text-white px-6 py-3 rounded-lg">
          I am a Provider
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
