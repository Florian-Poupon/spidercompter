/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "spidey-red": "#DF1F2D",
        "spidey-blue": "#2B3784",
      },
    },
  },
  plugins: [],
};

export default config;
