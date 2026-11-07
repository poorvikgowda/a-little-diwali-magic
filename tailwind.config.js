/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diwali: {
          navy: '#050816',
          midnight: '#090d2a',
          purple: '#1c0a35',
          deepViolet: '#2b0c48',
          royalGold: '#ffd700',
          amberGlow: '#ff9e1b',
          marigold: '#ff7b00',
          ruby: '#ff3366',
          softPink: '#f472b6',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        handwritten: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.82', transform: 'scale(0.96)' },
          '75%': { opacity: '0.92', transform: 'scale(1.04)' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.7))' },
          '50%': { filter: 'drop-shadow(0 0 35px rgba(255, 165, 0, 0.95))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        flicker: 'flicker 2.5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
      }
    },
  },
  plugins: [],
}

