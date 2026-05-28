import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { Badge, Button, Card, Stack } from '@upward/ui';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'error';

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
};

type Toast = ToastInput & { id: string };

type ToastContextValue = {
  pushToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return value;
};

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      pushToast: (toast) => {
        const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setToasts((current) => [{ ...toast, id }, ...current].slice(0, 3));
      },
      dismissToast: (id) => setToasts((current) => current.filter((toast) => toast.id !== id))
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 12, zIndex: 80 }}>
        {toasts.map((toast) => (
          <Card key={toast.id} style={{ width: 320 }}>
            <Stack gap={2}>
              <Stack direction="row" align="center" justify="between" gap={2}>
                <strong>{toast.title}</strong>
                <Badge tone={toast.tone ?? 'neutral'}>{toast.tone ?? 'neutral'}</Badge>
              </Stack>
              {toast.description ? <p style={{ margin: 0, color: 'var(--upward-text-muted, #a4b0c3)' }}>{toast.description}</p> : null}
              <Button variant="secondary" onClick={() => value.dismissToast(toast.id)}>
                Dismiss
              </Button>
            </Stack>
          </Card>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
