import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UserProfile from './Components/UserProfile/UserProfile';
import UserBookings from './Components/UserBookings/UserBookings';
import UserEditForm from './Components/UserEditForm/UserEditForm';
import BookLoader from './Components/BookLoader';
import Navbar from './UserLandingPage/Navbar';
import './UserDetails.css';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Access checker: Only allow if logged in as user
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'user') {
      alert('Please login as user to access this page.');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Fetch user data from server
  const fetchUserProfile = async (idToken) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/user-details/profile', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.data._id) {
        throw new Error('Invalid user data: ID not found');
      }
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on auth state change
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }
      const idToken = await currentUser.getIdToken(true);
      await fetchUserProfile(idToken);
    });
    return () => unsubscribe();
  }, []);

  // Handle profile update and re-fetch
  const handleUpdateUser = async (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
    setIsEditing(false);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      const idToken = await currentUser.getIdToken(true);
      await fetchUserProfile(idToken);
    } catch (err) {
      setError('Failed to refresh profile. Please reload the page.');
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (loading) return <BookLoader />;
    if (error) return <div className="error-message">{error}</div>;
    if (!user) return <div className="not-found">User not found</div>;

    if (isEditing) {
      return (
        <UserEditForm
          show={true}
          onHide={() => setIsEditing(false)}
          user={user}
          onSubmit={handleUpdateUser}
        />
      );
    }

    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} onEditSubmit={handleUpdateUser} />;
      case 'bookings':
        if (!user._id) {
          return <div className="error-message">User ID not found. Please try again.</div>;
        }
        return <UserBookings userId={user._id} />;
      case 'stats':
        return <div className="stats-placeholder">Stats coming soon...</div>;
      default:
        return <UserProfile user={user} onEditSubmit={handleUpdateUser} />;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="user-details-container">
        <div className="user-details-header">
          <h1>User Details</h1>
          {!isEditing && user && (
            <div className="user-details-navigation">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabClick('profile')}
              >
                Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => handleTabClick('bookings')}
              >
                Bookings
              </button>
              <button
                className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => handleTabClick('stats')}
              >
                Stats
              </button>
            </div>
          )}
        </div>
        <div className="user-details-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;