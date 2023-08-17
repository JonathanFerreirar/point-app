/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      lt: '940px',
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        muted: 'hsl(240 15.8% 95.9%)',
      },
    },
  },
  plugins: [],
}
