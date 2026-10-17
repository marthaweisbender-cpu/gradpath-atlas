import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgrammeDialog from '../components/ProgrammeDialog';
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  ProgressBar,
  RiskBadge,
  StatusBadge,
} from '../components/ui';
import { REQUIREMENT_LABELS } from '../data/types';
import { formatDate } from '../lib/dates';
import { deadlines, missingItems, readiness } from '../store/selectors';
import { useAppStore } from '../store/useAppStore';

export default function Dashboard() {
  const ws = useAppStore();
  const [open, setOpen] = useState(false);
  const active = ws.programmes.filter((p) => !['rejected', 'dropped'].includes(p.status));
  const upcoming = deadlines(ws)
    .filter((d) => !d.done && d.risk !== 'overdue')
    .slice(0, 6);
  const overdue = deadlines(ws).filter((d) => !d.done && d.risk === 'overdue');
  const missing = missingItems(ws);
  const uniName = (id: string) => ws.universities.find((u) => u.id === id)?.name ?? '';
  const progName = (id: string | null) => ws.programmes.find((p) => p.id === id)?.name ?? '';

  const stats = [
    ['Active programmes', active.length],
    [
      'Submitted',
      ws.programmes.filter((p) => p.status === 'submitted' || p.status === 'offer').length,
    ],
    ['Open tasks', ws.tasks.filter((t) => !t.done).length],
    ['Missing items', missing.length],
  ] as const;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Where every application stands today."
        action={<Button onClick={() => setOpen(true)}>Add programme</Button>}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="rounded-lg border border-line bg-white p-5">
            <p className="text-sm text-muted">{l}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card
          title="Programme readiness"
          action={
            <Link to="/app/compare" className="text-sm text-accent-strong hover:underline">
              Compare all
            </Link>
          }
        >
          {active.length === 0 ? (
            <EmptyState
              title="No programmes yet"
              body="Add your first target programme to start planning."
              action={<Button onClick={() => setOpen(true)}>Add programme</Button>}
            />
          ) : (
            <ul className="divide-y divide-line">
              {active.map((p) => {
                const r = readiness(p.id, ws.requirements, ws.documents);
                return (
                  <li
                    key={p.id}
                    className="grid gap-2 py-3 md:grid-cols-[1fr_200px_auto] md:items-center"
                  >
                    <div>
                      <Link to={`/app/programmes/${p.id}`} className="font-medium hover:underline">
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted">
                        {uniName(p.universityId)} · deadline {formatDate(p.deadline)}
                      </p>
                    </div>
                    <ProgressBar pct={r.pct} label={`${p.name} readiness`} />
                    <StatusBadge status={p.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <div className="space-y-6">
          <Card
            title="Next deadlines"
            action={
              <Link to="/app/deadlines" className="text-sm text-accent-strong hover:underline">
                All
              </Link>
            }
          >
            {overdue.length > 0 && (
              <p className="mb-3 text-sm text-danger">
                {overdue.length} overdue item{overdue.length > 1 ? 's' : ''} — see Deadlines.
              </p>
            )}
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted">Nothing due soon.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((d) => (
                  <li
                    key={`${d.kind}-${d.id}`}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{d.title}</p>
                      <p className="text-xs text-muted">{formatDate(d.date)}</p>
                    </div>
                    <RiskBadge risk={d.risk} days={d.days} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card
            title="Missing items"
            action={
              <Link to="/app/documents" className="text-sm text-accent-strong hover:underline">
                Documents
              </Link>
            }
          >
            {missing.length === 0 ? (
              <p className="text-sm text-muted">All required documents are linked and ready.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {missing.slice(0, 8).map((m) => (
                  <li key={m.requirement.id} className="flex justify-between gap-3">
                    <span>
                      {REQUIREMENT_LABELS[m.requirement.type]}{' '}
                      <span className="text-muted">· {progName(m.programmeId)}</span>
                    </span>
                    <span className="whitespace-nowrap text-xs text-warn">
                      {m.reason === 'unlinked' ? 'not linked' : m.reason}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      {open && <ProgrammeDialog open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
