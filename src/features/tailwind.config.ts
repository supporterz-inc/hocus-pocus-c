import type { Config } from 'tailwindcss';

export default {
  content: ['./target/**/*.js'],
  theme: {
    extend: {
      colors: {
        base: '#f3f4f6',
        main: '#ffffff',
        accent: '#a3e635',
        'text-main': '#111827',
        'text-sub': '#6b7280',
        border: '#e5e7eb',
      },
      maxWidth: {
        mobile: '375px',
      },
    },
    fontFamily: {
      sans: ['system-ui', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
