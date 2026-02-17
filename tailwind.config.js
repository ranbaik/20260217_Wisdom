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
        oriental: {
          dark:     '#0a0a0a',
          gold:     '#d4af37',
          'gold-light': '#f0d060',
          'gold-dark':  '#a8892a',
          red:      '#dc2626',
          'red-dark': '#991b1b',
        },
      },
      fontFamily: {
        korean: ['Noto Serif KR', 'serif'],
      },
      boxShadow: {
        'gold-sm': '0 0 8px rgba(212,175,55,0.3)',
        'gold':    '0 0 20px rgba(212,175,55,0.4)',
        'gold-lg': '0 0 40px rgba(212,175,55,0.25)',
      },
      animation: {
        'spin-slow':  'spin 3s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
