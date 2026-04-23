import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Check karo ki user logged in hai ya nahi
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Check karo ki user ka role allowed hai ya nahi
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Agar employee Admin page access karne ki koshish kare toh usko uske dashboard pe bhej do
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/dashboard'} replace />;
  }

  // Agar sab sahi hai toh page dikhao
  return <Outlet />;
};

export default ProtectedRoute;