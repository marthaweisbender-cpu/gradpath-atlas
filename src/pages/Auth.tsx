import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Field } from '../components/ui';
import { useAppStore } from '../store/useAppStore';

function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
      <div className="rounded-lg border border-line bg-white p-6">{children}</div>
    </div>
  );
}

export function SignUp() {
  const signUp = useAppStore((s) => s.signUp);
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', consent: false });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.consent) return setError('Please acknowledge the data notice.');
    setBusy(true);
    const r = await signUp(f.name, f.email, f.password);
    setBusy(false);
    if (!r.ok) return setError(r.error ?? 'Sign-up failed.');
    navigate('/app');
  };

  return (
    <AuthCard title="Create your account">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field
          label="Full name"
          id="su-name"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
          autoComplete="name"
        />
        <Field
          label="Email"
          id="su-email"
          type="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          autoComplete="email"
        />
        <Field
          label="Password"
          id="su-password"
          type="password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          hint="At least 8 characters"
          autoComplete="new-password"
        />
        <label className="flex items-start gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={f.consent}
            onChange={(e) => setF({ ...f, consent: e.target.checked })}
            className="mt-0.5"
          />
          <span>
            <strong>Personal Information Collection Statement.</strong> This demo stores your name,
            email and plan only in this browser. Nothing is sent to a server. You can erase
            everything in Settings.
          </span>
        </label>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </Button>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-strong hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export function Login() {
  const signIn = useAppStore((s) => s.signIn);
  const navigate = useNavigate();
  const location = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const r = await signIn(f.email, f.password);
    if (!r.ok) return setError(r.error ?? 'Sign-in failed.');
    navigate((location.state as { from?: string } | null)?.from ?? '/app');
  };

  return (
    <AuthCard title="Sign in">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field
          label="Email"
          id="li-email"
          type="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          autoComplete="email"
        />
        <Field
          label="Password"
          id="li-password"
          type="password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          autoComplete="current-password"
        />
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <p className="flex justify-between text-sm text-muted">
          <Link to="/reset" className="text-accent-strong hover:underline">
            Forgot password?
          </Link>
          <Link to="/signup" className="text-accent-strong hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export function Reset() {
  const resetPassword = useAppStore((s) => s.resetPassword);
  const [f, setF] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const r = await resetPassword(f.email, f.password);
    setMsg(
      r.ok
        ? { ok: true, text: 'Password updated. You can sign in now.' }
        : { ok: false, text: r.error ?? 'Reset failed.' },
    );
  };

  return (
    <AuthCard title="Reset password">
      <p className="mb-4 text-sm text-muted">
        Demo mode: no email is sent. Enter your account email and a new password.
      </p>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field
          label="Email"
          id="rs-email"
          type="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <Field
          label="New password"
          id="rs-password"
          type="password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          hint="At least 8 characters"
        />
        {msg && (
          <p role="alert" className={`text-sm ${msg.ok ? 'text-ok' : 'text-danger'}`}>
            {msg.text}
          </p>
        )}
        <Button type="submit" className="w-full">
          Update password
        </Button>
        <p className="text-center text-sm">
          <Link to="/login" className="text-accent-strong hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

/** Public route: clears the session outside the guarded tree, then returns to the landing page. */
export function SignOut() {
  const signOut = useAppStore((s) => s.signOut);
  const navigate = useNavigate();
  useEffect(() => {
    signOut();
    navigate('/', { replace: true });
  }, [signOut, navigate]);
  return null;
}
