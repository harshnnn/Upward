import React from 'react';
import { useDailySummary, useHeatmap, useTrends, useStreaks } from '../hooks';
import Heatmap from '../components/Heatmap';
import ProgressChart from '../components/ProgressChart';

export const AnalyticsDashboard: React.FC = () => {
  const { data: daily } = useDailySummary();
  const { data: heat } = useHeatmap();
  const { data: trends } = useTrends('activity');
  const { data: streaks } = useStreaks();

  return (
    <div style={{ padding: 16 }}>
      <h2>Analytics</h2>
      <section style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3>Daily Summary</h3>
          <pre style={{ background: '#111', padding: 8, color: '#fff' }}>{JSON.stringify(daily, null, 2)}</pre>
        </div>
        <div style={{ width: 320 }}>
          <h3>Streaks</h3>
          <pre style={{ background: '#111', padding: 8, color: '#fff' }}>{JSON.stringify(streaks, null, 2)}</pre>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Activity Heatmap</h3>
        <Heatmap data={heat ?? []} />
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Trends</h3>
        <ProgressChart series={trends ?? []} />
      </section>
    </div>
  );
};

export default AnalyticsDashboard;
