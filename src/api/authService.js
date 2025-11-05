/** 
 * @description Authentication API service functions
 * Purpose: Handle all authentication-related API calls
 * Dependencies: axios for HTTP requests, authData for mock data
 * Flow: Make API calls, handle responses and errors
 * Usage: Import and call in AuthContext or components
 * Edge cases: Network errors, invalid responses
 */

import { login as mockLogin, register as mockRegister, logout as mockLogout } from '../data/authData'

// In a real app, these would be actual API calls
// For now, we're using mock data
export const login = async (email, password) => {
  return await mockLogin(email, password)
}

export const register = async (email, password, name) => {
  return await mockRegister(email, password, name)
}

export const logout = async () => {
  return await mockLogout()
}