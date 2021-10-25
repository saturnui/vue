module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#0694ff', // For lighter primary color
          DEFAULT: '#1873e8', // Normal primary color
          dark: '#1d66ca', // Used for hover, active, etc.
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['group-hover'],
      overflow: ['hover', 'focus'],
      // ringOpacity: ['hover', 'active'],
      zIndex: ['hover', 'active'],
    },
  },
  plugins: [require('kutty')],
}
