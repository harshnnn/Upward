import React from 'react';
import { View, Text, Pressable } from 'react-native';

export const TrackerCard: React.FC<{ name: string; type: string; onQuickAdd?: () => void }> = ({ name, type, onQuickAdd }) => {
  return (
    <Pressable onPress={onQuickAdd} style={{ padding: 12, backgroundColor: '#0b0b0b', borderRadius: 8, marginBottom: 12 }}>
      <View>
        <Text style={{ fontWeight: '700', color: '#fff' }}>{name}</Text>
        <Text style={{ color: '#999' }}>{type}</Text>
      </View>
    </Pressable>
  );
};

export default TrackerCard;
