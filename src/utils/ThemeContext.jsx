/** 
 * @description Theme context for managing dark/light mode with persistent storage
 * Purpose: Provide theme state and toggle function to entire app with localStorage persistence
 * Dependencies: React context, localStorage for persistence
 * Flow: Initialize from localStorage or system preference, provide toggle, persist changes
 * Usage: useTheme() hook in components, toggleTheme() to switch
 * Edge cases: SSR safety, system preference detection, consistent state
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const initializeTheme = () => {
      try {
        // Check for saved theme preference first
        const savedTheme = localStorage.getItem('ignitejobs-theme')
        
        if (savedTheme) {
          // Use saved preference
          setIsDark(savedTheme === 'dark')
        } else {
          // Use system preference as fallback
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setIsDark(systemPrefersDark)
        }
      } catch (error) {
        console.error('Error initializing theme:', error)
        // Fallback to light theme if there's an error
        setIsDark(false)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeTheme()
  }, [])

  useEffect(() => {
    // Only apply theme after initialization to prevent flash
    if (!isInitialized) return

    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Persist to localStorage
    try {
      localStorage.setItem('ignitejobs-theme', isDark ? 'dark' : 'light')
    } catch (error) {
      console.error('Error saving theme preference:', error)
    }
  }, [isDark, isInitialized])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  const setTheme = (dark) => {
    setIsDark(dark)
  }

  const value = {
    isDark,
    toggleTheme,
    setTheme,
    isInitialized
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}