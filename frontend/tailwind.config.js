/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tea: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f4dbb0',
          300: '#ecc17d',
          400: '#e2a04a',
          500: '#d4882a',
          600: '#b86e20',
          700: '#8B4513',
          800: '#6b3510',
          900: '#4a2509',
          950: '#2a1405',
        },
        chai: {
          light: '#FFF8DC',
          cream: '#F5DEB3',
          warm: '#D2691E',
          dark: '#3E1C00',
          green: '#4a7c59',
          gold: '#c8960c',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'tea-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b86e20' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'steam': 'steam 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        steam: { '0%, 100%': { transform: 'translateY(0) scaleX(1)' }, '50%': { transform: 'translateY(-8px) scaleX(1.1)' } },
      }
    },
  },
  plugins: [],
}
