import React from 'react';
import { FaStar, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import './FeaturedServices.css';

const services = [
  {
    title: 'Professional House Cleaning',
    company: 'CleanPro Services',
    location: 'Downtown',
    price: '$25/hr',
    rating: 4.8,
    category: 'Cleaning',
    image: 'https://cdn.pixabay.com/photo/2017/07/25/09/08/the-push-rod-2537315_1280.jpg'
  },
  {
    title: 'Garden & Lawn Maintenance',
    company: 'Green Thumb',
    location: 'Suburbs',
    price: '$30/hr',
    rating: 4.7,
    category: 'Gardening',
    image: 'https://cdn.pixabay.com/photo/2021/11/14/18/30/woman-6795430_1280.jpg'
  },
  {
    title: 'Plumbing Repair Services',
    company: 'Quick Fix Plumbing',
    location: 'Citywide',
    price: '$45/hr',
    rating: 4.9,
    category: 'Plumbing',
    image: 'https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?s=1024x1024&w=is&k=20&c=LkKMuHe7Uj0PjkyC0bn7HEQmQ8Iidl8B8_rqFiPSS2A='
  },
  {
    title: 'Home Electric & Wiring',
    company: 'Bright Spark Electric',
    location: 'North Side',
    price: '$40/hr',
    rating: 4.6,
    category: 'Electrical',
    image: 'https://media.istockphoto.com/id/1049775258/photo/smiling-handsome-electrician-repairing-electrical-box-with-pliers-in-corridor-and-looking-at.jpg?s=1024x1024&w=is&k=20&c=I8Fxr-SRoAovM3W5Ijd36Vv3cYFqrEErd6mKvPUjmzs='
  },
];

const FeaturedServices = () => {
  return (
    <section className="featured-section">
      <h2 className="featured-title">Featured Services</h2>
      <div className="services-grid">
        {services.map((service, idx) => (
          <div key={idx} className="service-card" tabIndex="0">
            <div className="service-image-container">
              <img src={service.image} alt={service.title} className="service-image" />
              <span className="service-category-badge">{service.category}</span>
            </div>
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-company">
                <FaBuilding className="service-company-icon" />
                {service.company}
              </p>
              <p className="service-location">
                <FaMapMarkerAlt className="service-location-icon" />
                {service.location}
              </p>
              <div className="service-divider"></div>
              <div className="service-footer">
                <span className="service-rating">
                  <FaStar className="star-icon" /> {service.rating}
                </span>
                <span className="service-price">{service.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedServices;