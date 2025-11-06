/**
 * @description Authentication context for managing user state
 * Purpose: Provide auth state and methods to entire app
 * Dependencies: React context, authService for API calls
 * Flow: Initialize from localStorage, provide login/logout methods
 * Usage: useAuth() hook in components, signin/signout for auth actions
 * Edge cases: Token expiration, network errors, redirect handling
 */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login as authLogin, register as authRegister, logout as authLogout } from '../api/authService'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthInitializer = () => {
  const { setUser, setLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('ignitejobs-token')
      const userData = localStorage.getItem('ignitejobs-user')
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          // Verify token with backend
          const response = await axios.get(`${baseURL}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data.user)
        } catch (error) {
          console.error('Error verifying token:', error)
          localStorage.removeItem('ignitejobs-token')
          localStorage.removeItem('ignitejobs-user')
          delete axios.defaults.headers.common['Authorization']
          navigate('/login', { replace: true, state: { from: location } })
        }
      } else {
        setUser(null)
        if (!['/login', '/register'].includes(location.pathname)) {
          navigate('/login', { replace: true, state: { from: location } })
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [navigate, location, setUser, setLoading])

  return null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const signin = async (email, password) => {
    try {
      const response = await authLogin(email, password)
      const { user: userData, access_token } = response
      setUser(userData)
      localStorage.setItem('ignitejobs-token', access_token)
      localStorage.setItem('ignitejobs-user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      return response
    } catch (error) {
      throw new Error(error || 'Login failed')
    }
  }

  const signup = async (email, password, name) => {
    try {
      await authRegister(email, password, name)
      // Register doesn't return a token, so log in immediately
      const loginResponse = await authLogin(email, password)
      const { user: userData, access_token } = loginResponse
      setUser(userData)
      localStorage.setItem('ignitejobs-token', access_token)
      localStorage.setItem('ignitejobs-user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      return loginResponse
    } catch (error) {
      throw new Error(error || 'Registration failed')
    }
  }

  const signout = async () => {
    try {
      await authLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      delete axios.defaults.headers.common['Authorization']
      navigate('/login', { replace: true })
    }
  }

  const value = {
    user,
    signin,
    signup,
    signout,
    loading,
    setUser,
    setLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}