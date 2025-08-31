/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Food Restaurant Primary Colors (Warm & Appetizing)
        'primary-50': '#fef2f2',
        'primary-100': '#fee2e2',
        'primary-200': '#fecaca',
        'primary-300': '#fca5a5',
        'primary-400': '#f87171',
        'primary-500': '#ef4444',
        'primary-600': '#dc2626',
        'primary-700': '#b91c1c',
        'primary-800': '#991b1b',
        'primary-900': '#7f1d1d',
        'primary-red': '#D62828',
        'primary-yellow': '#F77F00',
        'primary-white': '#FFFFFF',

        // Food Restaurant Secondary Colors (Orange & Warm)
        'secondary-50': '#fff7ed',
        'secondary-100': '#ffedd5',
        'secondary-200': '#fed7aa',
        'secondary-300': '#fdba74',
        'secondary-400': '#fb923c',
        'secondary-500': '#f97316',
        'secondary-600': '#ea580c',
        'secondary-700': '#c2410c',
        'secondary-800': '#9a3412',
        'secondary-900': '#7c2d12',
        'secondary-gray': '#6B7280',
        'secondary-light-gray': '#F3F4F6',

        // Food Accent Colors
        'food-orange': '#ff6b35',
        'food-yellow': '#f4a261',
        'food-green': '#2a9d8f',
        'food-brown': '#8b4513',
        'food-cream': '#fefae0',

        // Success Colors
        'success-50': '#ecfdf5',
        'success-500': '#10b981',
        'success-600': '#059669',

        // Warning Colors
        'warning-50': '#fffbeb',
        'warning-500': '#f59e0b',
        'warning-600': '#d97706',

        // Error Colors
        'error-50': '#fef2f2',
        'error-500': '#ef4444',
        'error-600': '#dc2626',

        // Info Colors
        'info-50': '#eff6ff',
        'info-500': '#3b82f6',
        'info-600': '#2563eb',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 