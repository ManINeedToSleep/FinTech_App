import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'aurora-green': {
          DEFAULT: 'var(--aurora-green)',
          opacity: 'rgba(124, 252, 208, var(--tw-bg-opacity))'
        },
        'nordic-blue': {
          DEFAULT: 'var(--nordic-blue)',
          opacity: 'rgba(30, 61, 89, var(--tw-bg-opacity))'
        },
        'midnight-purple': {
          DEFAULT: 'var(--midnight-purple)',
          opacity: 'rgba(66, 38, 128, var(--tw-bg-opacity))'
        },
        'snow-white': {
          DEFAULT: 'var(--snow-white)',
          opacity: 'rgba(247, 249, 252, var(--tw-bg-opacity))'
        },
        'twilight-blue': {
          DEFAULT: 'var(--twilight-blue)',
          opacity: 'rgba(44, 82, 130, var(--tw-bg-opacity))'
        },
        'frost-blue': {
          DEFAULT: 'var(--frost-blue)',
          opacity: 'rgba(226, 232, 240, var(--tw-bg-opacity))'
        },
        'northern-pink': {
          DEFAULT: 'var(--northern-pink)',
          opacity: 'rgba(255, 97, 166, var(--tw-bg-opacity))'
        },
      },
      animation: {
        'float-up': 'floatUp 0.8s ease-out forwards',
        'glow': 'glowPulse 2s infinite',
        'aurora': 'auroraFlow 15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
