/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#c8a96a',
          hover: '#b5985a',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 8vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        'section': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        'reading': '680px',
        'content': '1080px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
