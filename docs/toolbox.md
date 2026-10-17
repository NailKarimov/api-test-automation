# Toolbox

Every tool used across the portfolio repositories, grouped by stage of work.
Visual, interactive version (map, one CI run step by step, repo matrix, RU/EN): [`docs/toolbox.html`](https://nailkarimov.github.io/api-test-automation/toolbox.html).

Repositories: [api-test-automation](https://github.com/NailKarimov/api-test-automation), [3sMoneyTests](https://github.com/NailKarimov/3sMoneyTests), [qa-project-template](https://github.com/NailKarimov/qa-project-template).

## Overview

| Tool                             | Stage                | Kind                     | api-test-automation | 3sMoneyTests | qa-project-template |
| -------------------------------- | -------------------- | ------------------------ | ------------------- | ------------ | ------------------- |
| TypeScript                       | Write tests          | language                 | ✓                   | ✓            | ✓                   |
| Node.js 22 + npm                 | Write tests          | runtime                  | ✓                   | ✓            | ✓                   |
| Playwright Test                  | Write tests          | framework                | ✓                   | ✓            | ✓                   |
| zod                              | Write tests          | library                  | ✓                   |              |                     |
| Faker                            | Write tests          | library                  |                     |              | ✓                   |
| dotenv + GitHub Secrets          | Write tests          | config                   | ✓                   |              | ✓                   |
| ESLint                           | Keep code clean      | linter                   | ✓                   |              | ✓                   |
| Prettier                         | Keep code clean      | formatter                | ✓                   |              | ✓                   |
| Husky + lint-staged              | Keep code clean      | git hooks                | ✓                   |              | ✓                   |
| axe-core                         | Special test types   | accessibility            |                     | ✓            |                     |
| Web Vitals (PerformanceObserver) | Special test types   | front-end performance    |                     | ✓            |                     |
| k6                               | Special test types   | load testing             | ✓                   |              |                     |
| Schemathesis                     | Special test types   | property-based / fuzzing | ✓                   |              |                     |
| amqplib (RabbitMQ)               | Special test types   | event-driven             | ✓                   |              |                     |
| Docker + Docker Compose          | Run the system       | containers               | ✓                   |              |                     |
| Sock Shop                        | Run the system       | system under test        | ✓                   |              |                     |
| xvfb                             | Run the system       | virtual display          |                     | ✓            |                     |
| Allure Report                    | Read the results     | reporting                | ✓                   | ✓            | ✓                   |
| Playwright HTML report + trace   | Read the results     | debugging                | ✓                   | ✓            | ✓                   |
| GitHub Actions                   | Automate and publish | CI/CD                    | ✓                   | ✓            | ✓                   |
| GitHub Pages                     | Automate and publish | hosting                  | ✓                   | ✓            | ✓                   |
| Git + GitHub                     | Automate and publish | version control          | ✓                   | ✓            | ✓                   |
| VS Code                          | Automate and publish | editor                   | ✓                   | ✓            | ✓                   |

## Write tests

### TypeScript

JavaScript with types. The language all tests and helpers are written in.

- **Why here:** A misspelt field or a wrong argument shows up in the editor, before anything runs. Playwright and most modern frameworks are written in it.
- **Where:** `tsconfig.json, src/, tests/`
- **Command:** `npm run typecheck`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** JavaScript, Python, Java, C#
- **Interview question:** Why types in tests if a test fails at runtime anyway?

### Node.js 22 + npm

The runtime that executes TypeScript/JavaScript outside the browser, plus the npm package manager.

- **Why here:** npm installs every library from package-lock.json in one command, so your machine, CI and an interviewer get the same versions.
- **Where:** `package.json, package-lock.json`
- **Command:** `npm ci`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** pnpm, Yarn, Bun
- **Interview question:** How is npm ci different from npm install?

### Playwright Test

Microsoft's test framework: browser UI tests and API calls (APIRequestContext) in one tool.

- **Why here:** Auto-waiting, parallel runs, retries, projects, fixtures, trace viewer. One framework for UI and API.
- **Where:** `playwright.config.ts, tests/`
- **Command:** `npx playwright test --project=petstore`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** Cypress, Selenium/WebDriver, REST Assured, pytest + requests
- **Interview question:** How do you log in once and reuse it across Playwright tests?

### zod

A schema library: describe what an API response must look like and validate it in one line.

- **Why here:** Contract checks on every response: field types, required fields, enums, ranges. The same schema gives TypeScript its type.
- **Where:** `src/*/schemas.ts, src/support/schema.ts`
- **Command:** `expectSchema(petSchema, res.body)`
- **Repositories:** api-test-automation
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
- **Repositories:** api-test-automation, qa-project-template
- **Alternatives:** Biome, oxlint
- **Interview question:** Why is a forgotten await in a test dangerous?

### Prettier

Automatic formatting of code, Markdown, YAML and JSON by one set of rules.

- **Why here:** No whitespace arguments in review; a diff shows only real changes.
- **Where:** `.prettierrc.json`
- **Command:** `npm run format:check`
- **Repositories:** api-test-automation, qa-project-template
- **Alternatives:** Biome, dprint
- **Interview question:** What is the difference between a linter and a formatter?

### Husky + lint-staged

A pre-commit git hook that runs ESLint and Prettier on the changed files only.

- **Why here:** Unformatted code never gets committed, so CI does not fail on trivia.
- **Where:** `.husky/pre-commit, package.json → lint-staged`
- **Command:** `git commit (runs automatically)`
- **Repositories:** api-test-automation, qa-project-template
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
- **Repositories:** api-test-automation
- **Alternatives:** JMeter, Gatling, Locust, Artillery
- **Interview question:** Why p95 and not the average response time?

### Schemathesis

Generates thousands of requests from an OpenAPI spec and checks the server conforms to it.

- **Why here:** Found 83 spec violations in Petstore (FZ-1 … FZ-8). The baseline separates known defects from new ones.
- **Where:** `fuzz/, fuzz.yml, docs/schemathesis.md`
- **Command:** `npm run fuzz`
- **Repositories:** api-test-automation
- **Alternatives:** RESTler, Dredd, EvoMaster
- **Interview question:** How is a property-based test different from a regular one?

### amqplib (RabbitMQ)

A client for the RabbitMQ message broker. Tests read the shipping-task queue directly.

- **Why here:** Verifies the asynchronous side effect of an order: exactly one message, and no silent loss when the broker is down (SS-17, SS-18).
- **Where:** `src/sockshop/queue.ts, tests/sockshop-events`
- **Command:** `npm run test:sockshop`
- **Repositories:** api-test-automation
- **Alternatives:** Kafka clients, Testcontainers modules
- **Interview question:** How do you test asynchronous behaviour without sleep?

## Run the system

### Docker + Docker Compose

Containers: the system under test starts with one command and behaves the same everywhere. Compose describes several services at once.

- **Why here:** Sock Shop is 13 containers with MongoDB, MySQL and RabbitMQ; a private Petstore for fuzzing. Chaos tests stop containers mid-test.
- **Where:** `infra/sock-shop, infra/petstore`
- **Command:** `npm run stack:up`
- **Repositories:** api-test-automation
- **Alternatives:** Podman, Kubernetes (kind), Testcontainers
- **Interview question:** Why does a tester need Docker?

### Sock Shop

Weaveworks' microservices demo shop: catalogue, cart, users, orders, payment, shipping.

- **Why here:** A realistic microservices system for end-to-end, load, chaos and event tests. 18 defects found, SS-1 … SS-18.
- **Where:** `infra/sock-shop/docker-compose.yml`
- **Command:** `npm run stack:up`
- **Repositories:** api-test-automation
- **Alternatives:** Online Boutique, eShopOnContainers
- **Interview question:** What changes in testing when moving from a monolith to microservices?

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
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** ReportPortal, Playwright HTML report, TestRail
- **Interview question:** Which report metrics do you show the team?

### Playwright HTML report + trace

Playwright's built-in report; for UI, a trace: a step-by-step recording of actions, DOM, network and console.

- **Why here:** A failed test can be debugged without re-running it: open the trace and see the page at every step.
- **Where:** `playwright-report/ (CI artifact)`
- **Command:** `npx playwright show-report`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** videos and screenshots, Cypress Cloud
- **Interview question:** How do you debug a test that fails only in CI?

## Automate and publish

### GitHub Actions

CI built into GitHub: workflow files say when and how tests run.

- **Why here:** Runs on every push and PR, nightly on a schedule, and manually with a chosen suite. Annotations and a summary show on the run page.
- **Where:** `.github/workflows/*.yml`
- **Command:** `push → Actions`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** GitLab CI, Jenkins, TeamCity, Azure DevOps
- **Interview question:** Which tests run on a PR and which nightly?

### GitHub Pages

Free static hosting from the gh-pages branch; peaceiris/actions-gh-pages publishes to it.

- **Why here:** The Allure report, the Schemathesis report and the visual guides open from a link, no download needed. Handy in an interview.
- **Where:** `gh-pages branch`
- **Command:** `nailkarimov.github.io/api-test-automation`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** Netlify, S3, ReportPortal
- **Interview question:** How do you keep Allure history between CI runs?

### Git + GitHub

Version control and repository hosting. SSH key login, 2FA.

- **Why here:** Change history, review, a public portfolio. Every commit triggers CI.
- **Where:** `github.com/NailKarimov`
- **Command:** `git push`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** GitLab, Bitbucket
- **Interview question:** Why is force-pushing a shared branch dangerous?

### VS Code

The editor, with the ESLint, Prettier and Playwright Test extensions.

- **Why here:** Run and debug a single test with a click, record locators, see lint errors as you type.
- **Where:** `local machine`
- **Command:** `Testing → ▶`
- **Repositories:** api-test-automation, 3sMoneyTests, qa-project-template
- **Alternatives:** WebStorm, Cursor
- **Interview question:** How do you find a stable locator?

## Standards we test against

- WCAG 2.2 AA / EN 301 549 — 3sMoneyTests
- OWASP API Security Top 10 — api-test-automation
- ISO/IEC/IEEE 29119-3 — api-test-automation
- OpenAPI 3 — api-test-automation
- RFC 9110 (HTTP) — api-test-automation
