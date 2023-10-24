/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
      slowSpin: 'spin 10s infinite linear'
      },
      colors: {
        bg:'#020916',
        accent:{DEFAULT: '#70FF00', 600:'#0fea00'}
        
      },
      fontFamily: {
        dmsans: 'DM Sans, sans-serif'
      },
      maxWidth: {
        'maxW' : '82rem'
      },
      borderRadius: {
        'rad' : '0.625rem',
        'rad-xl' : '1.25rem'
      },
      boxShadow: {
        'inner-light' : 'inset 0 2px 0 0 rgba(255,255,255,0.15)',
        'inner-light-sm' : 'inset 0 1px 0 0 rgba(255,255,255,0.15)',
      }
    },
  },
  plugins: [],
}

