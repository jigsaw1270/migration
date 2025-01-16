/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('./src/assets/image/login.jpg')",

      },
      fontFamily: {
        'technor-extralight': ['Technor-Extralight', 'sans-serif'],
        'technor-light': ['Technor-Light', 'sans-serif'],
        'technor-regular': ['Technor-Regular', 'sans-serif'],
        'technor-medium': ['Technor-Medium', 'sans-serif'],
        'technor-semibold': ['Technor-Semibold', 'sans-serif'],
        'technor-bold': ['Technor-Bold', 'sans-serif'],
        'technor-black': ['Technor-Black', 'sans-serif'],
      },
      colors: {
        customOrange: '#CD5C08',
        customPeach: '#FFF5E4',
        customMint: '#C1D8C3',
        customTeal: '#6A9C89',
      },
    },
  },
  plugins: [typography,],
}