import type { HTMLAttributes, PropsWithChildren } from 'react';

import { colors, radius, spacing, typography } from '@upward/design-tokens';

export type EmptyStateProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  title: string;
  description?: string;
};

const EmptyState = ({ title, description, children, style, ...props }: EmptyStateProps) => {
  return (
    <div
      {...props}
      style={{
        border: `1px dashed ${colors.borderStrong}`, 
        borderRadius: radius.lg,
        padding: spacing[6],
        textAlign: 'center',
        color: colors.textMuted,
        ...style
      }}
    >
      <div style={{ fontSize: typography.size.lg, color: colors.text, fontWeight: typography.weight.semibold }}>{title}</div>
      {description ? <div style={{ marginTop: spacing[2] }}>{description}</div> : null}
      {children ? <div style={{ marginTop: spacing[4] }}>{children}</div> : null}
    </div>
  );
};

export default EmptyState;