import type { HTMLAttributes, PropsWithChildren } from 'react';

import { colors, radius, spacing } from '@upward/design-tokens';

export type BadgeProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement>> & {
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'primary';
};

const tones = {
  neutral: { background: colors.surfaceMuted, color: colors.text },
  success: { background: 'rgba(34, 197, 94, 0.16)', color: '#86efac' },
  warning: { background: 'rgba(245, 158, 11, 0.16)', color: '#fbbf24' },
  error: { background: 'rgba(239, 68, 68, 0.16)', color: '#fca5a5' },
  primary: { background: 'rgba(63, 109, 246, 0.16)', color: '#bfdbfe' }
} as const;

const Badge = ({ children, tone = 'neutral', style, ...props }: BadgeProps) => {
  return (
    <span
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: radius.full,
        padding: `${spacing[1]}px ${spacing[3]}px`,
        fontSize: 12,
        fontWeight: 600,
        border: `1px solid ${colors.borderStrong}`,
        ...tones[tone],
        ...style
      }}
    >
      {children}
    </span>
  );
};

export default Badge;