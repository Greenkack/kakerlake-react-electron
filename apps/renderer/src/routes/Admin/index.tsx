import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './Login'
import AdminDashboard from './AdminDashboard'
import SystemSettings from './SystemSettings'
import ProductManagement from './ProductManagement'
import PricingManagement from './PricingManagement'
import DatabaseManagement from './DatabaseManagement'
import UserManagement from './UserManagement'

export default function AdminRouter() {
  // Hier würde normalerweise eine Auth-Prüfung stattfinden
  const isAuthenticated = true // Für Demo-Zwecke

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="settings" element={<SystemSettings />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="pricing" element={<PricingManagement />} />
      <Route path="database" element={<DatabaseManagement />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
