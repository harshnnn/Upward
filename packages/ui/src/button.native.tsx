import type { PropsWithChildren } from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';

import { colors, radius, spacing } from '@upward/design-tokens';

export type ButtonProps = PropsWithChildren<PressableProps> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const sizeStyles = {
  sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[3], minHeight: 36 },
  md: { paddingVertical: spacing[3], paddingHorizontal: spacing[4], minHeight: 44 },
  lg: { paddingVertical: spacing[4], paddingHorizontal: spacing[5], minHeight: 52 }
} as const;

const variantStyles = {
  primary: {
    backgroundColor: colors.primary[500],
    borderColor: colors.borderStrong
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  }
} as const;

const Button = ({ children, variant = 'primary', size = 'md', style, ...props }: ButtonProps) => {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          width: '100%',
          borderWidth: 1,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing[2],
          opacity: pressed ? 0.88 : 1,
          ...sizeStyles[size],
          ...variantStyles[variant]
        },
        style as object
      ]}
    >
      <Text style={{ color: colors.text, fontWeight: '600' }}>{children as string}</Text>
    </Pressable>
  );
};

export default Button;