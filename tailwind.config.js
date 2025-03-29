/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#990033',
        'brand-gold': '#ffb310',
        'brand-blue': '#56a0d3',
      },
      fontFamily: {
        'smiley': ['SmileySans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 