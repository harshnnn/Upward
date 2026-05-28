import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useMobileCreateSession } from '../hooks';

export const QuickWorkout: React.FC = () => {
  const [name, setName] = useState('');
  const create = useMobileCreateSession();

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>Quick Start</Text>
      <TextInput placeholder="Workout name" placeholderTextColor="#888" value={name} onChangeText={setName} style={{ backgroundColor: '#111', color: '#fff', padding: 8, borderRadius: 8, marginTop: 8 }} />
      <Button title="Start" onPress={() => create.mutate({ name })} />
    </View>
  );
};

export default QuickWorkout;
