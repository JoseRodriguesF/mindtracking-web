/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        4.5: "1.125rem", // 18px (ex.: pt-4.5/pb-4.5)
        6.5: "1.625rem", // 26px (ex.: w-6.5)
        12.5: "3.125rem", // 50px (ex.: w-12.5/h-12.5/pb-12.5)
        16.5: "4.125rem", // 66px (ex.: w-16.5)
        25: "6.25rem", // 100px (ex.: mt-25)
        37.5: "9.375rem", // 150px (ex.: ml-37.5)
        75: "18.75rem", // 300px (ex.: w-75)
        100: "25rem", // 400px (ex.: w-100)
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
