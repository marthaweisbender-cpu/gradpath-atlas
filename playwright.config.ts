import { defineConfig } from '@playwright/test';

// CHROMIUM_PATH lets environments with a pre-installed Chromium skip the download.
const executablePath = process.env.CHROMIUM_PATH;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4173/gradpath-atlas/',
    headless: true,
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173/gradpath-atlas/',
    reuseExistingServer: true,
  },
});
