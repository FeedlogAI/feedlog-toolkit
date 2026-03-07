import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const rootDir = path.resolve(__dirname);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  webServer: [
    {
      command: 'node server.js',
      cwd: path.join(rootDir, 'examples/webcomponent-ssr'),
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'npx next start -H 127.0.0.1 -p 3002',
      cwd: path.join(rootDir, 'examples/react-ssr'),
      url: 'http://127.0.0.1:3002',
      reuseExistingServer: !process.env.CI,
      timeout: 90000,
    },
    {
      command: 'node .output/server/index.mjs',
      cwd: path.join(rootDir, 'examples/vue-ssr'),
      url: 'http://127.0.0.1:3003',
      reuseExistingServer: !process.env.CI,
      timeout: 90000,
      env: { ...process.env, PORT: '3003', NITRO_PORT: '3003', HOST: '127.0.0.1' },
    },
  ],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'webcomponent-ssr',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /webcomponent-ssr\.spec\.ts/,
    },
    {
      name: 'react-ssr',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /react-ssr\.spec\.ts/,
    },
    {
      name: 'vue-ssr',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /vue-ssr\.spec\.ts/,
    },
  ],
});
