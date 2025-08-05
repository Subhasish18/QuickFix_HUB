import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../UserLandingPage/Navbar';
import Footer from './Footer';
import StatsCard from './StatsCard';
import RatingsCard from './RatingsCard';
import ProfileCard from './ProfileCard';
import BookingForm from './BookingForm';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookPage = () => {
  const location = useLocation();
  const selectedService = location.state?.service;
  
  
  const providerId = location.state?.service?.id || location.state?.serviceId;
  const serviceId = providerId; 

  const userId = localStorage.getItem('userId');

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
              <RatingsCard
                providerId={providerId || 'default'}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookPage;