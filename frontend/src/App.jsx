import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageMock from './Pages/HomePageMock';
import Login from './Pages/login/Login';
import LandingPage from './Pages/Signup/LandingPage';
import SignupUser from './Pages/Signup/SignupUser';
import SignupProvider from './Pages/Signup/SignupProvider';
import Hero from './Pages/ServiceLandingpages/Hero.jsx';

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
        <Route path="/hero" element={<Hero />} />
       
      </Routes>
    </Router>
  );
};

export default App;