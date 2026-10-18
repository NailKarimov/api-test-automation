import { test as base, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ApiClient } from './api/ApiClient';
import { WeatherClient } from './openweather/WeatherClient';
import { PetstoreClient } from './petstore/PetstoreClient';
import { GraphQLClient } from './graphql/GraphQLClient';
import { env } from '../config/env';

let petstore: Promise<boolean> | undefined;
function petstoreIsUp(): Promise<boolean> {
  petstore ??= fetch(`${env.petstoreBaseUrl}openapi.json`, { signal: AbortSignal.timeout(3_000) })
    .then((r) => r.ok)
    .catch(() => false);
  return petstore;
}

type Fixtures = {
  weather: WeatherClient;
  petstore: PetstoreClient;
  /** Rick and Morty GraphQL endpoint; `graph.api` also reaches the REST twin under /api. */
  graph: GraphQLClient;
  /** Auto fixture: labels every test in the Allure report. */
  allureLabels: void;
};

const OWNER = 'Nail Karimov';
const EPICS: Record<string, string> = {
  openweather: 'OpenWeather',
  petstore: 'Swagger Petstore',
  security: 'Security',
  graphql: 'GraphQL (Rick and Morty)',
};

/** @smoke → critical, @security → critical, everything else → normal. */
function severityOf(tags: string[]): 'critical' | 'normal' {
  return tags.includes('@smoke') || tags.includes('@security') ? 'critical' : 'normal';
}

/** Tests receive ready clients: async ({ weather }) => { ... } / async ({ petstore }) => { ... } */
export const test = base.extend<Fixtures>({
  allureLabels: [
    // Playwright requires a destructuring pattern for the fixtures argument.
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      await allure.owner(OWNER);
      await allure.layer('api');
      await allure.severity(severityOf(testInfo.tags));
      const epic = EPICS[testInfo.project.name];
      if (epic) await allure.epic(epic);
      await use();
    },
    { auto: true },
  ],
  weather: async ({ request }, use) => {
    if (!env.apiKey) {
      throw new Error(
        'OPENWEATHER_API_KEY is not set: add it to .env locally or as a repository secret in CI.',
      );
    }
    await use(new WeatherClient(new ApiClient(request, env.apiKey)));
  },
  // Private Petstore container (infra/petstore). Skipped locally when it is not running; CI fails instead.
  petstore: async ({ request }, use) => {
    if (!(await petstoreIsUp())) {
      const reason = `Petstore container is not running at ${env.petstoreBaseUrl}: start it with \`npm run fuzz:up\`.`;
      if (env.requireStack) throw new Error(reason);
      test.skip(true, reason);
    }
    await use(new PetstoreClient(new ApiClient(request)));
  },
  graph: async ({ request }, use) => {
    await use(new GraphQLClient(new ApiClient(request)));
  },
});

export { expect };
