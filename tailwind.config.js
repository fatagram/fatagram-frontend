/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bagel_fat_one: ["Bagel Fat One", "sans-serif"],
        jua: ["Jua", "sans-serif"],
        varela_round: ["Varela Round", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        "single-main": "rgb(var(--main-single-color) / <alpha-value>)",
        "single-second": "rgb(var(--second-single-color) / <alpha-value>)",
        "single-third": "rgb(var(--third-single-color) / <alpha-value>)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
