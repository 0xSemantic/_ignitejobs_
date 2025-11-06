/**
 * @description Main application component with routing and theme management
 * Purpose: Entry point for the IgniteJobs application with routing and global state
 * Dependencies: react-router-dom, ThemeProvider, AuthProvider
 * Flow: Sets up routing, theme context, and authentication context
 * Usage: Renders different routes based on authentication status
 * Edge cases: Handles 404 routes, theme persistence, auth loading
 */
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider, useTheme } from './utils/ThemeContext'
import { AuthProvider, AuthInitializer, useAuth } from './utils/AuthContext'
import AuthForm from './components/AuthForm'
import DashboardLayout from './components/DashboardLayout'
import LoadingSpinner from './components/LoadingSpinner'

// Component to handle protected routes
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Component to handle public routes (redirect logged-in users to dashboard)
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user) {
    // Redirect to the original destination or dashboard
    const redirectTo = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return children
}

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

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ThemeInitializer>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <AuthForm type="login" />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <AuthForm type="register" />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
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
            <AuthInitializer />
          </ThemeInitializer>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App