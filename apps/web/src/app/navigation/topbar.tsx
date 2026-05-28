import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCommandPalette } from '@/shared/hooks/use-command-palette';
import { webEnv } from '@/shared/config/env';

import { Breadcrumbs } from './breadcrumbs';

export const Topbar = () => {
  const { user } = useAuth();
  const { openPalette } = useCommandPalette();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--upward-border)] bg-[rgba(10,15,26,0.72)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="min-w-0">
          <Breadcrumbs />
          <div className="mt-1 text-sm text-[var(--upward-text-muted)]">
            Welcome back, <span className="text-white">{user?.displayName ?? user?.email ?? webEnv.VITE_APP_NAME}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={openPalette}
          className="rounded-full border border-[var(--upward-border)] bg-[var(--upward-surface)] px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-[var(--upward-surface-muted)]"
        >
          Command K
        </button>
      </div>
    </header>
  );
};
