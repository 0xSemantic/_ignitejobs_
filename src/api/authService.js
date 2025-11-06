/**
 * @description Service for authentication-related API endpoints
 * Purpose: Provides functions for user registration, login, logout, and token verification
 * Dependencies: axios for HTTP requests
 * Flow: Sends requests to auth endpoints and manages token storage
 * Usage: Import and call functions in components like AuthForm
 * Edge cases: Handles 401 Unauthorized and 404 errors
 */
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, { email, password })
    return response.data
  } catch (error) {
    throw error.response?.data?.detail || 'Login failed'
  }
}

export const register = async (email, password, name) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, { email, password, name })
    return response.data
  } catch (error) {
    throw error.response?.data?.detail || 'Registration failed'
  }
}

export const logout = async () => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.post(`${baseURL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    throw error.response?.data?.detail || 'Logout failed'
  }
}