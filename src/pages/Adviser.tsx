import { useState } from 'react';
import { Button, Card, PageHeader, StatusBadge, Td, Th } from '../components/ui';
import { toCsv, downloadText } from '../lib/csv';
import { formatDate } from '../lib/dates';
import { missingItems, readiness } from '../store/selectors';
import { useAppStore, useCurrentUser } from '../store/useAppStore';
import { REQUIREMENT_LABELS } from '../data/types';

export default function Adviser() {
  const ws = useAppStore();
  const user = useCurrentUser();
  const [generatedOn] = useState(() => new Date().toLocaleDateString('en-GB'));
  const uni = (id: string) => ws.universities.find((u) => u.id === id)?.name ?? '';
  const missing = missingItems(ws);
  const rows = ws.programmes.map((p) => {
    const r = readiness(p.id, ws.requirements, ws.documents);
    return [
      p.name,
      uni(p.universityId),
      p.deadline,
      p.status,
      `P${p.priority}`,
      `${r.ready}/${r.required}`,
      missing.filter((m) => m.programmeId === p.id).length,
    ];
  });

  const exportCsv = () =>
    downloadText(
      'gradpath-summary.csv',
      toCsv(
        [
          'Programme',
          'University',
          'Deadline',
          'Status',
          'Priority',
          'Ready docs',
          'Missing items',
        ],
        rows,
      ),
    );

  return (
    <>
      <PageHeader
        title="Adviser review"
        subtitle="Read-only summary to share with an adviser or careers service."
        action={
          <div className="flex gap-2 print:hidden">
            <Button variant="secondary" onClick={() => window.print()}>
              Print / PDF
            </Button>
            <Button onClick={exportCsv}>Export CSV</Button>
          </div>
        }
      />
      <Card title={`Application plan — ${user?.name ?? ''}`}>
        <p className="mb-4 text-sm text-muted">
          Shared with: {ws.advisers.map((a) => a.name).join(', ') || 'no adviser yet'} · generated{' '}
          {generatedOn}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-line-soft bg-surface">
              <tr>
                <Th>Programme</Th>
                <Th>University</Th>
                <Th>Deadline</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                <Th>Ready docs</Th>
                <Th>Missing</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {ws.programmes.map((p) => {
                const r = readiness(p.id, ws.requirements, ws.documents);
                const m = missing.filter((x) => x.programmeId === p.id);
                return (
                  <tr key={p.id}>
                    <Td className="font-medium">{p.name}</Td>
                    <Td>{uni(p.universityId)}</Td>
                    <Td className="whitespace-nowrap">{formatDate(p.deadline)}</Td>
                    <Td>
                      <StatusBadge status={p.status} />
                    </Td>
                    <Td>P{p.priority}</Td>
                    <Td>
                      {r.ready}/{r.required}
                    </Td>
                    <Td className="text-xs text-muted">
                      {m.map((x) => REQUIREMENT_LABELS[x.requirement.type]).join(', ') || '—'}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
