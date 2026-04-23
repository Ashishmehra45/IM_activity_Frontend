import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import EmployeeDashboard from '../pages/Employee_dashbord'
import Login from '../pages/Login'
import ProtectedRoute from '../pages/ProtectedRoute' // 👈 Ye import zaroori hai

function AppRoutes() {
  return (
    <Routes>
    
      <Route path="/login" element={<Login />} />

      {/* 🔒 Protected: Employee Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
        <Route path="/" element={<EmployeeDashboard />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
      </Route>

      
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

     
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes