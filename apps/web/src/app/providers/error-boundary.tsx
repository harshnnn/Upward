import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';

import { Card, Stack } from '@upward/ui';

import { getApiErrorMessage } from '@/shared/lib/api-error';

type Props = PropsWithChildren<{
  fallback?: ReactNode;
}>;

type State = {
  hasError: boolean;
  message: string | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: null
  };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: getApiErrorMessage(error)
    };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('App error boundary caught an error', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
          <Card style={{ maxWidth: 520, width: '100%' }}>
            <Stack gap={3}>
              <h1 style={{ margin: 0 }}>Something went wrong</h1>
              <p style={{ margin: 0, color: 'var(--upward-text-muted, #a4b0c3)' }}>{this.state.message}</p>
            </Stack>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
