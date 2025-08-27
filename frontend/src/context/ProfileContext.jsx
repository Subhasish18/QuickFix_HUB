import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

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
      const res = await axios.get('https://quickfix-hub.onrender.com/api/provider-details/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProvider(res.data);
      setError('');
      toast.success("Profile loaded successfully ✅", { toastId: "profile-loaded" });
    } catch (err) {
      console.error('Error fetching provider profile:', err);
      setError('Failed to load profile data.');
      // toast.error("Failed to load profile ❌", { toastId: "profile-failed" });
      console.log(err);
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
        toast.info("Logged out, successfully ℹ️", { toastId: "profile-logged-out" });
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = (newProfileData) => {
    setProvider(newProfileData);
    // toast.success("Profile updated successfully ✍️", { toastId: "profile-updated" });
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
