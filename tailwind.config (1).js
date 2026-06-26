/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#f0a500',
          600: '#d99400',
        },
        gray: {
          900: '#1a1a1a',
          800: '#252525',
          700: '#333333',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        '12': '12px',
        '16': '16px',
      },
    },
  },
  plugins: [],
};
