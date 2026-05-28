import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../features/auth/hooks/use-auth';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Profile</Text>
      <Text style={{ marginBottom: 12 }}>{user?.email}</Text>
      <Button title="Log out" onPress={() => void logout()} />
    </View>
  );
};

export default ProfileScreen;
