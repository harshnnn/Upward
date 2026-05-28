import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider, persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 5, // 5 minutes
      refetchOnReconnect: true,
      refetchOnWindowFocus: false
    }
  }
});

const setupOnlineManager = () => {
  try {
    const NetInfo = require('@react-native-community/netinfo');
    onlineManager.setEventListener((setOnline) => {
      const unsubscribe = NetInfo.addEventListener((state: any) => {
        setOnline(Boolean(state.isConnected && state.isInternetReachable));
      });
      return () => unsubscribe();
    });
  } catch (e) {
    // NetInfo not installed; fall back to default
  }
};

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const persistorRef = useRef<any>(null);

  useEffect(() => {
    setupOnlineManager();

    const setupPersist = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const createAsyncStoragePersistor = require('@tanstack/react-query-persist-client').createAsyncStoragePersistor;
        const persistor = createAsyncStoragePersistor({ storage: AsyncStorage });
        persistorRef.current = persistor;
        persistQueryClient({ queryClient, persistor, maxAge: 1000 * 60 * 60 * 24 });
      } catch (e) {
        // Persist libs not installed; skip persistence
      }
    };

    void setupPersist();
  }, []);

  // Use PersistQueryClientProvider only if persistor available to avoid runtime errors
  if (persistorRef.current) {
    return (
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persistorRef.current }}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </PersistQueryClientProvider>
    );
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
