/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5ca',
          300: '#8dd2a5',
          400: '#57b87c',
          500: '#339962',  // Main primary - forest green
          600: '#25804e',
          700: '#1e6640',
          800: '#1a5134',
          900: '#16422c',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e3e6e8',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',  // Main secondary - slate gray
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        accent: {
          50: '#fef7ee',
          100: '#fdedd7',
          200: '#fbd7ae',
          300: '#f8b97a',
          400: '#f49345',  // Main accent - terracotta
          500: '#f1731e',
          600: '#e25714',
          700: '#bc4113',
          800: '#963517',
          900: '#792e16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}