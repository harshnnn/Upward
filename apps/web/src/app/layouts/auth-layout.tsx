import type { PropsWithChildren } from 'react';

import { PageShell } from '@upward/ui';

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return <PageShell>{children}</PageShell>;
};
