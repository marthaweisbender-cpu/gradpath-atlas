import { Link } from 'react-router-dom';
import { Badge, EmptyState, PageHeader, RiskBadge, Td, Th } from '../components/ui';
import { formatDate } from '../lib/dates';
import { deadlines } from '../store/selectors';
import { useAppStore } from '../store/useAppStore';

export default function Deadlines() {
  const ws = useAppStore();
  const items = deadlines(ws);
  const progName = (id: string | null) => ws.programmes.find((p) => p.id === id)?.name ?? 'General';

  return (
    <>
      <PageHeader
        title="Deadlines"
        subtitle="Application deadlines and task due dates in one timeline. Items due within 14 days are flagged."
      />
      {items.length === 0 ? (
        <EmptyState title="No deadlines" />
      ) : (
        <div className="overflow-x-auto rounded-sheet border border-line bg-card">
          <table className="w-full border-collapse">
            <thead className="border-b border-line-soft bg-surface">
              <tr>
                <Th>Date</Th>
                <Th>Item</Th>
                <Th>Programme</Th>
                <Th>Type</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {items.map((d) => (
                <tr key={`${d.kind}-${d.id}`} className={d.done ? 'text-muted' : ''}>
                  <Td className="whitespace-nowrap">{formatDate(d.date)}</Td>
                  <Td className={d.done ? 'line-through' : 'font-medium'}>{d.title}</Td>
                  <Td>
                    {d.programmeId ? (
                      <Link to={`/app/programmes/${d.programmeId}`} className="hover:underline">
                        {progName(d.programmeId)}
                      </Link>
                    ) : (
                      'General'
                    )}
                  </Td>
                  <Td>
                    <Badge tone="neutral">{d.kind}</Badge>
                  </Td>
                  <Td>
                    {d.done ? (
                      <Badge tone="ok">done</Badge>
                    ) : (
                      <RiskBadge risk={d.risk} days={d.days} />
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
