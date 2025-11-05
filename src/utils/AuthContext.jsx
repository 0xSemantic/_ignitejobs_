/** 
 * @description Authentication context for managing user state
 * Purpose: Provide auth state and methods to entire app
 * Dependencies: React context, authService for API calls
 * Flow: Initialize from localStorage, provide login/logout methods
 * Usage: useAuth() hook in components, signin/signout for auth actions
 * Edge cases: Token expiration, network errors
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as authLogin, register as authRegister, logout as authLogout } from '../api/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token on app load
    const token = localStorage.getItem('ignitejobs-token')
    const userData = localStorage.getItem('ignitejobs-user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('ignitejobs-token')
        localStorage.removeItem('ignitejobs-user')
      }
    } else {
      // Set demo user for development
      setUser({
        id: 1,
        email: 'demo@ignitejobs.com',
        name: 'Demo User'
      })
    }
    setLoading(false)
  }, [])

  const signin = async (email, password) => {
    try {
      const response = await authLogin(email, password)
      setUser(response.user)
      localStorage.setItem('ignitejobs-token', response.token)
      localStorage.setItem('ignitejobs-user', JSON.stringify(response.user))
      return response
    } catch (error) {
      throw error
    }
  }

  const signup = async (email, password, name) => {
    try {
      const response = await authRegister(email, password, name)
      setUser(response.user)
      localStorage.setItem('ignitejobs-token', response.token)
      localStorage.setItem('ignitejobs-user', JSON.stringify(response.user))
      return response
    } catch (error) {
      throw error
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
    }
  }

  const value = {
    user,
    signin,
    signup,
    signout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}