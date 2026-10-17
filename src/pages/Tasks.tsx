import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, EmptyState, PageHeader, RiskBadge } from '../components/ui';
import { formatDate, riskFor, daysUntil } from '../lib/dates';
import { isBlocked } from '../store/selectors';
import { useAppStore } from '../store/useAppStore';

export default function Tasks() {
  const ws = useAppStore();
  const [showDone, setShowDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const groups = [
    ...ws.programmes.map((p) => ({ id: p.id, name: p.name })),
    { id: null, name: 'General' },
  ];
  const visible = ws.tasks.filter((t) => showDone || !t.done);

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="Tasks with prerequisites stay locked until the prerequisite is done."
        action={
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDone}
              onChange={(e) => setShowDone(e.target.checked)}
            />{' '}
            Show completed
          </label>
        }
      />
      {err && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {err}
        </p>
      )}
      {visible.length === 0 ? (
        <EmptyState title="No open tasks" body="Add tasks from a programme page." />
      ) : (
        <div className="space-y-6">
          {groups.map((g) => {
            const list = visible
              .filter((t) => t.programmeId === g.id)
              .sort((a, b) => a.due.localeCompare(b.due));
            if (list.length === 0) return null;
            return (
              <Card
                key={g.id ?? 'general'}
                title={g.name}
                action={
                  g.id ? (
                    <Link
                      to={`/app/programmes/${g.id}`}
                      className="text-sm text-accent font-semibold hover:underline"
                    >
                      Open programme
                    </Link>
                  ) : undefined
                }
              >
                <ul className="divide-y divide-line-soft">
                  {list.map((t) => {
                    const blocked = isBlocked(t, ws.tasks);
                    return (
                      <li key={t.id} className="flex items-center gap-3 py-2">
                        <input
                          type="checkbox"
                          id={`tk-${t.id}`}
                          checked={t.done}
                          disabled={!!blocked}
                          onChange={() => {
                            const r = ws.toggleTask(t.id);
                            setErr(r.ok ? null : (r.error ?? null));
                          }}
                        />
                        <label
                          htmlFor={`tk-${t.id}`}
                          className={`flex-1 text-sm ${t.done ? 'text-muted line-through' : ''}`}
                        >
                          {t.title}
                        </label>
                        {blocked && <Badge tone="warn">after: {blocked.title}</Badge>}
                        <span className="text-xs text-muted">{formatDate(t.due)}</span>
                        {!t.done && <RiskBadge risk={riskFor(t.due)} days={daysUntil(t.due)} />}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
