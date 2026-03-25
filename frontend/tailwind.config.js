/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        primary: "#2563EB",
        primaryDark: "#1D4ED8",
        accent: "#06B6D4",

        bgLight: "#F9FAFB",
        bgDark: "#0B1120",

        cardLight: "#FFFFFF",
        cardDark: "#1E293B",

        textLight: "#111827",
        textDark: "#E5E7EB",

        borderLight: "#E5E7EB",
        borderDark: "#334155",
      },
    },
  },
  plugins: [],
};
