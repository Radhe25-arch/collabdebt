import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        cyan: { DEFAULT: '#00e5ff', dim: '#00b8cc' },
        green: { DEFAULT: '#00ff88' },
        red: { DEFAULT: '#ff3b5c' },
        yellow: { DEFAULT: '#ffd600' },
        purple: { DEFAULT: '#7c3aed' },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeInUp: 'fadeInUp 0.4s ease-out',
        ticker: 'ticker 25s linear infinite',
        cursor: 'cursor 1s step-end infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeInUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        cursor: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
}
export default config
