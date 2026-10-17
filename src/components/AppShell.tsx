import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../store/useAppStore';
import { Banner, Button, Waves } from './ui';

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
  const initials = (user?.name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="relative overflow-hidden bg-indigo text-accent-soft">
        <Waves
          light
          className="pointer-events-none absolute -bottom-2 -left-5 hidden h-24 w-72 opacity-25 lg:block"
        />
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Logo />
          <span className="font-display font-bold text-card">GradPath Atlas</span>
        </div>
        <nav
          aria-label="Main"
          className="flex gap-1 overflow-x-auto px-3.5 pb-3 lg:flex-col lg:pb-0"
        >
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded-[10px] px-3 py-2.5 text-[15px] whitespace-nowrap transition ${
                  isActive
                    ? 'bg-card/15 font-semibold text-card'
                    : 'hover:bg-card/10 hover:text-card'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="flex h-[60px] items-center justify-between border-b border-line bg-card/80 px-6 backdrop-blur">
          <span className="hidden text-sm text-muted sm:inline">Application season 2026/27</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-indigo">
              {user?.plan === 'season'
                ? 'Application Pass'
                : user?.plan === 'adviser'
                  ? 'Adviser licence'
                  : 'Free plan'}
            </span>
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-dusty text-[13px] font-bold text-card"
            >
              {initials}
            </span>
            <Button variant="secondary" size="sm" onClick={() => navigate('/signout')}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 px-6 py-7">
          {user?.plan !== 'free' && (
            <Banner tone="accent">
              Test mode: your {user?.plan === 'season' ? 'Application Pass' : 'Adviser licence'} was
              activated without payment.
            </Banner>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export const Logo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <rect width="48" height="48" rx="12" fill="#fbf8f2" />
    <path d="M8 34a16 16 0 0 1 32 0" fill="none" stroke="#2e63ad" strokeWidth="3" />
    <path d="M14 34a10 10 0 0 1 20 0" fill="none" stroke="#7d9ac4" strokeWidth="3" />
    <path
      d="M24 34V22m0 0l-5 5m5-5l5 5"
      fill="none"
      stroke="#1f3f7c"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
