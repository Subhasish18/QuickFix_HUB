import React from 'react';
import Navbar from './Navbar';
import UpcomingJobsCard from './UpcomingJobs';
import StatsCard from './StatsCard';
import RatingsCard from './RatingsCard';
import ProfileCard from './ProfileCard';
import JobRequestsCard from './JobRequestCard';
import CompletedJobsCard from './CompletedJobsCard';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Hero = () => {
  return (
    <div className="bg-light">
      <Navbar />
      
      <div className="container py-4">
        <h1 className="h2 fw-bold mb-4">Service Provider Dashboard</h1>
        
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <ProfileCard />
              <StatsCard />
            </div>
          </div>
          
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <JobRequestsCard />
              <UpcomingJobsCard />
            </div>
          </div>
          
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <CompletedJobsCard />
              <RatingsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;