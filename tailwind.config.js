/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Comic Sans MS"', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 