/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'skh-bg': '#0f1114',
        'skh-sidebar': '#1a1d23',
        'skh-card': '#14171c',
        'skh-border': '#2c313a',
        'skh-green': '#10b981',
      }
    },
  },
  plugins: [],
}
