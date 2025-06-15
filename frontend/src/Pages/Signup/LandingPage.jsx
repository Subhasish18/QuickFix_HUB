import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../UserLandingPage/Footer';
import Navbar from './Navbar';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div
        className="d-flex flex-column min-vh-100"
        style={{ background: 'rgba(218, 222, 229, 0.95)' }}
      >
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div
            className="card shadow-lg"
            style={{
              minWidth: 350,
              background: 'rgba(68, 76, 92, 0.95)',
              borderRadius: 20,
            }}
          >
            <div className="card-body text-center">
              <h2 className="card-title mb-3 text-light">Choose Your Role</h2>
              <p className="card-text mb-4 text-secondary">
                How do you want to use QuickFix?
              </p>
              <div className="d-grid gap-3">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/signup/user')}
                >
                  I am a User
                </button>
                <button
                  className="btn btn-success btn-lg"
                  onClick={() => navigate('/signup/provider')}
                >
                  I am a Provider
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;