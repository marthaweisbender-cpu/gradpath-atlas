import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import type { DocumentStatus, ProgrammeStatus } from '../data/types';
import type { Risk } from '../lib/dates';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-strong',
  secondary: 'bg-white text-ink border border-line hover:bg-surface',
  ghost: 'text-accent hover:bg-accent-soft',
  danger: 'bg-white text-danger border border-danger/30 hover:bg-danger-soft',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'h-8 px-3 text-sm' : 'h-10 px-4 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx('min-w-0 rounded-lg border border-line bg-white', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  id,
  error,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(
          'h-10 w-full rounded-md border bg-white px-3 text-sm',
          error ? 'border-danger' : 'border-line',
        )}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: 'neutral' | 'accent' | 'ok' | 'warn' | 'danger';
  children: ReactNode;
}) {
  const tones = {
    neutral: 'bg-surface text-muted border-line',
    accent: 'bg-accent-soft text-accent-strong border-accent/20',
    ok: 'bg-ok-soft text-ok border-ok/20',
    warn: 'bg-warn-soft text-warn border-warn/20',
    danger: 'bg-danger-soft text-danger border-danger/20',
  };
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<ProgrammeStatus, 'neutral' | 'accent' | 'ok' | 'warn' | 'danger'> = {
  researching: 'neutral',
  shortlisted: 'accent',
  applying: 'warn',
  submitted: 'ok',
  offer: 'ok',
  rejected: 'danger',
  dropped: 'neutral',
};

export const StatusBadge = ({ status }: { status: ProgrammeStatus }) => (
  <Badge tone={statusTone[status]}>{status}</Badge>
);

const docTone: Record<DocumentStatus, 'ok' | 'warn' | 'danger'> = {
  ready: 'ok',
  draft: 'warn',
  missing: 'danger',
};
export const DocBadge = ({ status }: { status: DocumentStatus }) => (
  <Badge tone={docTone[status]}>{status}</Badge>
);

const riskTone: Record<Risk, 'ok' | 'warn' | 'danger'> = {
  ok: 'ok',
  soon: 'warn',
  overdue: 'danger',
};
export const RiskBadge = ({ risk, days }: { risk: Risk; days: number }) => (
  <Badge tone={riskTone[risk]}>
    {risk === 'overdue' ? `${Math.abs(days)} d overdue` : days === 0 ? 'today' : `in ${days} d`}
  </Badge>
);

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
      <p className="font-medium">{title}</p>
      {body && <p className="mt-1 text-sm text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Banner({
  tone = 'warn',
  children,
}: {
  tone?: 'warn' | 'accent';
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      className={cx(
        'mb-4 rounded-md border px-4 py-2 text-sm',
        tone === 'warn'
          ? 'border-warn/30 bg-warn-soft text-warn'
          : 'border-accent/30 bg-accent-soft text-accent-strong',
      )}
    >
      {children}
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-full max-w-lg rounded-lg border border-line bg-white p-0 shadow-xl backdrop:bg-ink/40"
    >
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
          ✕
        </Button>
      </header>
      <div className="p-5">{children}</div>
    </dialog>
  );
}

export function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-xs tabular-nums text-muted">{pct}%</span>
    </div>
  );
}

export const Th = ({
  children,
  className,
  ariaSort,
}: {
  children?: ReactNode;
  className?: string;
  ariaSort?: 'ascending' | 'descending' | 'none';
}) => (
  <th
    scope="col"
    aria-sort={ariaSort}
    className={cx(
      'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted',
      className,
    )}
  >
    {children}
  </th>
);
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <td className={cx('px-3 py-2.5 align-top text-sm', className)}>{children}</td>
);
