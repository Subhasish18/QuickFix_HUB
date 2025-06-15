// UserProfile.jsx
import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onEditClick }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date) ? 'Unknown' : date.toLocaleDateString(undefined, options);
  };

  const createdAt = formatDate(user.createdAt || '2023-01-01');
  const initials = getInitials(user.name);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={`${user.name || 'User'}'s profile`}
                className="avatar-img"
              />
            ) : (
              initials
            )}
          </div>
        </div>
        <div className="user-info">
          <h1 className="user-name">{user.name || 'No name available'}</h1>
          <p className="member-since">Member since {createdAt}</p>
          <button 
            className="edit-btn"
            onClick={onEditClick}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="details">
        <div className="section">
          <h2 className="section-title">Contact Information</h2>
          <div className="detail-grid">
            <div className="detail-row">
              <div className="detail-label">Email</div>
              <div className="detail-value">{user.email || 'No email provided'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Phone</div>
              <div className="detail-value">{user.phoneNumber || 'No phone number provided'}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Personal Information</h2>
          <div className="detail-grid">
            <div className="detail-row">
              <div className="detail-label">Location</div>
              <div className="detail-value">{user.location || 'No location provided'}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Account Security</h2>
          <div className="detail-grid">
            <div className="detail-row">
              <div className="detail-label">Password</div>
              <div className="detail-value">
                <button 
                  className="password-btn"
                  onClick={() => alert('Password change functionality would go here')}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
