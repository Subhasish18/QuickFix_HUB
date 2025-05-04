import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from './Components/UserProfile/UserProfile';
import UserBookings from './Components/UserBookings/UserBookings';
import UserEditForm from './Components/UserEditForm/UserEditForm';
import Navbar from './UserLandingPage/Navbar';
// import UserStats from './components/UserStats/UserStats';
import './UserDetails.css';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate loading user data (replace this with your real data or API later)
    const loadUserData = async () => {
      try {
        setLoading(true);
        // Mock user data
        const mockUser = {
          id: userId,
          name: 'John Doe',
          email: 'john@example.com',
          location: 'New York',
          role: 'Service Provider',
          description: 'Experienced electrician',
          rating: 4.5,
        };
        setUser(mockUser);
        setError(null);
      } catch (err) {
        setError('Failed to load user details');
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleUpdateUser = (updatedUserData) => {
    setUser({ ...user, ...updatedUserData });
    setIsEditing(false);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading-spinner">Loading user details...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!user) {
      return <div className="not-found">User not found</div>;
    }

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
        return <UserBookings userId={userId} />;
      case 'stats':
        return <UserStats userId={userId} />;
      default:
        return <UserProfile user={user} onEditClick={() => setIsEditing(true)} />;
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="user-details-container">
      <div className="user-details-header">
        <h1>User Details</h1>
        {user && !isEditing && (
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
