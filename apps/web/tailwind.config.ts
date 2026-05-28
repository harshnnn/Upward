import type { Config } from 'tailwindcss';

import { breakpoints, colors, radius, spacing, typography } from '@upward/design-tokens';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        elevated: colors.backgroundElevated,
        raised: colors.backgroundRaised,
        surface: colors.surface,
        muted: colors.surfaceMuted,
        border: colors.border,
        text: colors.text,
        'text-muted': colors.textMuted,
        primary: colors.primary,
        semantic: colors.semantic,
        tracker: colors.tracker,
        mood: colors.mood
      },
      fontFamily: {
        sans: [typography.family.body],
        mono: [typography.family.mono],
        display: [typography.family.display]
      },
      spacing,
      borderRadius: radius,
      screens: {
        sm: `${breakpoints.sm}px`,
        md: `${breakpoints.md}px`,
        lg: `${breakpoints.lg}px`,
        xl: `${breakpoints.xl}px`,
        '2xl': `${breakpoints['2xl']}px`
      }
    }
  },
  plugins: []
} satisfies Config;
