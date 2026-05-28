import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTrackers, useCreateEntry } from '../hooks';
import TrackerCard from '../components/TrackerCard';

export const TrackingDashboardScreen: React.FC = () => {
  const { data, isLoading } = useTrackers(1);
  const createEntry = useCreateEntry();

  if (isLoading) return <Text>Loading…</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#fff' }}>Trackers</Text>
      <View>
        {data?.map((t: any) => (
          <TrackerCard key={t.id} name={t.name} type={t.type} onQuickAdd={() => createEntry.mutate({ trackerId: t.id, date: new Date().toISOString().slice(0, 10) })} />
        ))}
      </View>
    </ScrollView>
  );
};

export default TrackingDashboardScreen;
