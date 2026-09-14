/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2747',
          50: '#F0F5FA',
          100: '#E0EBF5',
          200: '#B8D2EB',
          300: '#8FB9E0',
          400: '#5290CE',
          500: '#2A69A8',
          600: '#1D4E82',
          700: '#163B64',
          800: '#0F2747', // Primary Deep Navy
          900: '#0A1B31',
          950: '#06101D',
        },
        royal: {
          DEFAULT: '#1D4ED8',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1D4ED8', // Secondary Royal Blue
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
        },
        emerald: {
          DEFAULT: '#15803D',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D', // Success Emerald
          800: '#166534',
          900: '#14532D',
        },
        saffron: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Accent Saffron
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          dark: '#111C2E',
        },
        text: {
          primary: '#172033',
          secondary: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
          subtle: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 4px 20px rgba(15, 39, 71, 0.06)',
        card: '0 2px 10px rgba(15, 39, 71, 0.04), 0 1px 3px rgba(15, 39, 71, 0.06)',
        elevated: '0 10px 30px rgba(15, 39, 71, 0.08)',
      },
      borderRadius: {
        card: '16px',
        container: '24px',
      }
    },
  },
  plugins: [],
};
