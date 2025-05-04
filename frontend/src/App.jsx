// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageMock from './Pages/HomePageMock';
import Login from './Pages/Login';
import LandingPage from './Pages/Signup/LandingPage';
import SignupUser from './Pages/Signup/SignupUser';
import SignupProvider from './Pages/Signup/SignupProvider';
import User_details from './Pages/AdditionalDetails/User_details'; 
import Provider_details from './Pages/AdditionalDetails/Provider_details';
import ProtectedRoute from './utils/ProtectedRoute'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageMock />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<LandingPage />} />
        <Route path="/signup/user" element={<SignupUser />} />
        <Route path="/signup/provider" element={<SignupProvider />} />
        <Route path="/additional-details/user" element={<User_details />} />
        <Route path="/additional-details/provider" element={<Provider_details/>} /> 
      </Routes>
    </Router>
  );
};

export default App;
