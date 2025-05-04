import React from 'react';
import { motion } from 'framer-motion';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    { id: 1, name: 'Plumbing', description: 'Professional plumbing services for repairs and installations', icon: '🔧' },
    { id: 2, name: 'Electrical', description: 'Licensed electricians for all your electrical needs', icon: '⚡' },
    { id: 3, name: 'Cleaning', description: 'Thorough cleaning services for homes and offices', icon: '🧹' },
    { id: 4, name: 'Landscaping', description: 'Transform your outdoor spaces with expert landscaping', icon: '🌱' },
    { id: 5, name: 'Painting', description: 'Quality painting services for interior and exterior', icon: '🖌️' },
    { id: 6, name: 'Carpentry', description: 'Custom woodwork and furniture repairs', icon: '🪚' }
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <motion.div
          className="services-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="services-title">Services We Offer</h2>
          <p className="services-subtitle">
            Browse through our wide range of professional services to find exactly what you need.
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="service-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 * index }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.description}</p>
              <button className="learn-more-btn">Learn More →</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
