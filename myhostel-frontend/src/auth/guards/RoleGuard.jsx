import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleGuard = ({ allowedRoles }) => {
  const role = localStorage.getItem('role');

  // Agar user ka role allowed list mein nahi hai, toh unauthorized page ya login pe bhej do
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;