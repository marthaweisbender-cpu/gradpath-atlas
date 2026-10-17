export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export function daysUntil(iso: string, from: string = todayIso()): number {
  const a = new Date(iso + 'T00:00:00Z').getTime();
  const b = new Date(from + 'T00:00:00Z').getTime();
  return Math.round((a - b) / 86_400_000);
}

export type Risk = 'overdue' | 'soon' | 'ok';

export function riskFor(iso: string, from?: string): Risk {
  const d = daysUntil(iso, from);
  if (d < 0) return 'overdue';
  if (d < 14) return 'soon';
  return 'ok';
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
