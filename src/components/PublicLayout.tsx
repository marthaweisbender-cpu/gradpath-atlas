import { Link, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Logo } from './AppShell';
import { Button } from './ui';

export default function PublicLayout() {
  const authed = useAppStore((s) => s.currentUserId !== null);
  return (
    <div className="min-h-screen bg-surface">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 font-display">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Logo /> GradPath Atlas
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/pricing" className="px-3 py-2 text-muted hover:text-ink">
            Pricing
          </Link>
          {authed ? (
            <Link to="/app">
              <Button size="sm">Open workspace</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-muted hover:text-ink">
                Sign in
              </Link>
              <Link to="/signup">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <Outlet />
      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-muted">
        GradPath Atlas is a demo built for a university assignment. All universities, programmes and
        people shown are fictional.
      </footer>
    </div>
  );
}
