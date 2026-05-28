import { Card, Container, EmptyState, Stack, Badge } from '@upward/ui';

import { useDocumentTitle } from '@/shared/hooks/use-document-title';

const metrics = [
  { label: 'Today', value: '12', tone: 'primary' as const },
  { label: 'Streak', value: '18', tone: 'success' as const },
  { label: 'Workouts', value: '4', tone: 'warning' as const },
  { label: 'Mood', value: '8.4/10', tone: 'neutral' as const }
];

export const DashboardHomePage = () => {
  useDocumentTitle('Upward Dashboard');

  return (
    <Container size="xl">
      <Stack gap={6}>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} glass>
              <Stack gap={2}>
                <Badge tone={metric.tone}>{metric.label}</Badge>
                <div className="text-3xl font-semibold tracking-tight text-white">{metric.value}</div>
              </Stack>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
          <Card>
            <Stack gap={3}>
              <h2 className="m-0 text-xl font-semibold text-white">Today&apos;s overview</h2>
              <EmptyState
                title="No activity captured yet"
                description="This foundation is ready for habits, workouts, nutrition, and timeline components once those modules land."
              />
            </Stack>
          </Card>
          <Card>
            <Stack gap={3}>
              <h2 className="m-0 text-xl font-semibold text-white">Recent activity</h2>
              <EmptyState title="Nothing to review yet" description="Recent events, summaries, and chart data will appear here." />
            </Stack>
          </Card>
        </section>
      </Stack>
    </Container>
  );
};
