import type { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import { Card, Container, Stack } from '@upward/ui';

import { CommandPalette } from '../navigation/command-palette';
import { MobileNav } from '../navigation/mobile-nav';
import { Sidebar } from '../navigation/sidebar';
import { Topbar } from '../navigation/topbar';
import { useUiStore } from '../state/ui-store';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const toggleCommandPalette = useUiStore((state) => state.toggleCommandPalette);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  return (
    <div className="min-h-screen bg-[var(--upward-bg)] text-white lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 pb-24 lg:pb-0">
        <Topbar />
        <Container size="xl">
          <Stack gap={6}>
            {children ?? <Outlet />}
          </Stack>
        </Container>
      </main>
      <MobileNav />
      <CommandPalette />
    </div>
  );
};
