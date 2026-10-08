import { defineConfig } from '@playwright/test';
import shared from './playwright.config';

export default defineConfig({
  ...shared,
  use: { ...shared.use, baseURL: 'http://localhost:3002' },
  webServer: {
    command: 'npm run start -- --port 3002',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
