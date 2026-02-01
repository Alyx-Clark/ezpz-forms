import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        glass: {
          ...require('daisyui/theme')['light'],
          'primary': '#6366f1',
          'primary-content': '#ffffff',
          'secondary': '#ec4899',
          'secondary-content': '#ffffff',
          'accent': '#0d9488',
          'accent-content': '#ffffff',
          'success': '#16a34a',
          'success-content': '#ffffff',
          'warning': '#d97706',
          'warning-content': '#ffffff',
          'error': '#dc2626',
          'error-content': '#ffffff',
          'base-100': 'transparent',
          'base-200': 'transparent',
          'base-300': 'rgba(255,255,255,0.25)',
          'base-content': '#1e293b',
        },
      },
    ],
  },
} satisfies Config
