import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/shared/lib/cn';

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  settings: 'Settings',
  profile: 'Profile'
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[var(--upward-text-muted)]">
      <Link className={cn('hover:text-white')} to="/dashboard">
        Home
      </Link>
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? <span className="text-white">{labelMap[segment] ?? segment}</span> : <Link to={path}>{labelMap[segment] ?? segment}</Link>}
          </span>
        );
      })}
    </nav>
  );
};
