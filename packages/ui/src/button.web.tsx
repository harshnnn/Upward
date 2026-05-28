import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import { colors, radius, spacing } from '@upward/design-tokens';

export type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const sizeStyles = {
  sm: { padding: `${spacing[2]}px ${spacing[3]}px`, minHeight: 36 },
  md: { padding: `${spacing[3]}px ${spacing[4]}px`, minHeight: 44 },
  lg: { padding: `${spacing[4]}px ${spacing[5]}px`, minHeight: 52 }
} as const;

const variantStyles = {
  primary: {
    background: colors.primary[500],
    color: colors.text
  },
  secondary: {
    background: colors.surfaceMuted,
    color: colors.text
  },
  ghost: {
    background: 'transparent',
    color: colors.text
  }
} as const;

const Button = ({ children, variant = 'primary', size = 'md', style, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      style={{
        border: `1px solid ${colors.borderStrong}`,
        borderRadius: radius.md,
        fontWeight: 600,
        width: '100%',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
};

export default Button;