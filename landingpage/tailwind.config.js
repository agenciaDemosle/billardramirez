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
          DEFAULT: '#1a4d2e',
          dark: '#0f2818',
          light: '#4f772d',
        },
        accent: {
          DEFAULT: '#90a955',
          light: '#a8c078',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
