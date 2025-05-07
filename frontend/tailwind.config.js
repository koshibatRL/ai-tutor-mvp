// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#58cc02',
            hover: '#46a302',
          },
          secondary: {
            DEFAULT: '#1cb0f6',
            hover: '#0c95d4',
          },
          orange: {
            DEFAULT: '#ff9600',
          },
          purple: {
            DEFAULT: '#ce82ff',
          },
        },
        borderRadius: {
          'xl': '1rem',
        },
        animation: {
          'spin': 'spin 1s linear infinite',
          'fade-in': 'fadeIn 0.3s ease-in-out',
          'slide-up': 'slideUp 0.4s ease-out',
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
        },
      },
    },
    plugins: [],
  }