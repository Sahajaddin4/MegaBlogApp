/** @type {import('tailwindcss').Config} */
export default {
  content: [    "./index.html",
    "./src/**/*.{js,jsx}",
],
  theme: {
    extend: {
      colors: {
        'blue-grey-light': '#96C2DB',  // Light blue-grey
        'blue-grey-dark': '#E5EDF1',   // Darker blue-grey
        'white': '#FFFFFF'             // White
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, #96C2DB, #E5EDF1, #FFFFFF)',
        'gradient-to-t': 'linear-gradient(to top, #96C2DB, #E5EDF1, #FFFFFF)'
      }
    },
  },
  plugins: [],
}

