module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
        },
        bg: {
          dark: '#0a1438',
        },
      },
      backdropBlur: {
        glass: '24px',
      },
      borderRadius: {
        'bubble': '1.25rem',
      },
      animation: {
        'liquid': 'liquid 15s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-subtle': 'bounce-subtle 0.8s infinite alternate',
      },
      keyframes: {
        liquid: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        'bounce-subtle': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
