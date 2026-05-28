import { Card, Stack, Badge } from '@upward/ui';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export const ProfilePage = () => {
  const { user } = useAuth();
  useDocumentTitle('Profile · Upward');

  return (
    <Stack gap={5}>
      <Card>
        <Stack gap={3}>
          <Badge tone="neutral">Profile</Badge>
          <h1 className="m-0 text-2xl font-semibold text-white">{user?.displayName ?? 'Your profile'}</h1>
          <p className="m-0 text-sm text-[var(--upward-text-muted)]">{user?.email}</p>
        </Stack>
      </Card>
    </Stack>
  );
};
