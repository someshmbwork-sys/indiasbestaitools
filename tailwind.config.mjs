/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1B3A',
        'ink-soft': '#3a3a5e',
        bg: '#FFF7ED',
        'bg-2': '#FFEFD5',
        pink: '#FF3D7F',
        blue: '#3B6EFF',
        yellow: '#FFD93D',
        mint: '#00D4A0',
        orange: '#FF7A1A',
        lilac: '#B377FF',
        red: '#E74C3C',
        // legacy aliases
        cream: '#FFF7ED',
        saffron: '#FF3D7F',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'pop-sm': '4px 4px 0 #1B1B3A',
        'pop': '6px 6px 0 #1B1B3A',
        'pop-lg': '10px 10px 0 #1B1B3A',
        'pop-pink': '6px 6px 0 #FF3D7F',
        'pop-yellow': '6px 6px 0 #FFD93D',
        'pop-blue': '6px 6px 0 #3B6EFF',
      },
    },
  },
  plugins: [],
};
