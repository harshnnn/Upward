import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY = 'user:preferences:v1';

export function usePreferences() {
  const [prefs, setPrefs] = useState<any>({ theme: 'system', notificationsEnabled: true });
  useEffect(() => { (async () => { const raw = await AsyncStorage.getItem(KEY); if (raw) setPrefs(JSON.parse(raw)); })(); }, []);
  const save = async (patch: any) => { const next = { ...prefs, ...patch }; setPrefs(next); await AsyncStorage.setItem(KEY, JSON.stringify(next)); };
  return { prefs, save };
}

export default usePreferences;
