/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '57': '14.25rem',
        '50': '12.5rem',
        '49': '12.25rem'
      },
      colors: {
        'custom-orange': 'rgba(237, 91, 38, 0.3)',
        'custom-option': 'rgba(121, 119, 119, 0.3)',
        'custom-background': 'rgba(233,240,240)'
      },
      transitionDelay: {
        '5000': '5000ms',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      opacity: ['group-hover'],
    },
  },
  plugins: [],
}

