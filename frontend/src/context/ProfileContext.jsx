
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProfileContext = createContext();

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProviderProfile = async () => {
    const auth = getAuth();
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get('http://localhost:5000/api/provider-details/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProvider(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching provider profile:', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProviderProfile();
      } else {
        setProvider(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = (newProfileData) => {
    setProvider(newProfileData);
  };

  const value = {
    provider,
    loading,
    error,
    fetchProviderProfile,
    updateProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
