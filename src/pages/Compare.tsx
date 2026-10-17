import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProgrammeDialog from '../components/ProgrammeDialog';
import { Button, EmptyState, PageHeader, ProgressBar, StatusBadge, Td, Th } from '../components/ui';
import { PROGRAMME_STATUSES, REQUIREMENT_LABELS, type ProgrammeStatus } from '../data/types';
import { formatDate } from '../lib/dates';
import { sortRows } from '../lib/sort';
import { readiness } from '../store/selectors';
import { useAppStore } from '../store/useAppStore';

type SortKey =
  'name' | 'university' | 'deadline' | 'tuitionUsd' | 'durationMonths' | 'priority' | 'readiness';
const optionalCols = ['tuition', 'duration', 'intake', 'requirements'] as const;
type Col = (typeof optionalCols)[number];

export default function Compare() {
  const ws = useAppStore();
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'deadline', dir: 1 });
  const [status, setStatus] = useState<ProgrammeStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [cols, setCols] = useState<Set<Col>>(new Set(optionalCols));
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const uni = new Map(ws.universities.map((u) => [u.id, u]));
    const list = ws.programmes
      .filter((p) => status === 'all' || p.status === status)
      .filter(
        (p) =>
          !q ||
          `${p.name} ${uni.get(p.universityId)?.name ?? ''} ${p.field}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      )
      .map((p) => ({
        ...p,
        key: p.id,
        university: uni.get(p.universityId)?.name ?? '',
        country: uni.get(p.universityId)?.country ?? '',
        readiness: readiness(p.id, ws.requirements, ws.documents).pct,
        reqs: ws.requirements
          .filter((r) => r.programmeId === p.id && r.required)
          .map((r) => REQUIREMENT_LABELS[r.type]),
      }));
    return sortRows(list, sort.key, sort.dir);
  }, [ws, sort, status, q]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key ? ((s.dir * -1) as 1 | -1) : 1 }));
  const ariaSort = (key: SortKey) =>
    sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none';
  const sortBtn = (k: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 uppercase hover:text-ink"
    >
      {label}
      {sort.key === k && <span aria-hidden="true">{sort.dir === 1 ? '↑' : '↓'}</span>}
    </button>
  );

  return (
    <>
      <PageHeader
        title="Programme comparison"
        subtitle="Requirements, deadlines and readiness across every programme."
        action={<Button onClick={() => setOpen(true)}>Add programme</Button>}
      />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="cmp-q" className="block text-xs font-medium text-muted">
            Search
          </label>
          <input
            id="cmp-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Programme, university, field"
            className="h-9 w-64 rounded-card border border-line bg-card px-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="cmp-status" className="block text-xs font-medium text-muted">
            Status
          </label>
          <select
            id="cmp-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProgrammeStatus | 'all')}
            className="h-9 rounded-card border border-line bg-card px-3 text-sm"
          >
            <option value="all">All</option>
            {PROGRAMME_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="flex items-center gap-3 text-sm">
          <legend className="sr-only">Columns</legend>
          {optionalCols.map((c) => (
            <label key={c} className="flex items-center gap-1 capitalize">
              <input
                type="checkbox"
                checked={cols.has(c)}
                onChange={(e) => {
                  const n = new Set(cols);
                  if (e.target.checked) n.add(c);
                  else n.delete(c);
                  setCols(n);
                }}
              />
              {c}
            </label>
          ))}
        </fieldset>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No programmes match" body="Adjust the filters or add a programme." />
      ) : (
        <div className="overflow-x-auto rounded-sheet border border-line bg-card">
          <table className="w-full min-w-[960px] border-collapse">
            <thead className="border-b border-line-soft bg-surface">
              <tr>
                <Th ariaSort={ariaSort('name')}>{sortBtn('name', 'Programme')}</Th>
                <Th ariaSort={ariaSort('university')}>{sortBtn('university', 'University')}</Th>
                <Th ariaSort={ariaSort('deadline')}>{sortBtn('deadline', 'Deadline')}</Th>
                <Th>Status</Th>
                <Th ariaSort={ariaSort('priority')}>{sortBtn('priority', 'Priority')}</Th>
                {cols.has('tuition') && (
                  <Th ariaSort={ariaSort('tuitionUsd')}>{sortBtn('tuitionUsd', 'Tuition')}</Th>
                )}
                {cols.has('duration') && (
                  <Th ariaSort={ariaSort('durationMonths')}>
                    {sortBtn('durationMonths', 'Duration')}
                  </Th>
                )}
                {cols.has('intake') && <Th>Intake</Th>}
                {cols.has('requirements') && <Th>Required</Th>}
                <Th className="w-44" ariaSort={ariaSort('readiness')}>
                  {sortBtn('readiness', 'Readiness')}
                </Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-accent-soft/30">
                  <Td>
                    <Link to={`/app/programmes/${r.id}`} className="font-medium hover:underline">
                      {r.name}
                    </Link>
                    <p className="text-xs text-muted">
                      {r.degree} · {r.field}
                    </p>
                  </Td>
                  <Td>
                    {r.university}
                    <p className="text-xs text-muted">{r.country}</p>
                  </Td>
                  <Td className="whitespace-nowrap">{formatDate(r.deadline)}</Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                  <Td>P{r.priority}</Td>
                  {cols.has('tuition') && (
                    <Td className="tabular-nums">${r.tuitionUsd.toLocaleString()}</Td>
                  )}
                  {cols.has('duration') && <Td>{r.durationMonths} mo</Td>}
                  {cols.has('intake') && <Td>{r.intake}</Td>}
                  {cols.has('requirements') && (
                    <Td size="sm" className="text-muted">{r.reqs.join(', ') || '—'}</Td>
                  )}
                  <Td>
                    <ProgressBar pct={r.readiness} label={`${r.name} readiness`} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {open && <ProgrammeDialog open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
