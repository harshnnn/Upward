import type { HTMLAttributes } from 'react';

import { colors, radius } from '@upward/design-tokens';

const Skeleton = ({ style, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      style={{
        background: `linear-gradient(90deg, ${colors.surfaceMuted} 25%, ${colors.surface} 37%, ${colors.surfaceMuted} 63%)`,
        backgroundSize: '400% 100%',
        animation: 'upward-skeleton 1.4s ease-in-out infinite',
        borderRadius: radius.md,
        ...style
      }}
    />
  );
};

export default Skeleton;