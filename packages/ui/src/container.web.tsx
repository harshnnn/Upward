import type { HTMLAttributes, PropsWithChildren } from 'react';

import { spacing } from '@upward/design-tokens';

export type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const maxWidths = { sm: 960, md: 1120, lg: 1280, xl: 1440 } as const;

const Container = ({ children, size = 'lg', style, ...props }: ContainerProps) => {
  return (
    <div
      {...props}
      style={{
        width: '100%',
        maxWidth: maxWidths[size],
        margin: '0 auto',
        paddingLeft: spacing[4],
        paddingRight: spacing[4],
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Container;