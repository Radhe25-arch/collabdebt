/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "rgba(255,255,255,0.1)",
        input: "rgba(255,255,255,0.1)",
        ring: "hsl(var(--ring))",
        background: "#000000",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.02)",
          foreground: "#FFFFFF",
        },
        /* Functional accent palette */
        cyber: "#3B82F6",
        violet: "#7C3AED",
        emerald: "#10B981",
        crimson: "#DC2626",
      },
      fontFamily: {
        sans:  ['"Inter"', '-apple-system', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'Consolas', 'monospace'],
        body:  ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '4px',
        full: '4px',
      },
      animation: {
        'fade-up':  'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':  'fadeIn 0.25s linear both',
        'ticker':   'ticker 25s linear infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        ticker:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      boxShadow: {
        'none': 'none',
        'inner-cyber': 'inset 0 0 0 1px rgba(59,130,246,0.3)',
        'inner-glow': 'inset 0 1px 2px rgba(255,255,255,0.04)',
        'outer-glow-cyber': '0 0 2px rgba(59,130,246,0.4)',
        'outer-glow-emerald': '0 0 2px rgba(16,185,129,0.4)',
        'outer-glow-crimson': '0 0 2px rgba(220,38,38,0.4)',
      },
    },
  },
  plugins: [],
};
