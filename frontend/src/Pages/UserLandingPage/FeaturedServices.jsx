import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaBuilding, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';
import axios from 'axios';
import './FeaturedServices.css';

const hardcodedServices = [
  {
    title: 'Professional House Cleaning',
    company: 'CleanPro Services',
    location: 'Downtown',
    price: '$25/hr',
    rating: 4.8,
    category: 'Cleaning',
    image: 'https://cdn.pixabay.com/photo/2017/07/25/09/08/the-push-rod-2537315_1280.jpg'
  },
];

const FeaturedServices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [dynamicProviders, setDynamicProviders] = useState([]);
  const [services, setServices] = useState(hardcodedServices);
  const [loading, setLoading] = useState(true);
  const servicesPerPage = 4; 
  const autoScrollInterval = useRef(null);
  const SCROLL_DELAY = 5000;
  

  // Cards are display-only - no navigation functionality
  


  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        console.log('Fetching providers from API...');
        
        const response = await axios.get('http://localhost:5000/api/provider-card-show');
        console.log('API Response:', response.data);
        
        const providers = response.data;
        
        if (!Array.isArray(providers)) {
          console.error('API did not return an array:', providers);
          setServices(hardcodedServices);
          return;
        }

        const formattedProviders = providers.map(provider => {
          console.log('Processing provider:', provider);
          return {
            title: provider.services?.[0]?.title || `${provider.category} Services`,
            company: provider.name || 'Service Provider',
            location: provider.location || 'Available',
            price: provider.services?.[0]?.price || provider.pricingModel || 'Contact for pricing',
            rating: provider.rating || 4.5,
            category: provider.category || 'General',
            image: provider.profileImage || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1750000733~exp=1750004333~hmac=a11b1198bb1f20a16349cc3ce40040f12852cedb1ee82db5d3f44bd1fd365551&w=1380',
            isRealProvider: true 
          };
        });
        
        console.log('Formatted providers:', formattedProviders);
        
        // Merge database providers with hardcoded services
        const mergedServices = [...formattedProviders, ...hardcodedServices];
        setDynamicProviders(formattedProviders);
        setServices(mergedServices);
        
        console.log(`Successfully loaded ${formattedProviders.length} providers from database`);
        
      } catch (error) {
        console.error('Error fetching providers:', error.response?.data || error.message);
        console.error('Full error:', error);
        setServices(hardcodedServices);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const totalPages = Math.ceil(services.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentServices = services.slice(startIndex, endIndex);
  
 
  const startAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    
    autoScrollInterval.current = setInterval(() => {
      setCurrentPage(prevPage => {
        if (prevPage >= totalPages) {
          return 1; 
        }
        return prevPage + 1;
      });
    }, SCROLL_DELAY);
  };
  
  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };
  
  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };
  

  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    
    return () => stopAutoScroll(); 
  }, [isAutoScrolling, totalPages]);
  
 
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(1); 
    }
    
    
    if (isAutoScrolling) {
      stopAutoScroll();
      setTimeout(() => {
        if (isAutoScrolling) startAutoScroll();
      }, 3000); 
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(totalPages); 
    }
    
  
    if (isAutoScrolling) {
      stopAutoScroll();
      setTimeout(() => {
        if (isAutoScrolling) startAutoScroll();
      }, 3000); 
    }
  };
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    
   
    if (isAutoScrolling) {
      stopAutoScroll();
      setTimeout(() => {
        if (isAutoScrolling) startAutoScroll();
      }, 3000); 
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <section className="featured-section">
        <h2 className="featured-title">Featured Services</h2>
        <div className="services-loading">
          <div className="loading-spinner"></div>
          <p>Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <h2 className="featured-title">Featured Services</h2>
      <h3 className='featured-subtitle'>Showcasing some of our newly joined providers.</h3>
      <div className="pagination-header">
        <div className="pagination-info">
          <span>Showing {startIndex + 1}-{Math.min(endIndex, services.length)} of {services.length} services</span>
        </div>
        <button 
          className={`auto-scroll-toggle ${isAutoScrolling ? 'active' : ''}`}
          onClick={toggleAutoScroll}
          title={isAutoScrolling ? 'Pause auto-scroll' : 'Start auto-scroll'}
        >
          {isAutoScrolling ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className="services-grid">
        {currentServices.map((service, idx) => (
          <div 
            key={startIndex + idx} 
            className="service-card display-only"
          >
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

      <div className="pagination-container">
        <button 
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          <FaChevronLeft /> Previous
        </button>
        
        <div className="pagination-numbers">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        
        <button 
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default FeaturedServices;