export function sortRows<T extends Record<string, unknown>>(
  rows: T[],
  key: string,
  dir: 1 | -1,
): T[] {
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
    return String(x).localeCompare(String(y)) * dir;
  });
}
