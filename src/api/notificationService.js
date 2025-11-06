/**
 * @description Notification API service functions
 * Purpose: Handle all notification-related API calls
 */
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const fetchNotifications = async (unreadOnly = false) => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.get(`${baseURL}/notifications`, { // Corrected: Removed extra /notifications
      headers: { Authorization: `Bearer ${token}` },
      params: { unread_only: unreadOnly }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to fetch notifications'
  }
}

export const markNotificationAsRead = async (id) => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.patch(`${baseURL}/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to mark notification as read'
  }
}

export const markAllNotificationsAsRead = async () => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.patch(`${baseURL}/notifications/mark-all`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to mark all notifications as read'
  }
}