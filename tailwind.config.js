/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Breakpoints personalizados estilo redecora
    screens: {
      'xs': '375px',   // iPhone SE, móviles pequeños
      'sm': '640px',   // Móviles grandes
      'md': '768px',   // Tablets
      'lg': '1024px',  // Laptops
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Desktop grandes
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a472a',
          light: '#00963c',
          dark: '#0d3520',
        },
        secondary: {
          DEFAULT: '#8b4513',
          light: '#a0522d',
          dark: '#654321',
        },
        accent: {
          DEFAULT: '#00963c',
          light: '#00b849',
          dark: '#007a31',
        },
        felt: {
          green: '#00963c',
        },
        wood: {
          DEFAULT: '#8b4513',
          dark: '#654321',
        },
        cream: '#fffacd',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Brothers', 'Oswald', 'sans-serif'],
        script: ['Brittany', 'Dancing Script', 'cursive'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

