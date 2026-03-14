
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC907',
          dark: '#E5B400',
        },
        dark: {
          DEFAULT: '#1a1a2e',
          lighter: '#16213e',
        },
        warm: {
          50: '#fdf8f5',
          100: '#fbece1',
          200: '#f7d8c4',
          800: '#5c3a21',
          900: '#4a2e1b',
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
