/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:'#020916',
        accent:'#70FF00',
        lightGray: '#1F2937',
      },
      fontFamily: {
        dmsans: 'DM Sans, sans-serif'
      },
      maxWidth: {
        'maxW' : '82rem'
      }
    },
  },
  plugins: [],
}

