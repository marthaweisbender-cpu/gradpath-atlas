import { daysUntil, riskFor } from './dates';

test('daysUntil and risk thresholds', () => {
  expect(daysUntil('2026-10-20', '2026-10-17')).toBe(3);
  expect(riskFor('2026-10-10', '2026-10-17')).toBe('overdue');
  expect(riskFor('2026-10-30', '2026-10-17')).toBe('soon');
  expect(riskFor('2026-10-31', '2026-10-17')).toBe('ok');
});
