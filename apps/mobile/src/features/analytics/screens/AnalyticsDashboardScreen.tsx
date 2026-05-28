import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useMobileDailySummary, useMobileHeatmap, useMobileStreaks, useMobileTrends } from '../hooks';
import Heatmap from '../components/Heatmap';
import ProgressChart from '../components/ProgressChart';

export const AnalyticsDashboardScreen: React.FC = () => {
  const { data: daily } = useMobileDailySummary();
  const { data: heat } = useMobileHeatmap();
  const { data: trends } = useMobileTrends('activity');
  const { data: streaks } = useMobileStreaks();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 20 }}>Analytics</Text>
      <Text style={{ color: '#fff', marginTop: 12 }}>Daily</Text>
      <Text style={{ color: '#fff' }}>{JSON.stringify(daily)}</Text>
      <Text style={{ color: '#fff', marginTop: 12 }}>Heatmap</Text>
      <Heatmap data={heat ?? []} />
      <Text style={{ color: '#fff', marginTop: 12 }}>Trends</Text>
      <ProgressChart series={trends ?? []} />
      <Text style={{ color: '#fff', marginTop: 12 }}>Streaks</Text>
      <Text style={{ color: '#fff' }}>{JSON.stringify(streaks)}</Text>
    </ScrollView>
  );
};

export default AnalyticsDashboardScreen;
