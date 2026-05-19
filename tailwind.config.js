/** @type {import('tailwindcss').Config} */
export default {
  content: ["./templates/**/*.html", "./static/js/**/*.js"],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
