import { useEffect, useState } from 'react';
import { syncManager } from './SyncManager';

export function useSyncQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;
    const load = async () => setQueue(await syncManager.status());
    load();
    const unsub = syncManager.onChange(() => { if (mounted) syncManager.status().then(setQueue); });
    syncManager.start();
    return () => { mounted = false; unsub(); };
  }, []);
  return { queue, enqueue: (p: string, m: any, b?: any, clientOpId?: string) => syncManager.enqueue(p, m, b, clientOpId), refresh: () => syncManager.status() };
}

export default useSyncQueue;
