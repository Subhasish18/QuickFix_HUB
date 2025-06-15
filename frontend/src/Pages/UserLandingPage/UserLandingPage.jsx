import React from 'react';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import HowItWorks from './HowItWorks';
import TestimonialsSection from './TestimonialsSection';
import CallToAction from './CallToAction';
import Footer from './Footer';
import Navbar from './Navbar';
import FeaturedServices from './FeaturedServices';
const UserLandingPage = () => {
  return (
    <div className="user-landing-page" style={{ backgroundColor: '#2563EB'}}>
        <Navbar />
        <HeroSection />
         <div id="services">
          <ServicesSection />
        </div>
        <div id="providers">
          <FeaturedServices />
        </div>
        <HowItWorks />
        <TestimonialsSection />
        <CallToAction />
        <Footer />
    </div>
  );
};

export default UserLandingPage;