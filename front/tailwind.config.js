const colors = require("tailwindcss/colors");
module.exports = {
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        neutral: colors.neutral,
        // cgray: colors.gray
        // "app-back-light": "#E7E9EE",
      },
      fontFamily: {
        'ibm-plex-sans': ['ibm-plex-sans', 'sans-serif'] 
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
