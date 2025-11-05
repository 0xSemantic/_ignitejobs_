/** 
 * @description Main application component with routing and theme management
 * Purpose: Entry point for the IgniteJobs application with routing and global state
 * Dependencies: react-router-dom, ThemeProvider, AuthProvider
 * Flow: Sets up routing, theme context, and authentication context
 * Usage: Renders different routes based on authentication status
 * Edge cases: Handles 404 routes, theme persistence
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, useTheme } from './utils/ThemeContext'
import { AuthProvider, useAuth } from './utils/AuthContext'
import AuthForm from './components/AuthForm'
import DashboardLayout from './components/DashboardLayout'
import LoadingSpinner from './components/LoadingSpinner'

// Component to handle theme initialization
function ThemeInitializer({ children }) {
  const { isInitialized } = useTheme()

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-secondary-600 dark:text-secondary-400">Loading theme...</p>
        </div>
      </div>
    )
  }

  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <AuthForm type="login" /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <AuthForm type="register" /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/dashboard/*" 
        element={user ? <DashboardLayout /> : <Navigate to="/login" replace />} 
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">404</h1>
            <p className="text-secondary-600 dark:text-secondary-400">Page not found</p>
          </div>
        </div>
      } />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
            <ThemeInitializer>
              <AppRoutes />
            </ThemeInitializer>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App