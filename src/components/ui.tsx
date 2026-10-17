import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import type { DocumentStatus, ProgrammeStatus } from '../data/types';
import { cx } from '../lib/cx';
import type { Risk } from '../lib/dates';

type Variant = 'primary' | 'secondary' | 'tinted' | 'ghost' | 'danger';
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-card hover:bg-accent-strong active:scale-[0.98]',
  secondary: 'bg-card text-indigo border border-dusty/40 hover:bg-accent-soft/50',
  tinted: 'bg-accent-soft text-indigo hover:bg-dusty/40',
  ghost: 'text-accent hover:bg-accent-soft',
  danger: 'bg-card text-danger border border-danger/30 hover:bg-danger-soft',
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
        'inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm'
          ? 'h-9 rounded-[10px] px-3.5 text-[13px]'
          : 'h-11 rounded-control px-5 text-[15px]',
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
    <section className={cx('min-w-0 rounded-sheet border border-line bg-card', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
          <h2 className="font-sans text-[15px] font-bold">{title}</h2>
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
        <h1 className="text-[30px] font-extrabold tracking-tight text-indigo">{title}</h1>
        {subtitle && <p className="mt-1 text-[15px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const labelCls = 'block text-[13px] font-semibold text-muted';
const controlCls = 'h-11 w-full rounded-control border bg-field px-3.5 text-[15px]';

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
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(controlCls, error ? 'border-danger' : 'border-dusty/40')}
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
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <select id={id} className={cx(controlCls, 'border-dusty/40')} {...props}>
        {children}
      </select>
    </div>
  );
}

/** Compact select used inline in rows (status pickers, document links). */
export const inlineSelectCls =
  'h-9 rounded-[10px] border border-dusty/40 bg-field px-2.5 text-[13px]';

type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'danger';

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const tones: Record<Tone, string> = {
    neutral: 'bg-control text-muted',
    accent: 'bg-accent-soft text-indigo',
    ok: 'bg-ok-soft text-ok-ink',
    warn: 'bg-warn-soft text-warn-ink',
    danger: 'bg-danger-soft text-danger-ink',
  };
  return (
    <span
      className={cx(
        'inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold whitespace-nowrap',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<ProgrammeStatus, Tone> = {
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

const docTone: Record<DocumentStatus, Tone> = { ready: 'ok', draft: 'warn', missing: 'danger' };
export const DocBadge = ({ status }: { status: DocumentStatus }) => (
  <Badge tone={docTone[status]}>{status}</Badge>
);

const riskTone: Record<Risk, Tone> = { ok: 'ok', soon: 'warn', overdue: 'danger' };
export const RiskBadge = ({ risk, days }: { risk: Risk; days: number }) => (
  <Badge tone={riskTone[risk]}>
    {risk === 'overdue' ? `${Math.abs(days)} d overdue` : days === 0 ? 'today' : `in ${days} d`}
  </Badge>
);

/** Seigaiha wave motif — decorative only. */
export const Waves = ({ className, light }: { className?: string; light?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 120 40" className={className}>
    <g fill="none" strokeWidth="2.5">
      <path
        d="M0 40a20 20 0 0 1 40 0M40 40a20 20 0 0 1 40 0M80 40a20 20 0 0 1 40 0"
        stroke="#7d9ac4"
      />
      <path
        d="M-20 30a20 20 0 0 1 40 0M20 30a20 20 0 0 1 40 0M60 30a20 20 0 0 1 40 0M100 30a20 20 0 0 1 40 0"
        stroke={light ? '#fbf8f2' : '#2e63ad'}
      />
      <path
        d="M0 20a20 20 0 0 1 40 0M40 20a20 20 0 0 1 40 0M80 20a20 20 0 0 1 40 0"
        stroke={light ? '#7d9ac4' : '#d6e1f0'}
      />
    </g>
  </svg>
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
    <div className="flex flex-col items-center rounded-card border-[1.5px] border-dashed border-dusty/50 px-6 py-10 text-center">
      <Waves className="mb-3 h-10 w-[120px]" />
      <p className="font-semibold">{title}</p>
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
        'mb-4 rounded-control px-4 py-2.5 text-sm',
        tone === 'warn' ? 'bg-warn-soft text-warn-ink' : 'bg-accent-soft text-indigo',
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
      className="m-auto w-full max-w-lg rounded-sheet border border-line bg-card p-0 shadow-sheet backdrop:bg-ink/40"
    >
      <header className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
        <h2 className="font-sans text-base font-bold">{title}</h2>
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
        className="h-2 flex-1 overflow-hidden rounded-full bg-control"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cx(
            'h-full rounded-full',
            pct === 100 ? 'bg-ok' : pct < 34 ? 'bg-warn' : 'bg-accent',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs font-medium tabular-nums text-muted">{pct}%</span>
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
      'px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.06em] text-muted uppercase',
      className,
    )}
  >
    {children}
  </th>
);
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <td className={cx('px-3 py-3 align-top text-[15px]', className)}>{children}</td>
);

/** Date tile used in deadline lists. */
export function DateTile({ iso, risk }: { iso: string; risk: Risk }) {
  const d = new Date(iso + 'T00:00:00Z');
  const tones: Record<Risk, string> = {
    overdue: 'bg-danger-soft text-danger-ink',
    soon: 'bg-warn-soft text-warn-ink',
    ok: 'bg-accent-soft text-indigo',
  };
  return (
    <div
      className={cx(
        'flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-control leading-none',
        tones[risk],
      )}
    >
      <span className="text-[10px] font-bold tracking-[0.06em] uppercase">
        {d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })}
      </span>
      <span className="font-display text-[17px] font-extrabold">{d.getUTCDate()}</span>
    </div>
  );
}
