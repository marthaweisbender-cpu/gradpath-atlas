import { buildSeed } from './seed';

test('seed has referential integrity', () => {
  const s = buildSeed(new Date('2026-10-17'));
  const uni = new Set(s.universities.map((u) => u.id));
  const prog = new Set(s.programmes.map((p) => p.id));
  const doc = new Set(s.documents.map((d) => d.id));
  const task = new Set(s.tasks.map((t) => t.id));
  for (const p of s.programmes) expect(uni.has(p.universityId)).toBe(true);
  for (const r of s.requirements) {
    expect(prog.has(r.programmeId)).toBe(true);
    if (r.documentId) expect(doc.has(r.documentId)).toBe(true);
  }
  for (const t of s.tasks) {
    if (t.programmeId) expect(prog.has(t.programmeId)).toBe(true);
    if (t.dependsOnId) expect(task.has(t.dependsOnId)).toBe(true);
  }
  for (const n of s.notes) expect(prog.has(n.programmeId)).toBe(true);
  expect(s.programmes.length).toBe(6);
});
