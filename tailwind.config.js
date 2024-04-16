/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Open Sans',
        inter: 'Inter',
      },
    },
    colors: {
      'custom-gray-one': '#2e2e2e',
      'custom-gray-two': '#ebebeb',
    },
  },
  plugins: [],
});
