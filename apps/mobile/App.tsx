import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, theme } from '@upward/ui';

import { useAuthBootstrap } from './src/features/auth/hooks/use-auth-bootstrap';
import { useAuth } from './src/features/auth/hooks/use-auth';
import { ReactQueryProvider } from './src/providers/ReactQueryProvider';
import { RootNavigator } from './src/navigation/root-navigator';

const Root = () => {
  const status = useAuth((state) => state.status);
  useAuthBootstrap();

  return (
    <ThemeProvider value={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator authStatus={status} />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReactQueryProvider>
        <Root />
      </ReactQueryProvider>
    </GestureHandlerRootView>
  );
}
