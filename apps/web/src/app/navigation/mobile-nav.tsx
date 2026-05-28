import { NavLink } from 'react-router-dom';

import { cn } from '@/shared/lib/cn';

const items = [
  { to: '/dashboard', label: 'Home' },
  { to: '/settings', label: 'Settings' },
  { to: '/profile', label: 'Profile' }
];

export const MobileNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--upward-border)] bg-[rgba(10,15,26,0.96)] px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'rounded-2xl px-3 py-3 text-center text-xs transition',
                isActive ? 'bg-white/10 text-white' : 'text-[var(--upward-text-muted)]'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
