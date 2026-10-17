import { expect, test } from '@playwright/test';

test('landing → sign-up → dashboard → compare → sign-out', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('master');
  await page.getByRole('link', { name: 'Start planning — free' }).click();
  await page.getByLabel('Full name').fill('Demo Student');
  await page.getByRole('textbox', { name: 'Email' }).fill('demo@example.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('password123');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Compare' })
    .click();
  await expect(page.getByRole('heading', { name: 'Programme comparison' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/#\/$/);
});
