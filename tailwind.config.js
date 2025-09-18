/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
          'spin': 'spin 1s linear infinite',
        },
        keyframes: {
          pulse: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '.5' },
          },
          ping: {
            '75%, 100%': { transform: 'scale(2)', opacity: '0' },
          },
          spin: {
            'to': { transform: 'rotate(360deg)' },
          },
        },
        backdropBlur: {
          xs: '2px',
        },
        boxShadow: {
          '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    plugins: [],
  }
  