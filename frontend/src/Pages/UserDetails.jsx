import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserProfile from './Components/UserProfile/UserProfile';
import UserBookings from './Components/UserBookings/UserBookings';
import UserEditForm from './Components/UserEditForm/UserEditForm';
import Navbar from './UserLandingPage/Navbar';
import './UserDetails.css';

const UserDetails = () => {
  const [user, setUser] = useState(null);          // User data
  const [loading, setLoading] = useState(true);    // Loading state
  const [error, setError] = useState(null);        // Error state
  const [activeTab, setActiveTab] = useState('profile'); // Active tab
  const [isEditing, setIsEditing] = useState(false);     // Edit mode

  // ✅ Fetch user data using Firebase auth state
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const idToken = await currentUser.getIdToken();

        const response = await axios.get('http://localhost:5000/api/user-details/profile', {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });

        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err.message);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleUpdateUser = (updatedUserData) => {
    setUser({ ...user, ...updatedUserData });
    setIsEditing(false);
  };

  const renderContent = () => {
    if (loading) return <div className="loading-spinner">Loading user details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!user) return <div className="not-found">User not found</div>;

    if (isEditing) {
      return (
        <UserEditForm 
          user={user} 
          onSubmit={handleUpdateUser} 
          onCancel={() => setIsEditing(false)} 
        />
      );
    }

    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} onEditClick={() => setIsEditing(true)} />;
      case 'bookings':
        return <UserBookings userId={user._id} />;
      case 'stats':
        return <div>Stats coming soon...</div>;
      default:
        return <UserProfile user={user} onEditClick={() => setIsEditing(true)} />;
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
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
              <button
                className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
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
