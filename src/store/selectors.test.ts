import { buildSeed } from '../data/seed';
import { deadlines, isBlocked, missingItems, readiness, reuseMatrix } from './selectors';

const ws = buildSeed(new Date('2026-10-17T00:00:00Z'));

test('readiness counts ready linked required docs', () => {
  const r = readiness('p1', ws.requirements, ws.documents);
  expect(r.required).toBe(6);
  expect(r.ready).toBe(4); // transcript, cv, reference, ielts; statement draft, fee unlinked
  expect(r.pct).toBe(67);
});

test('missingItems flags unlinked, missing and draft docs for active programmes', () => {
  const m = missingItems(ws);
  const p3 = m.filter((x) => x.programmeId === 'p3').map((x) => x.reason);
  expect(p3).toEqual(expect.arrayContaining(['missing', 'missing']));
  expect(m.some((x) => x.programmeId === 'p5')).toBe(false); // submitted → ignored
});

test('deadlines sorted ascending with risk flags', () => {
  const d = deadlines(ws, '2026-10-17');
  expect(d.map((x) => x.date)).toEqual([...d.map((x) => x.date)].sort());
  expect(d.find((x) => x.id === 'p3')?.risk).toBe('soon');
  expect(d.find((x) => x.id === 'p6')?.risk).toBe('ok');
  expect(d.find((x) => x.id === 'p5')?.done).toBe(true);
});

test('isBlocked returns unfinished prerequisite', () => {
  const t5 = ws.tasks.find((t) => t.id === 't5')!;
  expect(isBlocked(t5, ws.tasks)?.id).toBe('t3');
  const t1 = ws.tasks.find((t) => t.id === 't1')!;
  expect(isBlocked(t1, ws.tasks)).toBeNull();
});

test('reuseMatrix groups programmes per document', () => {
  const m = reuseMatrix(ws.requirements);
  expect(m.get('d1')?.size).toBe(4);
});
