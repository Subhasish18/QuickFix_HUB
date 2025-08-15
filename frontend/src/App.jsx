import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import HomePageMock from './Pages/HomePageMock';
import Login from './Pages/login/Login';
import LandingPage from './Pages/Signup/LandingPage';
import SignupUser from './Pages/Signup/SignupUser';
import SignupProvider from './Pages/Signup/SignupProvider';
import UserLandingPage from './Pages/UserLandingPage/UserLandingPage';
import UserDetails from './Pages/UserDetails';
import User_details from './Pages/AdditionalDetails/User_details';
import Provider_details from './Pages/AdditionalDetails/Provider_details';
import ProtectedRoute from './utils/ProtectedRoute';
import Hero from './Pages/ServiceLandingpages/Hero.jsx';
import ServiceDetails from './Pages/ServiceDetail/ServiceDetails.jsx';
import BookPage from './Pages/ProviderBookingByUser/BookPage.jsx';
import PaymentPage from './Pages/Payment/PaymentPage.jsx';
import AdminPanel from './Pages/Admin/AdminPannel.jsx';

const App = () => {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/sample" element={<HomePageMock />} />
          <Route path="/" element={<UserLandingPage />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<LandingPage />} />
          <Route path="/signup/user" element={<SignupUser />} />
          <Route path="/signup/provider" element={<SignupProvider />} />
          <Route path="/additional-details/user" element={<User_details />} />
          <Route path="/additional-details/provider" element={<Provider_details/>} />
          <Route path="/hero" element={<Hero/>} />
          <Route path='/serviceDetails/:serviceName' element={<ServiceDetails/>} />
          <Route path='/book' element={<BookPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
};

export default App;