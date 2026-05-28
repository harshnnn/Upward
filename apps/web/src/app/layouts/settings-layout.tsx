import type { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

import { Card, Container, Stack } from '@upward/ui';

export const SettingsLayout = ({ children }: PropsWithChildren) => {
  return (
    <Container size="md">
      <Stack gap={5}>
        <div>
          <h1 className="m-0 text-3xl font-semibold text-white">Settings</h1>
          <p className="mt-2 text-sm text-[var(--upward-text-muted)]">Manage your account, preferences, and app behavior.</p>
        </div>
        <Card>{children ?? <Outlet />}</Card>
      </Stack>
    </Container>
  );
};
