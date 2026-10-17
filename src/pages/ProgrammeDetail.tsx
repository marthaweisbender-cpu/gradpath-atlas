import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProgrammeDialog from '../components/ProgrammeDialog';
import {
  Badge,
  Button,
  Card,
  DocBadge,
  Field,
  PageHeader,
  ProgressBar,
  Select,
  StatusBadge,
} from '../components/ui';
import {
  PROGRAMME_STATUSES,
  REQUIREMENT_LABELS,
  REQUIREMENT_TYPES,
  type ProgrammeStatus,
  type RequirementType,
} from '../data/types';
import { formatDate } from '../lib/dates';
import { isBlocked, readiness } from '../store/selectors';
import { useAppStore } from '../store/useAppStore';

export default function ProgrammeDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const ws = useAppStore();
  const p = ws.programmes.find((x) => x.id === id);
  const [edit, setEdit] = useState(false);
  const [note, setNote] = useState('');
  const [task, setTask] = useState({ title: '', due: '', dependsOnId: '' });
  const [req, setReq] = useState<{ type: RequirementType; label: string; required: boolean }>({
    type: 'transcript',
    label: '',
    required: true,
  });
  const [err, setErr] = useState<string | null>(null);

  if (!p) {
    return (
      <div>
        <p>Programme not found.</p>
        <Link to="/app/compare" className="text-accent-strong hover:underline">
          Back to comparison
        </Link>
      </div>
    );
  }

  const uni = ws.universities.find((u) => u.id === p.universityId);
  const reqs = ws.requirements.filter((r) => r.programmeId === p.id);
  const tasks = ws.tasks
    .filter((t) => t.programmeId === p.id)
    .sort((a, b) => a.due.localeCompare(b.due));
  const notes = ws.notes.filter((n) => n.programmeId === p.id);
  const r = readiness(p.id, ws.requirements, ws.documents);
  const docsOfType = (type: RequirementType) => ws.documents.filter((d) => d.type === type);

  const addTask = (e: FormEvent) => {
    e.preventDefault();
    if (!task.title.trim() || !task.due) return setErr('Task title and due date are required.');
    ws.addTask({
      programmeId: p.id,
      title: task.title.trim(),
      due: task.due,
      dependsOnId: task.dependsOnId || null,
    });
    setTask({ title: '', due: '', dependsOnId: '' });
    setErr(null);
  };

  const addReq = (e: FormEvent) => {
    e.preventDefault();
    ws.addRequirement({
      programmeId: p.id,
      type: req.type,
      label: req.label.trim() || REQUIREMENT_LABELS[req.type],
      detail: '',
      required: req.required,
      documentId: null,
    });
    setReq({ type: 'transcript', label: '', required: true });
  };

  return (
    <>
      <PageHeader
        title={p.name}
        subtitle={`${uni?.name ?? ''} · ${uni?.city ?? ''}, ${uni?.country ?? ''} · ${p.degree} in ${p.field}`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEdit(true)}>
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('Remove this programme and its requirements, tasks and notes?')) {
                  ws.removeProgramme(p.id);
                  navigate('/app/compare');
                }
              }}
            >
              Remove
            </Button>
          </div>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Stat label="Deadline" value={formatDate(p.deadline)} />
        <Stat label="Tuition" value={`$${p.tuitionUsd.toLocaleString()}`} />
        <Stat label="Duration" value={`${p.durationMonths} months · ${p.intake} intake`} />
        <div className="rounded-lg border border-line bg-white p-4">
          <label htmlFor="pd-status" className="text-xs text-muted">
            Status
          </label>
          <select
            id="pd-status"
            value={p.status}
            onChange={(e) => ws.setProgrammeStatus(p.id, e.target.value as ProgrammeStatus)}
            className="mt-1 h-9 w-full rounded-md border border-line bg-white px-2 text-sm"
          >
            {PROGRAMME_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          <Card title={`Requirements · ${r.ready}/${r.required} ready`}>
            <ProgressBar pct={r.pct} label="Readiness" />
            <ul className="mt-4 divide-y divide-line">
              {reqs.map((q) => {
                const doc = ws.documents.find((d) => d.id === q.documentId);
                return (
                  <li
                    key={q.id}
                    className="grid gap-2 py-3 md:grid-cols-[1fr_minmax(0,320px)_auto] md:items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {q.label} {!q.required && <Badge tone="neutral">optional</Badge>}
                      </p>
                      {q.detail && <p className="text-xs text-muted">{q.detail}</p>}
                    </div>
                    {q.type === 'fee' || q.type === 'interview' ? (
                      <span className="text-xs text-muted">No document needed</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <label htmlFor={`link-${q.id}`} className="sr-only">
                          Linked document
                        </label>
                        <select
                          id={`link-${q.id}`}
                          value={q.documentId ?? ''}
                          onChange={(e) => ws.linkDocument(q.id, e.target.value || null)}
                          className="h-8 min-w-0 flex-1 rounded-md border border-line bg-white px-2 text-xs"
                        >
                          <option value="">— not linked —</option>
                          {docsOfType(q.type).map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        {doc && <DocBadge status={doc.status} />}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => ws.removeRequirement(q.id)}
                      aria-label={`Remove ${q.label}`}
                    >
                      Remove
                    </Button>
                  </li>
                );
              })}
            </ul>
            <form
              onSubmit={addReq}
              className="mt-4 grid gap-3 rounded-md bg-surface p-3 md:grid-cols-[160px_1fr_auto_auto] md:items-end"
            >
              <Select
                label="Type"
                id="nr-type"
                value={req.type}
                onChange={(e) => setReq({ ...req, type: e.target.value as RequirementType })}
              >
                {REQUIREMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {REQUIREMENT_LABELS[t]}
                  </option>
                ))}
              </Select>
              <Field
                label="Label"
                id="nr-label"
                value={req.label}
                onChange={(e) => setReq({ ...req, label: e.target.value })}
                placeholder={REQUIREMENT_LABELS[req.type]}
              />
              <label className="flex h-10 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={req.required}
                  onChange={(e) => setReq({ ...req, required: e.target.checked })}
                />{' '}
                Required
              </label>
              <Button type="submit" variant="secondary">
                Add requirement
              </Button>
            </form>
          </Card>
          <Card title="Tasks">
            {tasks.length === 0 && (
              <p className="text-sm text-muted">No tasks for this programme.</p>
            )}
            <ul className="divide-y divide-line">
              {tasks.map((t) => {
                const blocked = isBlocked(t, ws.tasks);
                return (
                  <li key={t.id} className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      id={`task-${t.id}`}
                      checked={t.done}
                      disabled={!!blocked}
                      onChange={() => {
                        const res = ws.toggleTask(t.id);
                        if (!res.ok) setErr(res.error ?? null);
                      }}
                    />
                    <label
                      htmlFor={`task-${t.id}`}
                      className={`flex-1 text-sm ${t.done ? 'text-muted line-through' : ''}`}
                    >
                      {t.title}
                    </label>
                    {blocked && <Badge tone="warn">after: {blocked.title}</Badge>}
                    <span className="text-xs text-muted">{formatDate(t.due)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => ws.removeTask(t.id)}
                      aria-label={`Remove task ${t.title}`}
                    >
                      ✕
                    </Button>
                  </li>
                );
              })}
            </ul>
            <form
              onSubmit={addTask}
              className="mt-4 grid gap-3 rounded-md bg-surface p-3 md:grid-cols-[1fr_150px_1fr_auto] md:items-end"
            >
              <Field
                label="New task"
                id="nt-title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
              <Field
                label="Due"
                id="nt-due"
                type="date"
                value={task.due}
                onChange={(e) => setTask({ ...task, due: e.target.value })}
              />
              <Select
                label="Depends on"
                id="nt-dep"
                value={task.dependsOnId}
                onChange={(e) => setTask({ ...task, dependsOnId: e.target.value })}
              >
                <option value="">— none —</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="secondary">
                Add task
              </Button>
            </form>
            {err && (
              <p role="alert" className="mt-2 text-sm text-danger">
                {err}
              </p>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Notes">
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-md border border-line p-3 text-sm">
                  <p>{n.body}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span>{new Date(n.createdAt).toLocaleDateString('en-GB')}</span>
                    <button
                      type="button"
                      onClick={() => ws.removeNote(n.id)}
                      className="hover:text-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (note.trim()) ws.addNote(p.id, note);
                setNote('');
              }}
              className="mt-3 space-y-2"
            >
              <label htmlFor="pd-note" className="sr-only">
                New note
              </label>
              <textarea
                id="pd-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add a note…"
                className="w-full rounded-md border border-line p-2 text-sm"
              />
              <Button type="submit" variant="secondary" size="sm">
                Add note
              </Button>
            </form>
          </Card>
          <Card title="Status history">
            <ul className="space-y-1 text-sm">
              {ws.statusRecords
                .filter((s) => s.programmeId === p.id)
                .sort((a, b) => b.changedAt.localeCompare(a.changedAt))
                .map((s) => (
                  <li key={s.id} className="flex justify-between">
                    <StatusBadge status={s.status} />
                    <span className="text-xs text-muted">
                      {new Date(s.changedAt).toLocaleString('en-GB')}
                    </span>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>
      {edit && <ProgrammeDialog open={edit} onClose={() => setEdit(false)} initial={p} />}
    </>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-line bg-white p-4">
    <p className="text-xs text-muted">{label}</p>
    <p className="mt-1 text-sm font-medium">{value}</p>
  </div>
);
