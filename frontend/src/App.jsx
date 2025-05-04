// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageMock from './Pages/HomePageMock';
import Login from './Pages/Login';
import LandingPage from './Pages/Signup/LandingPage';
import SignupUser from './Pages/Signup/SignupUser';
import SignupProvider from './Pages/Signup/SignupProvider';
import UserLandingPage from './Pages/UserLandingPage/UserLandingPage';
import UserDetails from './Pages/UserDetails';
import ProtectedRoute from './utils/ProtectedRoute'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sample" element={<HomePageMock />} />
        <Route path="/" element={<UserLandingPage />} />
        <Route path="/userDetails" element={<UserDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<LandingPage />} />
        <Route path="/signup/user" element={<SignupUser />} />
        <Route path="/signup/provider" element={<SignupProvider />} />
        
      </Routes>
    </Router>
  );
};

export default App;
