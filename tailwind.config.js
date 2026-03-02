import { colorsConfig } from "./colors.config";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bagel_fat_one: ["Bagel Fat One", "sans-serif"],
        jua: ["Jua", "sans-serif"],
        varela_round: ["Varela Round", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: colorsConfig,
      gridTemplateColumns: {
        golden: "1fr 1.618fr",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
