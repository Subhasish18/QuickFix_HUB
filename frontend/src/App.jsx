import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastMessage.css';
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
import Hero from './Pages/ServiceLandingpages/Hero.jsx';
import ServiceDetails from './Pages/ServiceDetail/ServiceDetails.jsx';
import BookPage from './Pages/ProviderBookingByUser/BookPage.jsx';
import PaymentPage from './Pages/Payment/PaymentPage.jsx';
import AdminPanel from './Pages/Admin/AdminPannel.jsx';
import SearchResults from './Pages/SearchResults.jsx';
import Loader from './MainLoader.jsx';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);

    async function fetchUserProfile() {
      try {
        const response = await fetch(`${backendUrl}/api/user/profile`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchUserProfile();

    return () => clearTimeout(timer);
  }, [backendUrl]);

  if (loading) return <Loader />;

  return (
    <ProfileProvider value={userProfile}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-user" element={<SignupUser />} />
          <Route path="/signup-provider" element={<SignupProvider />} />
          <Route path="/home" element={<HomePageMock />} />
          <Route path="/user-landing" element={<UserLandingPage />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/additional-user-details" element={<User_details />} />
          <Route path="/additional-provider-details" element={<Provider_details />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/service-details" element={<ServiceDetails />} />
          <Route path="/book-page" element={<BookPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/search-results" element={<SearchResults />} />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </ProfileProvider>
  );
};

export default App;
