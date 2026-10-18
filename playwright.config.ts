import { defineConfig } from '@playwright/test';
import { env } from './config/env';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // OpenWeather free plan allows 60 calls/minute; two workers keep the suite well below that.
  workers: 2,
  timeout: 30_000,
  reporter: [[isCI ? 'github' : 'list'], ['html', { open: 'never' }], ['allure-playwright']],
  use: {
    extraHTTPHeaders: { Accept: 'application/json' },
  },
  projects: [
    { name: 'openweather', testDir: './tests/openweather', use: { baseURL: env.apiBaseUrl } },
    // Private Petstore container (infra/petstore): `npm run petstore:up` first.
    { name: 'petstore', testDir: './tests/petstore', use: { baseURL: env.petstoreBaseUrl } },
    // Cross-cutting HTTP security checks; every request uses an absolute URL, so there is no baseURL.
    { name: 'security', testDir: './tests/security' },
    { name: 'unit', testDir: './tests/unit' },
    // GraphQL: public Rick and Morty API (docs/graphql.md).
    {
      name: 'graphql',
      testDir: './tests/graphql',
      // Polite to a rate-limited public API: requests are spaced out and a 429 is waited out.
      timeout: 120_000,
      use: { baseURL: env.rickAndMortyBaseUrl },
    },
  ],
});
