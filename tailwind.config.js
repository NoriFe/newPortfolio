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
      },
      fontFamily: {
        dnsans: 'DM Sans, sans-serif'
      }
    },
  },
  plugins: [],
}

