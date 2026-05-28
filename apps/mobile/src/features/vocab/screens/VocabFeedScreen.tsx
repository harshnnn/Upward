import React from 'react';
import { ScrollView, Text } from 'react-native';
import QuickAddWord from '../components/QuickAddWord';
import { useMobileVocabList } from '../hooks';

export const VocabFeedScreen: React.FC = () => {
  const { data } = useMobileVocabList();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <QuickAddWord />
      <Text style={{ color: '#fff', fontSize: 18, marginTop: 12 }}>Your words</Text>
      {data?.map((w: any) => (
        <Text key={w.id} style={{ color: '#fff', marginTop: 8 }}>{w.word}</Text>
      ))}
    </ScrollView>
  );
};

export default VocabFeedScreen;
