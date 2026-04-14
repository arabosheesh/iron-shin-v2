/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'gym-black': '#0A0A0A',
        'gym-red': '#D72638',
        'gym-gold': '#FFD700',
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
      }
    },
  },
  plugins: [],
}