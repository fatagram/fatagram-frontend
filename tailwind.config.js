/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat, sans-serif'],
        bagel_fat_one: ['Bagel Fat One', 'sans-serif'],
        jua: ['Jua', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
