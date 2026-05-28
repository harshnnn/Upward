import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useCreateJournalEntry } from '../hooks';

export const QuickEntry: React.FC = () => {
  const [text, setText] = useState('');
  const create = useCreateJournalEntry();

  return (
    <View style={{ flexDirection: 'row', padding: 8 }}>
      <TextInput value={text} onChangeText={setText} placeholder="Quick note…" style={{ flex: 1, backgroundColor: '#111', color: '#fff', padding: 8, borderRadius: 8 }} />
      <Button title="Add" onPress={() => { create.mutate({ timestamp: new Date().toISOString(), content: text }); setText(''); }} />
    </View>
  );
};

export default QuickEntry;
