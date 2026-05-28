import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import QuickWorkout from '../components/QuickWorkout';

export const WorkoutLoggerScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <QuickWorkout />
      <Text style={{ color: '#fff', fontSize: 18, marginTop: 12 }}>Live logger and sets will appear here.</Text>
    </ScrollView>
  );
};

export default WorkoutLoggerScreen;
