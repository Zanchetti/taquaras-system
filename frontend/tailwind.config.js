/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adc-green': '#1a5f3f',
        'adc-light': '#2d8659',
      }
    },
  },
  plugins: [],
}
