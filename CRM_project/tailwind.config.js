/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      fontFamily:{
        'jetbrains-mono': ['JetBrainsMono', 'monospace'],
      }
    },
  },
  variants: {
    extend: {
      textUnderlineOffset: {
        6: '6px',
        7: '7px',
      },
    },
  },
  plugins: [],
}

