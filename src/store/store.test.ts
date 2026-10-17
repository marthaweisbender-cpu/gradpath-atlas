import { beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';

beforeEach(() => useAppStore.getState().clearAllData());

test('sign-up, sign-in, sign-out', async () => {
  const s = useAppStore.getState();
  expect((await s.signUp('Demo', 'demo@example.test', 'short')).ok).toBe(false);
  expect((await s.signUp('Demo', 'demo@example.test', 'password123')).ok).toBe(true);
  expect(useAppStore.getState().currentUserId).not.toBeNull();
  useAppStore.getState().signOut();
  expect((await useAppStore.getState().signIn('demo@example.test', 'wrong')).ok).toBe(false);
  expect((await useAppStore.getState().signIn('DEMO@example.test', 'password123')).ok).toBe(true);
});

test('free plan limits active programmes to 3', async () => {
  await useAppStore.getState().signUp('Demo', 'd@example.test', 'password123');
  const base = {
    universityId: 'u',
    name: 'X',
    degree: 'MSc',
    field: 'F',
    tuitionUsd: 1,
    durationMonths: 12,
    intake: 'Sep',
    deadline: '2027-01-01',
    status: 'researching' as const,
    priority: 2 as const,
  };
  for (let i = 0; i < 3; i++) expect(useAppStore.getState().addProgramme(base).ok).toBe(true);
  expect(useAppStore.getState().addProgramme(base).ok).toBe(false);
  useAppStore.getState().setPlan('season');
  expect(useAppStore.getState().addProgramme(base).ok).toBe(true);
});

test('toggleTask enforces dependency', () => {
  const s = useAppStore.getState();
  s.addTask({ programmeId: null, title: 'A', due: '2027-01-01', dependsOnId: null });
  const a = useAppStore.getState().tasks[0];
  s.addTask({ programmeId: null, title: 'B', due: '2027-01-02', dependsOnId: a.id });
  const b = useAppStore.getState().tasks[1];
  expect(useAppStore.getState().toggleTask(b.id).ok).toBe(false);
  expect(useAppStore.getState().toggleTask(a.id).ok).toBe(true);
  expect(useAppStore.getState().toggleTask(b.id).ok).toBe(true);
});

test('removeDocument unlinks requirements', () => {
  useAppStore.getState().resetDemoData();
  useAppStore.getState().removeDocument('d1');
  expect(useAppStore.getState().requirements.some((r) => r.documentId === 'd1')).toBe(false);
});
