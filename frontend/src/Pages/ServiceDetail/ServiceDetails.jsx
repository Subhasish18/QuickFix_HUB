import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import './ServiceDetails.css';
import Footer from '../UserLandingPage/Footer';
import Navbar from '../UserLandingPage/Navbar';

const DEFAULT_IMAGE = "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?s=1024x1024&w=is&k=20&c=LkKMuHe7Uj0PjkyC0bn7HEQmQ8Iidl8B8_rqFiPSS2A=";

const ServiceDetails = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCardClick = (service) => {
    // Pass the correct serviceId for booking
    const formattedService = {
      id: service._id,
      serviceId: service._id, // <-- add this line for clarity
      title: service.name,
      company: service.name,
      location: service.location,
      price: `$${service.pricingModel}/hr`,
      rating: service.rating || 4.5,
      category: serviceName,
      image: service.profileImage && service.profileImage.trim() !== "" ? service.profileImage : DEFAULT_IMAGE,
      description: service.description
    };
    // Pass serviceId separately in navigation state
    navigate('/book', { state: { service: formattedService, serviceId: service._id } });
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/service-details/${serviceName}`)
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        alert('Failed to fetch services');
      });
  }, [serviceName]);

 if (loading) return (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);
  return (
    <>
      <Navbar />
      <section className="featured-section">
        <h2 className="featured-title">{serviceName} Providers</h2>
        <div className="services-grid">
          {services.map((service, idx) => (
            <div
            key={idx} 
            className="service-card clickable" 
            tabIndex="0"
            onClick={() => handleCardClick(service)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(service);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-image-container">
              <img
                src={service.profileImage && service.profileImage.trim() !== "" ? service.profileImage : DEFAULT_IMAGE}
                alt={service.name}
                className="service-image"
                onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
              />
              <span className="service-category-badge">
                {service.serviceTypes && service.serviceTypes.length > 0 ? service.serviceTypes[0] : serviceName}
              </span>
            </div>
            <div className="service-content">
              <h3 className="service-title">{service.name}</h3>
              <p className="service-company">
                <FaBuilding className="service-company-icon" />
                {service.description}
              </p>
              <p className="service-location">
                <FaMapMarkerAlt className="service-location-icon" />
                {service.location}
              </p>
              <div className="service-divider"></div>
              <div className="service-footer">
                <span className="service-rating">
                  <FaStar className="star-icon" /> {service.rating || 4.5}
                </span>
                <span className="service-price">${service.pricingModel}/hr</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Footer />
    </>
  );
};

export default ServiceDetails;