/**
 * @description Notification panel for displaying system and campaign alerts
 * Purpose: Show real-time notifications and system messages to users
 * Dependencies: API services, WebSocket for real-time updates, motion for animations
 * Flow: Fetch notifications, display in organized list, mark as read
 * Usage: Slide-in panel for notification management
 * Edge cases: Empty state, loading states, real-time updates
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react'
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api/notificationService'
import LoadingSpinner from './LoadingSpinner'

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async () => {
    try {
      const notificationsData = await fetchNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_results':
        return <Sparkles className="w-5 h-5 text-green-500" />
      case 'limit_warning':
        return <AlertCircle className="w-5 h-5 text-accent-500" />
      case 'campaign_paused':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-primary-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_results':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'limit_warning':
        return 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800'
      case 'campaign_paused':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 max-w-full bg-white dark:bg-secondary-800 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-secondary-900 dark:text-white" />
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-primary-500 hover:text-primary-600 transition-colors duration-200"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="p-4 space-y-4">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        notification.read 
                          ? 'bg-white dark:bg-secondary-700 border-secondary-200 dark:border-secondary-600' 
                          : getNotificationColor(notification.type)
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-secondary-900 dark:text-white leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                            {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-secondary-400 hover:text-green-500 transition-colors duration-200"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                >
                  <Bell className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mb-4" />
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    No Notifications
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    You're all caught up! New notifications will appear here.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel