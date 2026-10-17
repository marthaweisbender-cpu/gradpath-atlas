import type { Doc, Programme, Requirement, Task, Workspace } from '../data/types';
import { daysUntil, riskFor, todayIso, type Risk } from '../lib/dates';

export interface Readiness {
  required: number;
  ready: number;
  pct: number;
}

/** Share of required requirements with a `ready` linked document. */
export function readiness(
  programmeId: string,
  requirements: Requirement[],
  documents: Doc[],
): Readiness {
  const req = requirements.filter((r) => r.programmeId === programmeId && r.required);
  const docById = new Map(documents.map((d) => [d.id, d]));
  const ready = req.filter(
    (r) => r.documentId && docById.get(r.documentId)?.status === 'ready',
  ).length;
  return {
    required: req.length,
    ready,
    pct: req.length ? Math.round((ready / req.length) * 100) : 0,
  };
}

export interface MissingItem {
  programmeId: string;
  requirement: Requirement;
  reason: 'unlinked' | 'missing' | 'draft';
}

export function missingItems(
  ws: Pick<Workspace, 'programmes' | 'requirements' | 'documents'>,
): MissingItem[] {
  const docById = new Map(ws.documents.map((d) => [d.id, d]));
  const active = new Set(
    ws.programmes
      .filter((p) => !['submitted', 'offer', 'rejected', 'dropped'].includes(p.status))
      .map((p) => p.id),
  );
  const out: MissingItem[] = [];
  for (const r of ws.requirements) {
    if (!r.required || !active.has(r.programmeId)) continue;
    if (!r.documentId) {
      if (r.type !== 'fee' && r.type !== 'interview')
        out.push({ programmeId: r.programmeId, requirement: r, reason: 'unlinked' });
      continue;
    }
    const d = docById.get(r.documentId);
    if (!d || d.status === 'missing')
      out.push({ programmeId: r.programmeId, requirement: r, reason: 'missing' });
    else if (d.status === 'draft')
      out.push({ programmeId: r.programmeId, requirement: r, reason: 'draft' });
  }
  return out;
}

export interface DeadlineItem {
  id: string;
  kind: 'programme' | 'task';
  title: string;
  programmeId: string | null;
  date: string;
  days: number;
  risk: Risk;
  done: boolean;
}

export function deadlines(
  ws: Pick<Workspace, 'programmes' | 'tasks'>,
  today: string = todayIso(),
): DeadlineItem[] {
  const closed = (p: Programme) => ['submitted', 'offer', 'rejected', 'dropped'].includes(p.status);
  const items: DeadlineItem[] = [
    ...ws.programmes.map((p) => ({
      id: p.id,
      kind: 'programme' as const,
      title: `${p.name} — application deadline`,
      programmeId: p.id,
      date: p.deadline,
      days: daysUntil(p.deadline, today),
      risk: closed(p) ? ('ok' as Risk) : riskFor(p.deadline, today),
      done: closed(p),
    })),
    ...ws.tasks.map((t) => ({
      id: t.id,
      kind: 'task' as const,
      title: t.title,
      programmeId: t.programmeId,
      date: t.due,
      days: daysUntil(t.due, today),
      risk: t.done ? ('ok' as Risk) : riskFor(t.due, today),
      done: t.done,
    })),
  ];
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

export function isBlocked(task: Task, tasks: Task[]): Task | null {
  if (task.done || !task.dependsOnId) return null;
  const dep = tasks.find((t) => t.id === task.dependsOnId);
  return dep && !dep.done ? dep : null;
}

/** document id → programme ids where it is linked. */
export function reuseMatrix(requirements: Requirement[]): Map<string, Set<string>> {
  const m = new Map<string, Set<string>>();
  for (const r of requirements) {
    if (!r.documentId) continue;
    if (!m.has(r.documentId)) m.set(r.documentId, new Set());
    m.get(r.documentId)!.add(r.programmeId);
  }
  return m;
}
