import type { Config } from 'tailwindcss';

export default {
  content: ['./target/**/*.js'],
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
