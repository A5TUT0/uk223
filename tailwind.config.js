/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Escanea todos los archivos en src con las extensiones especificadas
  ],
  theme: {
    extend: {
      colors: {
        customBackground: '#09090B',
        accent: '#CFCFCF',
      },
      spacing: {
        128: '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
