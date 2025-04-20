import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageMock from './pages/HomePageMock';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePageMock />} />
      </Routes>
    </Router>
  );
};

export default App;