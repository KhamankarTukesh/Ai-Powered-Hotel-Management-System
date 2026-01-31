/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        falling: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(300px) rotate(360deg)', opacity: '0' },
        },
        shimmer: {
          '100%': { left: '100%' },
        },
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        }
      },
      animation: {
        'falling': 'falling 3s linear infinite',
        'shimmer': 'shimmer 1s infinite',
        'scan': 'scan 3s ease-in-out infinite',
      },
      // Dnyanda Branding Colors (Optional but helpful)
      colors: {
        dnyanda: {
          orange: '#f97415',
          red: '#E33E33',
        }
      }
    },
  },
  plugins: [],
}