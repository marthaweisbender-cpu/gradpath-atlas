import { sortRows } from './sort';

test('sortRows sorts numbers and strings in both directions', () => {
  const rows = [
    { key: 'a', name: 'B', tuitionUsd: 20 },
    { key: 'b', name: 'A', tuitionUsd: 10 },
  ];
  expect(sortRows(rows, 'name', 1).map((r) => r.key)).toEqual(['b', 'a']);
  expect(sortRows(rows, 'tuitionUsd', -1).map((r) => r.key)).toEqual(['a', 'b']);
});
