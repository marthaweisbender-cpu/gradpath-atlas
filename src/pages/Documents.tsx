import { useState, type FormEvent } from 'react';
import {
  Button,
  Card,
  DocBadge,
  EmptyState,
  Field,
  PageHeader,
  Select,
  Td,
  Th,
} from '../components/ui';
import {
  REQUIREMENT_LABELS,
  REQUIREMENT_TYPES,
  type DocumentStatus,
  type RequirementType,
} from '../data/types';
import { reuseMatrix } from '../store/selectors';
import { useAppStore } from '../store/useAppStore';

const statuses: DocumentStatus[] = ['missing', 'draft', 'ready'];

export default function Documents() {
  const ws = useAppStore();
  const [f, setF] = useState<{ name: string; type: RequirementType; status: DocumentStatus }>({
    name: '',
    type: 'statement',
    status: 'draft',
  });
  const [err, setErr] = useState<string | null>(null);
  const matrix = reuseMatrix(ws.requirements);
  const programmes = ws.programmes.filter((p) => !['dropped', 'rejected'].includes(p.status));

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return setErr('Document name is required.');
    ws.addDocument({ name: f.name.trim(), type: f.type, status: f.status });
    setF({ name: '', type: 'statement', status: 'draft' });
    setErr(null);
  };

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Keep one copy of each document and reuse it across programmes."
      />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card title="Document library">
          {ws.documents.length === 0 ? (
            <EmptyState title="No documents yet" />
          ) : (
            <ul className="divide-y divide-line">
              {ws.documents.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted">
                      {REQUIREMENT_LABELS[d.type]} · used in {matrix.get(d.id)?.size ?? 0}{' '}
                      programme(s)
                    </p>
                  </div>
                  <label htmlFor={`ds-${d.id}`} className="sr-only">
                    Status of {d.name}
                  </label>
                  <select
                    id={`ds-${d.id}`}
                    value={d.status}
                    onChange={(e) =>
                      ws.updateDocument(d.id, { status: e.target.value as DocumentStatus })
                    }
                    className="h-8 rounded-md border border-line bg-white px-2 text-xs"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <DocBadge status={d.status} />
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove ${d.name}`}
                    onClick={() => ws.removeDocument(d.id)}
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={add} className="mt-4 space-y-3 rounded-md bg-surface p-3">
            <Field
              label="New document"
              id="nd-name"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              error={err ?? undefined}
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <Select
                label="Type"
                id="nd-type"
                value={f.type}
                onChange={(e) => setF({ ...f, type: e.target.value as RequirementType })}
              >
                {REQUIREMENT_TYPES.filter((t) => t !== 'fee' && t !== 'interview').map((t) => (
                  <option key={t} value={t}>
                    {REQUIREMENT_LABELS[t]}
                  </option>
                ))}
              </Select>
              <Select
                label="Status"
                id="nd-status"
                value={f.status}
                onChange={(e) => setF({ ...f, status: e.target.value as DocumentStatus })}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="secondary">
                Add
              </Button>
            </div>
          </form>
        </Card>
        <Card title="Reuse matrix">
          {programmes.length === 0 || ws.documents.length === 0 ? (
            <EmptyState
              title="Nothing to show"
              body="Add programmes and documents, then link them on programme pages."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead className="border-b border-line bg-surface">
                  <tr>
                    <Th>Document</Th>
                    {programmes.map((p) => (
                      <Th key={p.id} className="text-center">
                        <span className="block max-w-28 truncate" title={p.name}>
                          {p.name}
                        </span>
                      </Th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ws.documents.map((d) => (
                    <tr key={d.id}>
                      <Td className="whitespace-nowrap">
                        {d.name}
                        <span className="ml-2">
                          <DocBadge status={d.status} />
                        </span>
                      </Td>
                      {programmes.map((p) => {
                        const linked = matrix.get(d.id)?.has(p.id);
                        return (
                          <Td key={p.id} className="text-center">
                            <span
                              aria-label={linked ? 'linked' : 'not linked'}
                              className={linked ? 'text-accent-strong' : 'text-line'}
                            >
                              {linked ? '●' : '○'}
                            </span>
                          </Td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
