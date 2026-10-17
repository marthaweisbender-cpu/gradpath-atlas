import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4173/gradpath-atlas/', headless: true },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173/gradpath-atlas/',
    reuseExistingServer: true,
  },
});
