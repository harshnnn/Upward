import { Card, Stack, Badge, Input, Button } from '@upward/ui';

import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export const SettingsPage = () => {
  useDocumentTitle('Settings · Upward');

  return (
    <Stack gap={5}>
      <Card>
        <Stack gap={4}>
          <Badge tone="primary">Appearance</Badge>
          <Input placeholder="Theme preference" />
          <Button>Save changes</Button>
        </Stack>
      </Card>
    </Stack>
  );
};
