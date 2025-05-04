import React from 'react';
import './UserProfile.css';
const UserProfile = ({ user, onEditClick }) => {
  const defaultImage = 'https://via.placeholder.com/150';
  const profileImage = user.profileImage || defaultImage;

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date) ? 'Unknown' : date.toLocaleDateString(undefined, options);
  };

  const createdAt = formatDate(user.createdAt || '2023-01-01'); // fallback mock date

  return (
      <div className="user-profile">
        <div className="user-profile-header">
          <div className="user-profile-avatar">
            <img 
              src={profileImage} 
              alt={`${user.name || 'User'}'s profile`} 
              className="avatar-image" 
            />
          </div>
          <div className="user-profile-info">
            <h2>{user.name || 'No name available'}</h2>
            <p className="user-profile-since">Member since {createdAt}</p>
            <button className="edit-profile-button" onClick={onEditClick}>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="user-profile-details">
          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-row">
              <div className="detail-label">Email:</div>
              <div className="detail-value">{user.email || 'No email provided'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Phone:</div>
              <div className="detail-value">
                {user.phoneNumber || 'No phone number provided'}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Personal Information</h3>
            <div className="detail-row">
              <div className="detail-label">Location:</div>
              <div className="detail-value">
                {user.location || 'No location provided'}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Account Security</h3>
            <div className="detail-row">
              <div className="detail-label">Password:</div>
              <div className="detail-value">
                <button 
                  className="change-password-button"
                  onClick={() => alert('Password change functionality would go here')}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default UserProfile;
