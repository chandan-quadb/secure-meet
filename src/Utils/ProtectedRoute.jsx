import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userData = useSelector((state) => state.user.data);

  return userData ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;