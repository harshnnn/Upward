import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useJournalEntries } from '../hooks';
import QuickEntry from '../components/QuickEntry';

export const JournalTimelineScreen: React.FC = () => {
  const { data, isLoading } = useJournalEntries({});

  if (isLoading) return <Text>Loading…</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <QuickEntry />
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 }}>Timeline</Text>
      {data?.map((e: any) => (
        <Text key={e.id} style={{ color: '#fff', marginTop: 8 }}>{`${new Date(e.timestamp).toLocaleTimeString()} — ${e.content}`}</Text>
      ))}
    </ScrollView>
  );
};

export default JournalTimelineScreen;
