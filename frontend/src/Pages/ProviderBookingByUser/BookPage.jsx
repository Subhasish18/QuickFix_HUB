import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../UserLandingPage/Navbar';
import Footer from './Footer';
import StatsCard from './StatsCard';
import RatingsCard from './RatingsCard';
import ProfileCard from './ProfileCard';
import BookingForm from './BookingForm';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in and is a user (not provider)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'user') {
      alert('Please login as user to book a service.');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const selectedService = location.state?.service;
  const providerId = selectedService?.id || location.state?.serviceId;
  const serviceId = providerId;
  const userId =
    JSON.parse(localStorage.getItem('userData'))?._id ||
    localStorage.getItem('userId');

  // Redirect if no providerId or selectedService
  useEffect(() => {
    if (!providerId || !selectedService) {
      alert('Invalid access. Please select a service provider first.');
      navigate('/#services', { replace: true });
    }
  }, [providerId, selectedService, navigate]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h1 className="h2 fw-bold mb-4">Service Provider Dashboard</h1>

        {selectedService?.city && selectedService?.state && (
          <div className="mb-2 text-muted">
            Location: {selectedService.city}, {selectedService.state}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <ProfileCard serviceData={selectedService} />
              <StatsCard />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <BookingForm serviceId={serviceId} userId={userId} />
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <RatingsCard providerId={providerId || 'default'} />
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Toast container for showing notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default BookPage;
