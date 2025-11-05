/**
 * @description Reusable loading spinner component with different sizes and colors
 * Purpose: Provide consistent loading states throughout the application
 * Dependencies: Lucide React for icons, Tailwind for styling
 * Flow: Renders a spinning loader with configurable properties
 * Usage: <LoadingSpinner size="md" color="primary" />
 * Edge cases: Responsive sizes, theme compatibility
 */

import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    white: 'text-white'
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  )
}

export default LoadingSpinner