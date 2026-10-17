import { sha256 } from './crypto';

test('sha256 is deterministic and hex', async () => {
  const a = await sha256('secret');
  expect(a).toMatch(/^[0-9a-f]{64}$/);
  expect(await sha256('secret')).toBe(a);
  expect(await sha256('other')).not.toBe(a);
});
