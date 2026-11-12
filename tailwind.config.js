/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        medical: {
          primary: '#0284c7',   // sky-600
          secondary: '#0f766e', // teal-700
          dark: '#0f172a',      // slate-900
          accent: '#06b6d4',    // cyan-500
          light: '#f8fafc',     // slate-50
          emergency: '#ef4444', // red-500
          success: '#10b981',   // emerald-500
          warning: '#f59e0b',   // amber-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
