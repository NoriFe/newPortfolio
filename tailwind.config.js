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
      },
      borderRadius: {
        'rad' : '0.625rem'
      },
      boxShadow: {
        'innerLight' : 'inset 0 2px 0 0 rgba(255,255,255,0.15)',
        'innerLightMin' : 'inset 0 1px 0 0 rgba(255,255,255,0.15)',
      }
    },
  },
  plugins: [],
}

