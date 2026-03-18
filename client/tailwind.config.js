/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        arena: {
          bg:      '#0A0A0F',
          bg2:     '#111118',
          bg3:     '#16161F',
          bg4:     '#1C1C28',
          border:  'rgba(124,58,237,0.2)',
          border2: 'rgba(0,217,181,0.2)',
          text:    '#F0EEF8',
          muted:   '#9896AA',
          dim:     '#5A5870',
          purple:  '#7C3AED',
          purple2: '#9D65F5',
          teal:    '#00D9B5',
          teal2:   '#00F5CE',
        },
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', 'Consolas', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up':  'fadeUp 0.45s ease both',
        'fade-in':  'fadeIn 0.3s ease both',
        'ticker':   'ticker 25s linear infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        ticker:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
