/** 
 * @description Notification API service functions
 * Purpose: Handle all notification-related API calls
 */

import { getNotifications, markAsRead, markAllAsRead } from '../data/notificationData'

export const fetchNotifications = async () => {
  return await getNotifications()
}

export const markNotificationAsRead = async (id) => {
  return await markAsRead(id)
}

export const markAllNotificationsAsRead = async () => {
  return await markAllAsRead()
}