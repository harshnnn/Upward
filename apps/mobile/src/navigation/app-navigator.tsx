import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';

import { useAuth } from '../features/auth/hooks/use-auth';

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Upward</Text>
      <Text style={{ marginTop: 12 }}>{user?.email}</Text>
      <Button title="Log out" onPress={() => void logout()} />
    </View>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
