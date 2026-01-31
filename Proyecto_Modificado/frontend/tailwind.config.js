/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffef5',
          100: '#fffceb',
          200: '#fff7d1',
          300: '#fff2b7',
          400: '#ffe883',
          500: '#ffde4f',
          600: '#e6c847',
          700: '#bfa63c',
          800: '#998431',
          900: '#736226',
          DEFAULT: '#D4AF37',
        },
        dark: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
          DEFAULT: '#000000',
        },
      },
    },
  },
  plugins: [],
}
