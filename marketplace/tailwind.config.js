/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF006E',
          'pink-dark': '#CC0055',
          'pink-light': '#FF4DA6',
          blue: '#00B4D8',
          'blue-dark': '#0090AD',
          'blue-light': '#48CAE4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
