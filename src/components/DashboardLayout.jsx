/**
 * @description Main dashboard layout with navigation and content areas
 * Purpose: Provide the main application shell with navigation and routing
 * Dependencies: react-router-dom, useAuth, various dashboard components
 * Flow: Render sidebar navigation and main content area with routes, check auth
 * Usage: Main container for all dashboard pages
 * Edge cases: Mobile responsiveness, authentication checks, redirects
 */
import React, { useState } from 'react'
import { Routes, Route, useLocation, Navigate, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../utils/AuthContext'
import {
  Briefcase,
  Settings,
  Bell,
  BarChart3,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Home
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import DashboardHome from './DashboardHome'
import ConfigForm from './ConfigForm'
import CampaignForm from './CampaignForm'
import ResultsList from './ResultsList'
import NotificationPanel from './NotificationPanel'
import LoadingSpinner from './LoadingSpinner'

const DashboardLayout = () => {
  const { user, loading, signout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // If still loading, show spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If no user, redirect to login with current location state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Job Search', href: '/dashboard/search', icon: Search },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Briefcase },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const isActiveRoute = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    try {
      await signout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Signout failed:', error)
    }
  }

  return (
    <div className="flex h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900 dark:text-white">
                Ignite<span className="text-primary-500">Jobs</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
            >
              <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </button>
          </div>
          {/* User info */}
          <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActiveRoute(item.href)
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                        : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
          {/* Footer */}
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
              >
                <Menu className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </button>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {navigation.find(item => isActiveRoute(item.href))?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationsOpen(true)}
                className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors duration-200 relative"
              >
                <Bell className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 border-white dark:border-secondary-800"></span>
              </motion.button>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="search" element={<ResultsList />} />
                <Route path="campaigns" element={<CampaignForm />} />
                <Route path="settings" element={<ConfigForm />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  )
}

export default DashboardLayout