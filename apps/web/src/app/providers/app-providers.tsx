import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, theme } from '@upward/ui';

import { ErrorBoundary } from './error-boundary';
import { ToastProvider } from './toast-provider';
import { queryClient } from '@/shared/lib/query-client';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider value={theme}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ToastProvider>{children}</ToastProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
