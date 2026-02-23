/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6324b2",
        secondary: "#eb00bc",
        accent: "#ff5200",
        background: "#000000",
        surface: "#111111"
      }
    },
  },
  plugins: [],
}

