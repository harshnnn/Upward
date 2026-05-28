import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from '@upward/ui';

export const SettingsScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Settings</Text>
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <Text>Settings foundation — toggles, preferences, privacy.</Text>
      </Card>
    </ScrollView>
  );
};

export default SettingsScreen;
