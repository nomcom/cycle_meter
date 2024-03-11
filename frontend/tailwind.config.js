/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.tsx", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
