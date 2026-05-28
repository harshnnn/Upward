import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useMobileCreateWord } from '../hooks';

export const QuickAddWord: React.FC = () => {
  const [text, setText] = useState('');
  const create = useMobileCreateWord();

  return (
    <View style={{ padding: 8 }}>
      <TextInput placeholder="Add word" placeholderTextColor="#888" value={text} onChangeText={setText} style={{ backgroundColor: '#111', color: '#fff', padding: 8, borderRadius: 8 }} />
      <Button title="Add" onPress={() => { create.mutate({ word: text }); setText(''); }} />
    </View>
  );
};

export default QuickAddWord;
