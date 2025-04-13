// tailwind.config.js
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

export default {
  darkMode: "class",  // Ensures dark mode can be toggled based on class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // Your app files
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",  // Flowbite support
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbiteReact],
};
