# Toolbox

Every tool used across the portfolio repositories, grouped by stage of work.
Visual, interactive version (map, one CI run step by step, repo matrix, RU/EN): [`docs/toolbox.html`](https://nailkarimov.github.io/api-test-automation/toolbox.html).

Repositories: [api-test-automation](https://github.com/NailKarimov/api-test-automation), [contract-testing-lab](https://github.com/NailKarimov/contract-testing-lab), [microservices-testing](https://github.com/NailKarimov/microservices-testing), [ledger-api-testing](https://github.com/NailKarimov/ledger-api-testing), [3sMoneyTests](https://github.com/NailKarimov/3sMoneyTests), [qa-project-template](https://github.com/NailKarimov/qa-project-template).

## Overview

| Tool                             | Stage                | Kind                      | api-test-automation | contract-testing-lab | microservices-testing | ledger-api-testing | 3sMoneyTests | qa-project-template |
| -------------------------------- | -------------------- | ------------------------- | ------------------- | -------------------- | --------------------- | ------------------ | ------------ | ------------------- |
| TypeScript                       | Write tests          | language                  | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| Node.js 22 + npm                 | Write tests          | runtime                   | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| Playwright Test                  | Write tests          | framework                 | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| zod                              | Write tests          | library                   | ✓                   |                      | ✓                     |                    |              |                     |
| Faker                            | Write tests          | library                   |                     |                      |                       |                    |              | ✓                   |
| dotenv + GitHub Secrets          | Write tests          | config                    | ✓                   |                      |                       |                    |              | ✓                   |
| ESLint                           | Keep code clean      | linter                    | ✓                   | ✓                    | ✓                     | ✓                  |              | ✓                   |
| Prettier                         | Keep code clean      | formatter                 | ✓                   | ✓                    | ✓                     | ✓                  |              | ✓                   |
| Husky + lint-staged              | Keep code clean      | git hooks                 | ✓                   | ✓                    | ✓                     | ✓                  |              | ✓                   |
| axe-core                         | Special test types   | accessibility             |                     |                      |                       |                    | ✓            |                     |
| Web Vitals (PerformanceObserver) | Special test types   | front-end performance     |                     |                      |                       |                    | ✓            |                     |
| k6                               | Special test types   | load testing              |                     |                      | ✓                     |                    |              |                     |
| Schemathesis                     | Special test types   | property-based / fuzzing  |                     | ✓                    |                       |                    |              |                     |
| oasdiff                          | Special test types   | contract drift            |                     | ✓                    |                       |                    |              |                     |
| Pact                             | Special test types   | consumer-driven contracts |                     | ✓                    |                       |                    |              |                     |
| GraphQL (graphql-js)             | Special test types   | GraphQL API testing       | ✓                   |                      |                       |                    |              |                     |
| GraphQL Inspector                | Special test types   | GraphQL schema drift      | ✓                   |                      |                       |                    |              |                     |
| amqplib (RabbitMQ)               | Special test types   | event-driven              |                     |                      | ✓                     |                    |              |                     |
| Docker + Docker Compose          | Run the system       | containers                | ✓                   | ✓                    | ✓                     | ✓                  |              |                     |
| Sock Shop                        | Run the system       | system under test         |                     |                      | ✓                     |                    |              |                     |
| Testcontainers                   | Run the system       | throw-away dependencies   |                     |                      |                       | ✓                  |              |                     |
| PostgreSQL + pg                  | Run the system       | database                  |                     |                      |                       | ✓                  |              |                     |
| Ledger API (Fastify)             | Run the system       | own system under test     |                     |                      |                       | ✓                  |              |                     |
| OAuth 2.0 + JWT (jose)           | Special test types   | authorization testing     |                     |                      |                       | ✓                  |              |                     |
| xvfb                             | Run the system       | virtual display           |                     |                      |                       |                    | ✓            |                     |
| Allure Report                    | Read the results     | reporting                 | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| Playwright HTML report + trace   | Read the results     | debugging                 | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| GitHub Actions                   | Automate and publish | CI/CD                     | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| GitHub Pages                     | Automate and publish | hosting                   | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| Git + GitHub                     | Automate and publish | version control           | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |
| VS Code                          | Automate and publish | editor                    | ✓                   | ✓                    | ✓                     | ✓                  | ✓            | ✓                   |

## Write tests

### TypeScript

JavaScript with types. The language all tests and helpers are written in.

- **Why here:** A misspelt field or a wrong argument shows up in the editor, before anything runs. Playwright and most modern frameworks are written in it.
- **Where:** `tsconfig.json, src/, tests/`
- **Command:** `npm run typecheck`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** JavaScript, Python, Java, C#
- **Interview question:** Why types in tests if a test fails at runtime anyway?

### Node.js 22 + npm

The runtime that executes TypeScript/JavaScript outside the browser, plus the npm package manager.

- **Why here:** npm installs every library from package-lock.json in one command, so your machine, CI and an interviewer get the same versions.
- **Where:** `package.json, package-lock.json`
- **Command:** `npm ci`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** pnpm, Yarn, Bun
- **Interview question:** How is npm ci different from npm install?

### Playwright Test

Microsoft's test framework: browser UI tests and API calls (APIRequestContext) in one tool.

- **Why here:** Auto-waiting, parallel runs, retries, projects, fixtures, trace viewer. One framework for UI and API.
- **Where:** `playwright.config.ts, tests/`
- **Command:** `npx playwright test --project=petstore`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** Cypress, Selenium/WebDriver, REST Assured, pytest + requests
- **Interview question:** How do you log in once and reuse it across Playwright tests?

### zod

A schema library: describe what an API response must look like and validate it in one line.

- **Why here:** Contract checks on every response: field types, required fields, enums, ranges. The same schema gives TypeScript its type.
- **Where:** `src/*/schemas.ts, src/support/schema.ts`
- **Command:** `expectSchema(petSchema, res.body)`
- **Repositories:** api-test-automation, microservices-testing
- **Alternatives:** JSON Schema + Ajv, Joi, Pydantic
- **Interview question:** How does schema validation differ from checking exact values?

### Faker

A generator of realistic test data: names, emails, text, numbers.

- **Why here:** Each test creates its own unique data, so tests do not collide or depend on fixtures.
- **Where:** `qa-project-template/src`
- **Command:** `faker.lorem.sentence()`
- **Repositories:** qa-project-template
- **Alternatives:** Chance.js, a custom data factory
- **Interview question:** How do you isolate test data in parallel runs?

### dotenv + GitHub Secrets

Secrets and settings come from a local .env file and from GitHub Secrets in CI, never from code.

- **Why here:** The OpenWeather key never reaches the repository and is masked in reports.
- **Where:** `.env.example, config/env.ts`
- **Command:** `OPENWEATHER_API_KEY=… npm test`
- **Repositories:** api-test-automation, qa-project-template
- **Alternatives:** Vault, 1Password CLI, Doppler
- **Interview question:** How do you store tokens and keys for automated tests?

## Keep code clean

### ESLint

A static code analyser. With eslint-plugin-playwright it knows the usual mistakes in tests.

- **Why here:** Catches a forgotten await, test.only, skipped tests and suspicious code before review.
- **Where:** `eslint.config.mjs`
- **Command:** `npm run lint`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, qa-project-template
- **Alternatives:** Biome, oxlint
- **Interview question:** Why is a forgotten await in a test dangerous?

### Prettier

Automatic formatting of code, Markdown, YAML and JSON by one set of rules.

- **Why here:** No whitespace arguments in review; a diff shows only real changes.
- **Where:** `.prettierrc.json`
- **Command:** `npm run format:check`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, qa-project-template
- **Alternatives:** Biome, dprint
- **Interview question:** What is the difference between a linter and a formatter?

### Husky + lint-staged

A pre-commit git hook that runs ESLint and Prettier on the changed files only.

- **Why here:** Unformatted code never gets committed, so CI does not fail on trivia.
- **Where:** `.husky/pre-commit, package.json → lint-staged`
- **Command:** `git commit (runs automatically)`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, qa-project-template
- **Alternatives:** pre-commit (Python), lefthook
- **Interview question:** What belongs in pre-commit and what in CI?

## Special test types

### axe-core

Deque's automated accessibility engine, used through @axe-core/playwright.

- **Why here:** Checks a page against WCAG 2.2 AA rules: contrast, labels, roles, structure. Finds roughly a third of issues; the rest needs manual and keyboard testing.
- **Where:** `3sMoneyTests/tests/a11y`
- **Command:** `npm run test:a11y`
- **Repositories:** 3sMoneyTests
- **Alternatives:** Pa11y, Lighthouse, WAVE
- **Interview question:** Can accessibility testing be fully automated?

### Web Vitals (PerformanceObserver)

LCP, CLS and TTFB measured in the browser through the Performance API, plus page weight.

- **Why here:** Google's metrics that affect SEO and perceived speed. A test fails when a page goes over budget.
- **Where:** `3sMoneyTests/tests/performance`
- **Command:** `npm run test:perf`
- **Repositories:** 3sMoneyTests
- **Alternatives:** Lighthouse CI, WebPageTest, sitespeed.io
- **Interview question:** What are LCP and CLS and their thresholds?

### k6

Grafana's load testing tool. Scenarios in JavaScript, run in the grafana/k6 container.

- **Why here:** Smoke, load and stress profiles for Sock Shop. p95 and error-rate thresholds act as SLOs: exceed them and the run fails.
- **Where:** `loadtests/, scripts/run-k6.mjs, loadtest.yml`
- **Command:** `npm run loadtest:load`
- **Repositories:** microservices-testing
- **Alternatives:** JMeter, Gatling, Locust, Artillery
- **Interview question:** Why p95 and not the average response time?

### Schemathesis

Generates thousands of requests from an OpenAPI spec and checks the server conforms to it.

- **Why here:** Found 83 spec violations in Petstore (FZ-1 … FZ-8). The baseline separates known defects from new ones.
- **Where:** `fuzz/, fuzz.yml, docs/schemathesis.md`
- **Command:** `npm run fuzz`
- **Repositories:** contract-testing-lab
- **Alternatives:** RESTler, Dredd, EvoMaster
- **Interview question:** How is a property-based test different from a regular one?

### oasdiff

Compares two versions of an OpenAPI spec and sorts every difference: error breaks clients, warning may, info is safe.

- **Why here:** The approved Petstore contract is checked against what the container serves and against the public sandbox. Found CD-1: the image serves the old 1.0.17 spec, 7 operations lost their 200 response.
- **Where:** `contracts/, contract.yml, docs/contract-drift.md`
- **Command:** `npm run contract:check`
- **Repositories:** contract-testing-lab
- **Alternatives:** openapi-diff, Optic, Bump.sh, Spectral (linting)
- **Interview question:** Which API changes are backward incompatible?

### Pact

The client's tests record which requests it sends and which fields it reads. The resulting pact file is replayed against the real provider.

- **Why here:** Pet Adoption Web → Petstore: 5 interactions, provider verification 5/5 against the container. A self-test proves an impossible contract is rejected.
- **Where:** `src/consumers/, tests/contract-*, docs/pact.md`
- **Command:** `npm run test:contract`
- **Repositories:** contract-testing-lab
- **Alternatives:** Spring Cloud Contract, Specmatic, PactFlow (broker)
- **Interview question:** How is a contract test different from an integration test?

### GraphQL (graphql-js)

Tests for a GraphQL API: one /graphql endpoint, the client picks the fields, errors arrive in an errors array. The graphql library parses and builds schemas.

- **Why here:** 34 tests against the Rick and Morty API: queries, pagination, errors, security (depth limit, aliases), a REST-twin oracle. Found GQL-2: no query cost limit.
- **Where:** `src/graphql/, tests/graphql, docs/graphql.md`
- **Command:** `npm run test:graphql`
- **Repositories:** api-test-automation
- **Alternatives:** Apollo Client, graphql-request, Karate, Postman GraphQL
- **Interview question:** Why is the HTTP status not enough when testing GraphQL?

### GraphQL Inspector

Compares two GraphQL schemas and sorts changes into breaking, dangerous and safe: oasdiff for GraphQL.

- **Why here:** Live schema via introspection vs the approved one from the source: 0 breaking, 11 safe (Apollo Server's own types).
- **Where:** `contracts/rickandmorty/, tests/graphql/schema-drift.spec.ts`
- **Command:** `npx playwright test tests/graphql/schema-drift.spec.ts`
- **Repositories:** api-test-automation
- **Alternatives:** Apollo Rover (schema checks), graphql-schema-diff
- **Interview question:** What counts as a breaking change in a GraphQL schema?

### amqplib (RabbitMQ)

A client for the RabbitMQ message broker. Tests read the shipping-task queue directly.

- **Why here:** Verifies the asynchronous side effect of an order: exactly one message, and no silent loss when the broker is down (SS-17, SS-18).
- **Where:** `src/sockshop/queue.ts, tests/sockshop-events`
- **Command:** `npm run test:sockshop`
- **Repositories:** microservices-testing
- **Alternatives:** Kafka clients, Testcontainers modules
- **Interview question:** How do you test asynchronous behaviour without sleep?

### OAuth 2.0 + JWT (jose)

OAuth 2.0 is the protocol for granting access with a token; a JWT is a signed token the API verifies on its own. The jose library signs and verifies tokens and reads the public keys (JWKS).

- **Why here:** Our own authorization server issues tokens for the Ledger API, and the tests forge them (alg: none, a foreign key, expired, wrong aud), check PKCE, refresh-token theft and access to other people's accounts (BOLA). 13 planted bugs caught.
- **Where:** `services/auth-server, tests/auth`
- **Command:** `npm run test:auth`
- **Repositories:** ledger-api-testing
- **Alternatives:** Keycloak or Auth0 in a container, mock-oauth2-server, jsonwebtoken
- **Interview question:** What is the difference between 401 and 403, and what is BOLA?

## Run the system

### Docker + Docker Compose

Containers: the system under test starts with one command and behaves the same everywhere. Compose describes several services at once.

- **Why here:** A private Petstore for the functional tests, Pact and fuzzing; 13 Sock Shop containers with MongoDB, MySQL and RabbitMQ; PostgreSQL from Testcontainers. Chaos tests stop containers mid-test.
- **Where:** `infra/petstore, infra/sock-shop, src/ledger/fixtures.ts`
- **Command:** `npm run stack:up`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing
- **Alternatives:** Podman, Kubernetes (kind), Testcontainers
- **Interview question:** Why does a tester need Docker?

### Sock Shop

Weaveworks' microservices demo shop: catalogue, cart, users, orders, payment, shipping.

- **Why here:** A realistic microservices system for end-to-end, load, chaos and event tests. 18 defects found, SS-1 … SS-18.
- **Where:** `infra/sock-shop/docker-compose.yml`
- **Command:** `npm run stack:up`
- **Repositories:** microservices-testing
- **Alternatives:** Online Boutique, eShopOnContainers
- **Interview question:** What changes in testing when moving from a monolith to microservices?

### Testcontainers

A library that starts a real dependency (PostgreSQL here) in a throw-away Docker container from test code and removes it afterwards.

- **Why here:** Every Playwright worker gets its own clean, freshly migrated database, so the Ledger API tests can assert exact row counts and balances.
- **Where:** `src/ledger/fixtures.ts`
- **Command:** `npm run test:ledger`
- **Repositories:** ledger-api-testing
- **Alternatives:** docker compose, embedded databases, H2 (Java), shared test DB
- **Interview question:** Why not mock the database in integration tests?

### PostgreSQL + pg

The relational database and the pg Node.js client the tests use to read tables directly.

- **Why here:** Checks the API cannot offer: balance = sum of entries, every movement = two entries summing to zero, the schema refuses bad data (CHECK, FK).
- **Where:** `services/ledger-api/migrations, src/ledger/Db.ts`
- **Command:** `SELECT … FROM ledger_entries`
- **Repositories:** ledger-api-testing
- **Alternatives:** MySQL, SQL Server, Oracle; Knex, Prisma
- **Interview question:** How do you verify that an operation is atomic?

### Ledger API (Fastify)

Our own small wallets-and-transfers service on Fastify: idempotent transfers, double-entry ledger, row locks.

- **Why here:** Public APIs never open their database. Here 47 tests compare answers with the tables; all five planted bugs were caught.
- **Where:** `services/ledger-api, tests/ledger, docs/ledger-api.md`
- **Command:** `npm run ledger:dev`
- **Repositories:** ledger-api-testing
- **Alternatives:** Express, NestJS, Spring Boot
- **Interview question:** How do you test protection against double charging?

### xvfb

A virtual display on Linux: the browser believes it has a screen.

- **Why here:** 3s.money sits behind Cloudflare, which blocks headless browsers, so CI runs headed Chrome inside xvfb.
- **Where:** `3sMoneyTests/.github/workflows/e2e.yml`
- **Command:** `xvfb-run -a npm test`
- **Repositories:** 3sMoneyTests
- **Alternatives:** headless mode, cloud browsers (BrowserStack)
- **Interview question:** Headless vs headed: when does it matter?

## Read the results

### Allure Report

A run report: test tree, steps, request/response attachments, failure categories, history charts.

- **Why here:** Managers and developers can read it. History across runs exposes flaky tests and the pass-rate trend.
- **Where:** `allure/categories.json, scripts/allure-prepare.mjs`
- **Command:** `npm run allure:generate && npm run allure:open`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** ReportPortal, Playwright HTML report, TestRail
- **Interview question:** Which report metrics do you show the team?

### Playwright HTML report + trace

Playwright's built-in report; for UI, a trace: a step-by-step recording of actions, DOM, network and console.

- **Why here:** A failed test can be debugged without re-running it: open the trace and see the page at every step.
- **Where:** `playwright-report/ (CI artifact)`
- **Command:** `npx playwright show-report`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** videos and screenshots, Cypress Cloud
- **Interview question:** How do you debug a test that fails only in CI?

## Automate and publish

### GitHub Actions

CI built into GitHub: workflow files say when and how tests run.

- **Why here:** Runs on every push and PR, nightly on a schedule, and manually with a chosen suite. Annotations and a summary show on the run page.
- **Where:** `.github/workflows/*.yml`
- **Command:** `push → Actions`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** GitLab CI, Jenkins, TeamCity, Azure DevOps
- **Interview question:** Which tests run on a PR and which nightly?

### GitHub Pages

Free static hosting from the gh-pages branch; peaceiris/actions-gh-pages publishes to it.

- **Why here:** The Allure report, the Schemathesis report and the visual guides open from a link, no download needed. Handy in an interview.
- **Where:** `gh-pages branch`
- **Command:** `nailkarimov.github.io/api-test-automation`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** Netlify, S3, ReportPortal
- **Interview question:** How do you keep Allure history between CI runs?

### Git + GitHub

Version control and repository hosting. SSH key login, 2FA.

- **Why here:** Change history, review, a public portfolio. Every commit triggers CI.
- **Where:** `github.com/NailKarimov`
- **Command:** `git push`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** GitLab, Bitbucket
- **Interview question:** Why is force-pushing a shared branch dangerous?

### VS Code

The editor, with the ESLint, Prettier and Playwright Test extensions.

- **Why here:** Run and debug a single test with a click, record locators, see lint errors as you type.
- **Where:** `local machine`
- **Command:** `Testing → ▶`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template
- **Alternatives:** WebStorm, Cursor
- **Interview question:** How do you find a stable locator?

## Standards we test against

- WCAG 2.2 AA / EN 301 549 — 3sMoneyTests
- OWASP API Security Top 10 — microservices-testing
- ISO/IEC/IEEE 29119-3 — api-test-automation
- OpenAPI 3 — contract-testing-lab
- RFC 9110 (HTTP) — contract-testing-lab
- OAuth 2.0 / RFC 6749, 7636, 9068 — ledger-api-testing
