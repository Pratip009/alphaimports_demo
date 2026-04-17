/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif:   ['"Cormorant Garamond"', "Georgia", "serif"],
        sans:    ['"DM Sans"', "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
      colors: {
        obsidian: {
          DEFAULT: "#0d0d0f",
          50:  "#f5f5f6",
          100: "#e8e8ea",
          200: "#c8c8cc",
          300: "#9898a0",
          400: "#65656e",
          500: "#43434a",
          600: "#2e2e34",
          700: "#1e1e23",
          800: "#141418",
          900: "#0d0d0f",
        },
        champagne: {
          DEFAULT: "#c9a96e",
          light:   "#e8d5b0",
          dark:    "#9a7a45",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        shimmer:   "shimmer 1.8s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
};
