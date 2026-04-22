import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import EmployeeDashboard from '../pages/Employee_dashbord'
import Login from '../pages/Login'

function AppRoutes() {
  return (
   
      <Routes>
        <Route path="/" element={<EmployeeDashboard/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    
  )
}

export default AppRoutes