import { NavLink } from 'react-router-dom';

import { cn } from '@/shared/lib/cn';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/settings', label: 'Settings' },
  { to: '/profile', label: 'Profile' }
];

export const Sidebar = () => {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[var(--upward-border)] bg-[rgba(15,23,39,0.82)] px-4 py-6 backdrop-blur-xl lg:block">
      <div className="mb-8 px-2">
        <div className="text-xs uppercase tracking-[0.28em] text-[var(--upward-text-muted)]">Upward</div>
        <div className="mt-2 text-2xl font-semibold text-white">Life OS</div>
      </div>
      <nav className="grid gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'rounded-2xl px-4 py-3 text-sm transition',
                isActive
                  ? 'bg-[var(--upward-surface-muted)] text-white shadow-lg'
                  : 'text-[var(--upward-text-muted)] hover:bg-white/5 hover:text-white'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
