import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import NetInfo from '@react-native-community/netinfo';
import { apiClient } from '../../shared/lib/http-client';

type Op = {
  id: string;
  clientOpId?: string;
  path: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  attempts?: number;
  lastError?: string;
  createdAt: string;
};

const QUEUE_KEY = 'sync:operations:v1';

class SyncManager {
  private isProcessing = false;
  private listeners: Array<() => void> = [];

  async enqueue(path: string, method: Op['method'], body?: any, clientOpId?: string) {
    const op: Op = { id: uuid.v4() as string, clientOpId, path, method, body, attempts: 0, createdAt: new Date().toISOString() };
    const q = await this.readQueue();
    q.push(op);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    this.notify();
    this.tryProcess();
    return op.id;
  }

  private async readQueue(): Promise<Op[]> {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) as Op[] : [];
  }

  private async writeQueue(q: Op[]) { await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }

  private notify() { this.listeners.forEach(l => l()); }

  onChange(cb: () => void) { this.listeners.push(cb); return () => { this.listeners = this.listeners.filter(x => x !== cb); }; }

  async tryProcess() {
    if (this.isProcessing) return;
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;
    this.isProcessing = true;
    try {
      let q = await this.readQueue();
      const pending: Op[] = [];
      for (const op of q) {
        try {
          const headers: any = {};
          if (op.clientOpId) headers['x-client-op-id'] = op.clientOpId;
          const res = await apiClient.request({ url: op.path, method: op.method, data: op.body, headers });
          // success: skip
        } catch (e: any) {
          op.attempts = (op.attempts || 0) + 1;
          op.lastError = e?.message ?? String(e);
          // retry up to 5 times
          if ((op.attempts || 0) < 5) pending.push(op);
        }
      }
      await this.writeQueue(pending);
      this.notify();
    } finally {
      this.isProcessing = false;
    }
  }

  // start a connectivity listener to auto process when online
  start() {
    NetInfo.addEventListener(state => {
      if (state.isConnected) this.tryProcess();
    });
    // attempt on start
    this.tryProcess();
  }

  // diagnostic
  async status() { return await this.readQueue(); }
}

export const syncManager = new SyncManager();

export default SyncManager;
