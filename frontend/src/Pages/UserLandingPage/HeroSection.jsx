import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Slider from "react-slick";
import './HeroSection.css';
import "slick-carousel/slick/slick.css"; 
import axios from 'axios';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`https://quickfix-hub.onrender.com/api/search?q=${searchQuery}`);
      navigate('/search', { state: { results: response.data, query: searchQuery } });
    } catch (error) {
      console.error('Error searching for providers:', error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "custom-dots",
    customPaging: () => (
      <button className="custom-dot"></button>
    )
  };

  const serviceImages = [
    { src: 'https://cdn.pixabay.com/photo/2017/07/25/09/08/the-push-rod-2537315_1280.jpg', 
      alt: "Cleaning" },
    { src: 'https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?s=1024x1024&w=is&k=20&c=LkKMuHe7Uj0PjkyC0bn7HEQmQ8Iidl8B8_rqFiPSS2A=', 
      alt: "Plumbing" },
    { src: 'https://media.istockphoto.com/id/1049775258/photo/smiling-handsome-electrician-repairing-electrical-box-with-pliers-in-corridor-and-looking-at.jpg?s=1024x1024&w=is&k=20&c=I8Fxr-SRoAovM3W5Ijd36Vv3cYFqrEErd6mKvPUjmzs=',
       alt: "Electrical" },
    { src: 'https://cdn.pixabay.com/photo/2021/11/14/18/30/woman-6795430_1280.jpg', 
      alt: "Lawn Care" },
  ];

  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">Trusted Services, Right Around the Corner</h1>
        <p className="hero-subtitle">
          Access top-rated providers in your area for home improvement, maintenance, and more.
        </p>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="What service do you need? (Plumbing, Electrical, Lawn Care, etc.)"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>

        {/* Slider Section */}
        <div className="hero-slider">
          <Slider {...sliderSettings}>
            {serviceImages.map((image, idx) => (
              <div key={idx} className="slider-image-container">
                <img src={image.src} alt={image.alt} className="slider-image" />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;