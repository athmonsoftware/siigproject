/** @type {import('tailwindcss').Config} */
import theme from "./src/theme.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: theme.tailwindColors,
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        site: "1200px",
      },
      boxShadow: {
        brand: "0 6px 24px -8px rgba(6, 42, 31, .18)",
        "brand-lg": "0 24px 60px -20px rgba(6, 42, 31, .35)",
      },
    },
  },
  plugins: [],
};
