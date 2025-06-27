import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // ✅ fixed missing import
import axios from 'axios';

import Navbar from './Navbar';
import UpcomingJobsCard from './UpcomingJobs';
import StatsCard from './StatsCard';
import RatingsCard from './RatingsCard';
// import ProfileCard from './ProfileCard';
import JobRequestsCard from './JobRequestCard';
import CompletedJobsCard from './CompletedJobsCard';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Hero = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Wait for Firebase Auth to resolve before fetching provider
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError('Unable to load provider data. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:5000/api/provider-details/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProvider(res.data);
      } catch (err) {
        console.error('❌ Error fetching provider:', err);
        setError('Unable to load provider data. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // ✅ cleanup auth listener
  }, []);

  const handleProviderUpdate = (updatedProvider) => {
    setProvider(updatedProvider);
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <Navbar />
        <div className="container py-5 text-center">
          <h4>Loading your dashboard...</h4>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="bg-light min-vh-100">
        <Navbar />
        <div className="container py-5 text-center">
          <h2 className="text-danger">{error || 'No provider data found.'}</h2>
          <p>Please log in and access your dashboard from the correct flow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light">
      <Navbar />
      <div className="container py-4">
        <h1 className="h2 fw-bold mb-4">Service Provider Dashboard</h1>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <ProfileCard
                provider={provider}
                onProviderUpdate={handleProviderUpdate}
              />
              <StatsCard provider={provider} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <JobRequestsCard provider={provider} />
              <UpcomingJobsCard provider={provider} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="d-flex flex-column gap-4">
              <CompletedJobsCard provider={provider} />
              <RatingsCard provider={provider} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
