/**
 * @description Theme toggle switch for dark/light mode with proper state indication
 * Purpose: Allow users to switch between dark and light themes with visual feedback
 * Dependencies: useTheme hook, Lucide React for icons
 * Flow: Toggles theme on click, shows appropriate icon, reflects current state
 * Usage: Include in header/navigation components
 * Edge cases: Loading state, system preference, persistence
 */

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../utils/ThemeContext'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
  const { isDark, toggleTheme, isInitialized } = useTheme()

  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800">
        <div className="w-5 h-5"></div>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15,
          duration: 0.3 
        }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-accent-400" />
        ) : (
          <Moon className="w-5 h-5 text-secondary-600" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle