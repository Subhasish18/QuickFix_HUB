import React, { useState, useEffect } from 'react';
import './UserEditForm.css';

// 🔧 ADDED: Import Firebase v9+ auth functions
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Component for editing user profile (without image upload)
const UserEditForm = ({ user, onSubmit, onCancel }) => {
  // Step 1: Form state
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    location: user.location || ''
  });

  // Error state for form validation
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // 🔧 ADDED: Track current Firebase user
  const [currentUser, setCurrentUser] = useState(null);

  // Step 2: Sync user prop with form when it changes
  useEffect(() => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      location: user.location || ''
    });
  }, [user]);

  // 🔧 ADDED: Listen for Firebase auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Firebase auth state changed:', !!user); // Debug logging
      setCurrentUser(user);
      
      if (!user) {
        console.log('❌ User not authenticated');
        localStorage.removeItem('token'); // Clear stored token if user is not authenticated
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Step 3: Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const cleanPhone = formData.phoneNumber.replace(/[^\d]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        newErrors.phoneNumber = 'Phone number must be between 10-15 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4: Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Remove error as user corrects the field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Step 5: Generate initials from name
  const getUserInitials = () => {
    if (!formData.name) return '??';
    return formData.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0] ? n[0].toUpperCase() : '')
      .join('');
  };

  // 🔧 FIXED: Step 6: Get authentication token with proper Firebase v9+ syntax
  const getFreshToken = async () => {
    try {
      console.log('🔐 Getting fresh Firebase token...'); // Debug logging
      
      // Method 1: Try to get current user from Firebase Auth
      const auth = getAuth();
      const user = auth.currentUser || currentUser;
      
      if (user) {
        console.log('✅ Firebase user found, getting fresh token...'); // Debug logging
        
        // Get fresh ID token (force refresh = true)
        const token = await user.getIdToken(true);
        console.log('🎯 Fresh token obtained successfully'); // Debug logging
        
        // Store the fresh token
        localStorage.setItem('token', token);
        return token;
      }
      
      // Method 2: If no current user, try stored token (but warn it might be expired)
      console.log('⚠️ No current Firebase user, checking stored token...'); // Debug logging
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        console.log('❌ No stored token found'); // Debug logging
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('📋 Using stored token (may be expired)'); // Debug logging
      return storedToken;
      
    } catch (error) {
      console.error('💥 Error getting Firebase token:', error); // Debug logging
      
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Provide specific error messages
      if (error.code === 'auth/user-token-expired') {
        throw new Error('Your session has expired. Please log in again.');
      } else if (error.code === 'auth/invalid-user-token') {
        throw new Error('Invalid authentication. Please log in again.');
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log in again to continue.');
      } else {
        throw new Error('Authentication failed. Please log in again.');
      }
    }
  };

  // Step 7: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started...'); // Debug logging
    
    // Validate form first
    if (!validateForm()) {
      console.log('❌ Form validation failed'); // Debug logging
      return;
    }

    setIsLoading(true);

    try {
      // 🔧 IMPROVED: Check if user is authenticated before proceeding
      if (!currentUser && !getAuth().currentUser) {
        console.log('❌ User not authenticated'); // Debug logging
        throw new Error('You must be logged in to update your profile.');
      }

      console.log('🔐 Getting authentication token...'); // Debug logging
      const token = await getFreshToken();
      
      if (!token) {
        console.log('❌ No token obtained'); // Debug logging
        throw new Error('Failed to get authentication token.');
      }

      console.log('🌐 Sending update request...'); // Debug logging
      console.log('📋 Form data:', formData); // Debug logging

      const response = await fetch('http://localhost:5000/api/user-details/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 🔧 FIXED: Proper Bearer token format
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response status:', response.status); // Debug logging

      // Parse response
      let result;
      try {
        result = await response.json();
        console.log('📥 Response data:', result); // Debug logging
      } catch (parseError) {
        console.error('❌ Error parsing response:', parseError); // Debug logging
        throw new Error('Invalid response from server');
      }

      // Handle different response statuses
      if (!response.ok) {
        console.log('❌ Request failed with status:', response.status); // Debug logging
        
        if (response.status === 401) {
          // Token expired or invalid
          console.log('🔑 Authentication failed - clearing token'); // Debug logging
          localStorage.removeItem('token');
          throw new Error('Your session has expired. Please log in again.');
        } else if (response.status === 400) {
          // Validation error
          throw new Error(result.message || 'Please check your input and try again.');
        } else if (response.status === 404) {
          // User not found
          throw new Error('User profile not found. Please try logging in again.');
        } else {
          // Other server errors
          throw new Error(result.message || 'Failed to update profile. Please try again.');
        }
      }

      // Success!
      console.log('🎉 Profile updated successfully!'); // Debug logging
      alert('Profile updated successfully!');
      
      // Notify parent component with updated user data
      if (onSubmit && result.user) {
        onSubmit(result.user);
      }

    } catch (err) {
      console.error('💥 Submit error:', err); // Debug logging
      
      // Show user-friendly error messages
      if (err.message.includes('log in again') || err.message.includes('Authentication failed')) {
        alert('Your session has expired. Please log in again.');
        // 🔧 TODO: Redirect to login page or trigger re-authentication
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Form submission completed'); // Debug logging
    }
  };

  // Step 8: Render form
  return (
    <div className="user-edit-form">
      <h2>Edit Profile</h2>
      
      {/* 🔧 ADDED: Show authentication status */}
      {!currentUser && !getAuth().currentUser && (
        <div className="auth-warning" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          ⚠️ You are not authenticated. Please log in to update your profile.
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>

        {/* Initials Display */}
        <div className="form-group">
          <label>Profile Initials</label>
          <div className="profile-initials-circle">
            {getUserInitials()}
          </div>
        </div>

        {/* Full Name Field */}
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            disabled={isLoading}
            placeholder="Enter your full name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            disabled={isLoading}
            placeholder="Enter your email"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {/* Phone Number Field */}
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={errors.phoneNumber ? 'input-error' : ''}
            disabled={isLoading}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </div>

        {/* Location Field */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Enter your location"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel} 
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-button" 
            disabled={isLoading || (!currentUser && !getAuth().currentUser)}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditForm;