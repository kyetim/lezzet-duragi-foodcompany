/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#D62828',
        'primary-yellow': '#F77F00',
        'primary-white': '#FFFFFF',
        'secondary-gray': '#6B7280',
        'secondary-lightGray': '#F3F4F6',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 