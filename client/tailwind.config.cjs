/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'proxima': ['"proxima-nova"', 'Helvetica', 'sans-serif'],
      },
      colors: {
        earth: {
          50: '#fdf6ee',      // lightest sandstone
          100: '#f8ecd9',     // pale sandstone
          200: '#f3e2c3',     // light sandstone
          300: '#e9d3a7',     // sandstone
          400: '#d8b97a',     // ochre sandstone
          500: '#c9a45c',     // deeper ochre
          600: '#b08b3c',     // muted gold
          700: '#8c6c2a',     // earthy brown
          800: '#6b5220',     // deep brown
          900: '#473513',     // darkest accent
        },
        moss: {
          50: '#f6faf7',
          100: '#e3f0e3',
          200: '#c8e1c8',
          300: '#a3cfa3',
          400: '#7db87d',
          500: '#5e9c5e',
          600: '#447344',
          700: '#2d4d2d',
          800: '#1a2d1a',
          900: '#0d160d',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 