import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from './UserLandingPage/Navbar';
import Footer from './UserLandingPage/Footer';
import { FaStar, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import './SearchResults.css'; // Import the new CSS file

const SearchResults = () => {
  const location = useLocation();
  const { results, query } = location.state || { results: [], query: '' };
  console.log('Results:', results);


  return (
    <>
      <Navbar />
      <div className="featured-section">
        <h2 className="featured-title">Search Results for "{query}"</h2>
        <div className="services-grid">
          {results.length > 0 ? (
            results.map(provider => (
              <Link key={provider.id} to="/book" state={{ service: provider }} className="service-card" style={{ textDecoration: 'none' }}>
                <div className="service-image-container">
                  <img src={provider.profileImage} alt={provider.name} className="service-image" />
                  <span className="service-category-badge">{provider.category}</span>
                </div>
                <div className="service-content">
                  <h3 className="service-title">{provider.name}</h3>
                  <p className="service-company">
                    <FaBuilding className="service-company-icon" />
                    {provider.name}
                  </p>
                  <p className="service-location">
                    <FaMapMarkerAlt className="service-location-icon" />
                    {provider.location || 'Location not specified'}
                  </p>
                  <div className="service-divider"></div>
                  <div className="service-footer">
                    <span className="service-rating">
                      <FaStar className="star-icon" /> {provider.rating || 'N/A'}
                    </span>
                    <span className="service-price">
                      Book Now
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center">No providers found for your search.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;