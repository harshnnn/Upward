import { useEffect, useState } from 'react';

export const useNetwork = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let unsubscribe: any;
    try {
      const NetInfo = require('@react-native-community/netinfo');
      unsubscribe = NetInfo.addEventListener((state: any) => {
        setIsConnected(Boolean(state.isConnected && state.isInternetReachable));
      });
    } catch (e) {
      setIsConnected(true);
    }

    return () => unsubscribe && unsubscribe();
  }, []);

  return { isConnected };
};

export default useNetwork;
