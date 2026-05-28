import type { HTMLAttributes, PropsWithChildren } from 'react';

import { colors, radius, spacing, elevation } from '@upward/design-tokens';

export type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  glass?: boolean;
};

const Card = ({ children, glass = false, style, ...props }: CardProps) => {
  return (
    <div
      {...props}
      style={{
        background: glass ? colors.surfaceGlass : colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: elevation.surface2,
        padding: spacing[5],
        backdropFilter: glass ? 'blur(18px)' : undefined,
        WebkitBackdropFilter: glass ? 'blur(18px)' : undefined,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Card;