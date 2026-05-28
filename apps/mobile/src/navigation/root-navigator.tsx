import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './auth-navigator';
import { MainNavigator } from './main-navigator';

const RootStack = createNativeStackNavigator();

export const RootNavigator: React.FC<{ authStatus: string }> = ({ authStatus }) => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {authStatus === 'authenticated' ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
