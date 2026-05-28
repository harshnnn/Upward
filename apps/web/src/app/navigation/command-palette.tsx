import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCommandPalette } from '@/shared/hooks/use-command-palette';

const commands = [
  { label: 'Open dashboard', to: '/dashboard' },
  { label: 'Open settings', to: '/settings' },
  { label: 'Open profile', to: '/profile' }
];

export const CommandPalette = () => {
  const { open, closePalette } = useCommandPalette();
  const [query, setQuery] = useState('');

  const filteredCommands = useMemo(
    () => commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" role="presentation" onClick={closePalette}>
      <div className="mx-auto mt-24 w-[min(640px,calc(100vw-32px))] rounded-[24px] border border-[var(--upward-border)] bg-[var(--upward-surface)] p-4 shadow-2xl" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search commands or jump to a route..."
          className="w-full rounded-2xl border border-[var(--upward-border)] bg-[var(--upward-bg)] px-4 py-3 text-white outline-none"
        />
        <div className="mt-4 grid gap-2">
          {filteredCommands.length ? (
            filteredCommands.map((command) => (
              <Link key={command.to} to={command.to} onClick={closePalette} className="rounded-2xl px-4 py-3 text-sm text-[var(--upward-text-muted)] hover:bg-white/5 hover:text-white">
                {command.label}
              </Link>
            ))
          ) : (
            <div className="rounded-2xl px-4 py-6 text-center text-sm text-[var(--upward-text-muted)]">No matching commands.</div>
          )}
        </div>
      </div>
    </div>
  );
};
