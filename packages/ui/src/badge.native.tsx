import type { PropsWithChildren } from 'react';
import { Text, type TextProps } from 'react-native';

import { colors, radius, spacing } from '@upward/design-tokens';

export type BadgeProps = PropsWithChildren<TextProps> & {
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'primary';
};

const tones = {
  neutral: { backgroundColor: colors.surfaceMuted, color: colors.text },
  success: { backgroundColor: 'rgba(34, 197, 94, 0.16)', color: '#86efac' },
  warning: { backgroundColor: 'rgba(245, 158, 11, 0.16)', color: '#fbbf24' },
  error: { backgroundColor: 'rgba(239, 68, 68, 0.16)', color: '#fca5a5' },
  primary: { backgroundColor: 'rgba(63, 109, 246, 0.16)', color: '#bfdbfe' }
} as const;

const Badge = ({ children, tone = 'neutral', style, ...props }: BadgeProps) => {
  return (
    <Text
      {...props}
      style={[
        {
          alignSelf: 'flex-start',
          borderRadius: radius.full,
          paddingVertical: spacing[1],
          paddingHorizontal: spacing[3],
          fontSize: 12,
          fontWeight: '600',
          borderWidth: 1,
          borderColor: colors.borderStrong,
          ...tones[tone]
        },
        style as object
      ]}
    >
      {children}
    </Text>
  );
};

export default Badge;