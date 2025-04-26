// src/utils/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import auth from './Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>; // simple loading

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
