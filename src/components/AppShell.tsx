import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../store/useAppStore';
import { Banner, Button } from './ui';

const nav = [
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/compare', label: 'Compare' },
  { to: '/app/tasks', label: 'Tasks' },
  { to: '/app/documents', label: 'Documents' },
  { to: '/app/deadlines', label: 'Deadlines' },
  { to: '/app/adviser', label: 'Adviser review' },
  { to: '/app/settings', label: 'Settings' },
];

export default function AppShell() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-white lg:border-r lg:border-b-0">
        <div className="flex items-center gap-2 px-5 py-4">
          <Logo />
          <span className="font-semibold">GradPath Atlas</span>
        </div>
        <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm whitespace-nowrap ${isActive ? 'bg-accent-soft font-medium text-accent-strong' : 'text-muted hover:bg-surface hover:text-ink'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line bg-white px-6">
          <span className="hidden text-sm text-muted sm:inline">Application season 2026/27</span>
          <div className="flex items-center gap-3 text-sm">
            <span>{user?.name}</span>
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
              {user?.plan} plan
            </span>
            <Button variant="secondary" size="sm" onClick={() => navigate('/signout')}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">
          {user?.plan !== 'free' && (
            <Banner tone="accent">
              Test mode: your {user?.plan} plan was activated without payment.
            </Banner>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="#1f6f78" />
    <path
      d="M8 20l8-9 8 9M12 20h8"
      stroke="#fff"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
