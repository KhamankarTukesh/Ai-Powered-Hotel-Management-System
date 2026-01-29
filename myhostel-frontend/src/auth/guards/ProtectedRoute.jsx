import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Agar token nahi hai, toh login page pe bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar token hai, toh andar jane do (Outlet matlab child components)
  return <Outlet />;
};

export default ProtectedRoute;