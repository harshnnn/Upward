import type { PropsWithChildren } from 'react';

import { colors, spacing } from '@upward/design-tokens';

const PageShell = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: spacing[6],
        background:
          `radial-gradient(circle at top left, rgba(63, 109, 246, 0.12), transparent 34%), radial-gradient(circle at top right, rgba(167, 139, 250, 0.08), transparent 28%), ${colors.background}`,
        color: colors.text
      }}
    >
      <div style={{ maxWidth: 480, margin: '0 auto' }}>{children}</div>
    </div>
  );
};

export default PageShell;
