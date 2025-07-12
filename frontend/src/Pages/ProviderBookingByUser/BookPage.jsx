import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../UserLandingPage/Navbar'; // Kept from SD branch, assuming this is intentional
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
  const serviceId =
    location.state?.serviceId || selectedService?.serviceId || selectedService?.id;

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        {selectedService && (
          <div className="alert alert-info mb-4">
            <h5 className="mb-2">Selected Service: {selectedService.title}</h5>
            <p className="mb-1">
              <strong>Provider:</strong> {selectedService.company}
            </p>
            <p className="mb-1">
              <strong>Location:</strong> {selectedService.location}
            </p>
            <p className="mb-0">
              <strong>Price:</strong> {selectedService.price}
            </p>
          </div>
        )}

        <h1 className="h2 fw-bold mb-4">Service Provider Dashboard</h1>

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
                providerId={
                  selectedService?.company || selectedService?.id || 'default'
                }
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
