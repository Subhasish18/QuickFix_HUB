import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

  // Fetch user data from server
  const fetchUserProfile = async (idToken) => {
    try {
      setLoading(true);
      console.log('Fetching user profile'); // Debug log
      const response = await axios.get('http://localhost:5000/api/user-details/profile', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      console.log('User profile fetched:', response.data); // Debug log
      if (!response.data._id) {
        throw new Error('Invalid user data: ID not found');
      }
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err.message); // Debug log
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on auth state change
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', !!currentUser); // Debug log
      if (!currentUser) {
        console.log('No authenticated user'); // Debug log
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
    console.log('Updating user with data:', updatedUserData); // Debug log
    // Temporarily update state to reflect changes immediately
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
    setIsEditing(false);

    // Re-fetch from server to ensure synchronization
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      const idToken = await currentUser.getIdToken(true);
      await fetchUserProfile(idToken);
    } catch (err) {
      console.error('Error re-fetching user profile after update:', err.message); // Debug log
      setError('Failed to refresh profile. Please reload the page.');
    }
  };

  const handleTabClick = (tab) => {
    console.log('Tab clicked:', tab); // Debug log
    setActiveTab(tab);
  };

  const renderContent = () => {
    console.log('renderContent called:', { loading, error, user, activeTab, isEditing }); // Debug log
    if (loading) {
      console.log('Rendering BookLoader'); // Debug log
      return <BookLoader />;
    }
    if (error) {
      console.log('Rendering error:', error); // Debug log
      return <div className="error-message">{error}</div>;
    }
    if (!user) {
      console.log('Rendering user not found'); // Debug log
      return <div className="not-found">User not found</div>;
    }

    if (isEditing) {
      console.log('Rendering UserEditForm'); // Debug log
      return (
        <UserEditForm
          show={true}
          onHide={() => {
            console.log('Cancel edit clicked'); // Debug log
            setIsEditing(false);
          }}
          user={user}
          onSubmit={handleUpdateUser}
        />
      );
    }

    switch (activeTab) {
      case 'profile':
        console.log('Rendering UserProfile'); // Debug log
        return <UserProfile user={user} onEditSubmit={handleUpdateUser} />;
      case 'bookings':
        console.log('Rendering UserBookings with userId:', user._id); // Debug log
        if (!user._id) {
          console.log('No user._id, rendering fallback'); // Debug log
          return <div className="error-message">User ID not found. Please try again.</div>;
        }
        return <UserBookings userId={user._id} />;
      case 'stats':
        console.log('Rendering Stats placeholder'); // Debug log
        return <div className="stats-placeholder">Stats coming soon...</div>;
      default:
        console.log('Rendering default UserProfile'); // Debug log
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