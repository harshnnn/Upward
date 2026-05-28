import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from '@upward/ui';

export const DashboardScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Dashboard</Text>
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <Text>Welcome to the Dashboard — foundation only.</Text>
      </Card>
    </ScrollView>
  );
};

export default DashboardScreen;
