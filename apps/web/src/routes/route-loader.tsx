import { Skeleton, Stack, Card } from '@upward/ui';

export const RouteLoader = () => {
  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <Card style={{ width: 'min(520px, 100%)' }}>
        <Stack gap={4}>
          <Skeleton style={{ height: 28, width: '45%' }} />
          <Skeleton style={{ height: 14, width: '80%' }} />
          <Skeleton style={{ height: 14, width: '65%' }} />
        </Stack>
      </Card>
    </div>
  );
};
