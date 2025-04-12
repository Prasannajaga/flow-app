/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Ensure .tsx is included
  theme: {
    extend: {
      color : {
        primary: {
          DEFAULT: '#3B82F6',     // Blue 500
          dark: '#1E40AF',        // Deep Blue
          light: '#93C5FD',       // Soft Blue
        }, 
        surface: {
          light: '#FFFFFF',
          dark: '#374151',
        },
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#0EA5E9',
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          light: '#F9FAFB',
        },
      },
      backgroundColor: {
        light: '#F9FAFB',
        dark: '#1F1F1E',
      },
      borderColor:{
        light: '#F9FAFB',
        dark: '#1F1F1E',
      },
      textColor:{
        light: '#F9FAFB',
        dark: '#1F1F1E',
      },
      backgroundImage : {
         'gradient-primary': 'linear-gradient(300deg, #4859CD 0%, #4859CD 100%)'
      }
    },
  },
  plugins: [],
}

