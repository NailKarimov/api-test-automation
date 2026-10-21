# Toolbox

Every tool used across the portfolio repositories, grouped by stage of work.
Visual, interactive version (map, one CI run step by step, repo matrix, RU/EN): [`docs/toolbox.html`](https://nailkarimov.github.io/api-test-automation/toolbox.html).

Repositories: [api-test-automation](https://github.com/NailKarimov/api-test-automation), [contract-testing-lab](https://github.com/NailKarimov/contract-testing-lab), [microservices-testing](https://github.com/NailKarimov/microservices-testing), [ledger-api-testing](https://github.com/NailKarimov/ledger-api-testing), [api-protocols-testing](https://github.com/NailKarimov/api-protocols-testing), [ai-api-testing](https://github.com/NailKarimov/ai-api-testing), [ui-e2e-testing](https://github.com/NailKarimov/ui-e2e-testing), [3sMoneyTests](https://github.com/NailKarimov/3sMoneyTests), [qa-project-template](https://github.com/NailKarimov/qa-project-template).

## Overview

| Tool                             | Stage                | Kind                            | api-test-automation | contract-testing-lab | microservices-testing | ledger-api-testing | api-protocols-testing | ai-api-testing | ui-e2e-testing | 3sMoneyTests | qa-project-template |
| -------------------------------- | -------------------- | ------------------------------- | ------------------- | -------------------- | --------------------- | ------------------ | --------------------- | -------------- | -------------- | ------------ | ------------------- |
| TypeScript                       | Write tests          | language                        | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| Node.js 22 + npm                 | Write tests          | runtime                         | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| Playwright Test                  | Write tests          | framework                       | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| zod                              | Write tests          | library                         | ✓                   |                      | ✓                     |                    | ✓                     | ✓              |                |              |                     |
| Faker                            | Write tests          | library                         |                     |                      |                       |                    |                       |                |                |              | ✓                   |
| dotenv + GitHub Secrets          | Write tests          | config                          | ✓                   |                      |                       |                    |                       |                | ✓              |              | ✓                   |
| ESLint                           | Keep code clean      | linter                          | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              |              | ✓                   |
| Prettier                         | Keep code clean      | formatter                       | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              |              | ✓                   |
| Husky + lint-staged              | Keep code clean      | git hooks                       | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              |              | ✓                   |
| axe-core                         | Special test types   | accessibility                   |                     |                      |                       |                    |                       |                | ✓              | ✓            |                     |
| Pa11y CI                         | Special test types   | accessibility                   |                     |                      |                       |                    |                       |                | ✓              |              |                     |
| Playwright toHaveScreenshot      | Special test types   | visual regression               |                     |                      |                       |                    |                       |                | ✓              |              |                     |
| Web Vitals (PerformanceObserver) | Special test types   | front-end performance           |                     |                      |                       |                    |                       |                |                | ✓            |                     |
| k6                               | Special test types   | load testing                    |                     |                      | ✓                     |                    |                       |                |                |              |                     |
| Schemathesis                     | Special test types   | property-based / fuzzing        |                     | ✓                    |                       |                    |                       |                |                |              |                     |
| oasdiff                          | Special test types   | contract drift                  |                     | ✓                    |                       |                    |                       |                |                |              |                     |
| Pact                             | Special test types   | consumer-driven contracts       |                     | ✓                    |                       |                    |                       |                |                |              |                     |
| GraphQL (graphql-js)             | Special test types   | GraphQL API testing             | ✓                   |                      |                       |                    |                       |                |                |              |                     |
| GraphQL Inspector                | Special test types   | GraphQL schema drift            | ✓                   |                      |                       |                    |                       |                |                |              |                     |
| Claude API + evals               | Special test types   | LLM endpoint testing            |                     |                      |                       |                    |                       | ✓              |                |              |                     |
| amqplib (RabbitMQ)               | Special test types   | event-driven                    |                     |                      | ✓                     |                    |                       |                |                |              |                     |
| Docker + Docker Compose          | Run the system       | containers                      | ✓                   | ✓                    | ✓                     | ✓                  |                       |                | ✓              |              |                     |
| Sock Shop                        | Run the system       | system under test               |                     |                      | ✓                     |                    |                       |                |                |              |                     |
| OWASP Juice Shop                 | Run the system       | system under test               |                     |                      |                       |                    |                       |                | ✓              |              |                     |
| Testcontainers                   | Run the system       | throw-away dependencies         |                     |                      |                       | ✓                  |                       |                |                |              |                     |
| PostgreSQL + pg                  | Run the system       | database                        |                     |                      |                       | ✓                  |                       |                |                |              |                     |
| Ledger API (Fastify)             | Run the system       | own system under test           |                     |                      |                       | ✓                  |                       |                |                |              |                     |
| OAuth 2.0 + JWT (jose)           | Special test types   | authorization testing           |                     |                      |                       | ✓                  |                       |                |                |              |                     |
| gRPC (grpc-js)                   | Special test types   | RPC over HTTP/2                 |                     |                      |                       |                    | ✓                     |                |                |              |                     |
| WebSocket + SSE (ws)             | Special test types   | live data push                  |                     |                      |                       |                    | ✓                     |                |                |              |                     |
| Model Context Protocol (SDK)     | Special test types   | AI tool server                  |                     |                      |                       |                    |                       | ✓              |                |              |                     |
| MCP Inspector                    | Special test types   | MCP client and debugger         |                     |                      |                       |                    |                       | ✓              |                |              |                     |
| buf                              | Keep code clean      | proto lint and breaking changes |                     |                      |                       |                    | ✓                     |                |                |              |                     |
| xvfb                             | Run the system       | virtual display                 |                     |                      |                       |                    |                       |                |                | ✓            |                     |
| Allure Report                    | Read the results     | reporting                       | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| Playwright HTML report + trace   | Read the results     | debugging                       | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| GitHub Actions                   | Automate and publish | CI/CD                           | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| GitHub Pages                     | Automate and publish | hosting                         | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| Git + GitHub                     | Automate and publish | version control                 | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |
| VS Code                          | Automate and publish | editor                          | ✓                   | ✓                    | ✓                     | ✓                  | ✓                     | ✓              | ✓              | ✓            | ✓                   |

## Write tests

### TypeScript

JavaScript with types. The language all tests and helpers are written in.

- **Why here:** A misspelt field or a wrong argument shows up in the editor, before anything runs. Playwright and most modern frameworks are written in it.
- **Where:** `tsconfig.json, src/, tests/`
- **Command:** `npm run typecheck`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** JavaScript, Python, Java, C#
- **Interview question:** Why types in tests if a test fails at runtime anyway?

### Node.js 22 + npm

The runtime that executes TypeScript/JavaScript outside the browser, plus the npm package manager.

- **Why here:** npm installs every library from package-lock.json in one command, so your machine, CI and an interviewer get the same versions.
- **Where:** `package.json, package-lock.json`
- **Command:** `npm ci`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** pnpm, Yarn, Bun
- **Interview question:** How is npm ci different from npm install?

### Playwright Test

Microsoft's test framework: browser UI tests and API calls (APIRequestContext) in one tool.

- **Why here:** Auto-waiting, parallel runs, retries, projects, fixtures, trace viewer. One framework for UI and API.
- **Where:** `playwright.config.ts, tests/`
- **Command:** `npx playwright test --project=petstore`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** Cypress, Selenium/WebDriver, REST Assured, pytest + requests
- **Interview question:** How do you log in once and reuse it across Playwright tests?

### zod

A schema library: describe what an API response must look like and validate it in one line.

- **Why here:** Contract checks on every response: field types, required fields, enums, ranges. The same schema gives TypeScript its type.
- **Where:** `src/*/schemas.ts, src/support/schema.ts`
- **Command:** `expectSchema(petSchema, res.body)`
- **Repositories:** api-test-automation, microservices-testing, api-protocols-testing, ai-api-testing
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
- **Repositories:** api-test-automation, qa-project-template, ui-e2e-testing
- **Alternatives:** Vault, 1Password CLI, Doppler
- **Interview question:** How do you store tokens and keys for automated tests?

## Keep code clean

### ESLint

A static code analyser. With eslint-plugin-playwright it knows the usual mistakes in tests.

- **Why here:** Catches a forgotten await, test.only, skipped tests and suspicious code before review.
- **Where:** `eslint.config.mjs`
- **Command:** `npm run lint`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** Biome, oxlint
- **Interview question:** Why is a forgotten await in a test dangerous?

### Prettier

Automatic formatting of code, Markdown, YAML and JSON by one set of rules.

- **Why here:** No whitespace arguments in review; a diff shows only real changes.
- **Where:** `.prettierrc.json`
- **Command:** `npm run format:check`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** Biome, dprint
- **Interview question:** What is the difference between a linter and a formatter?

### Husky + lint-staged

A pre-commit git hook that runs ESLint and Prettier on the changed files only.

- **Why here:** Unformatted code never gets committed, so CI does not fail on trivia.
- **Where:** `.husky/pre-commit, package.json → lint-staged`
- **Command:** `git commit (runs automatically)`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** pre-commit (Python), lefthook
- **Interview question:** What belongs in pre-commit and what in CI?

### buf

A tool for .proto files: lint against style rules, and breaking, which compares the contract with its last version.

- **Why here:** In CI and on every PR. On day one lint found RPCs sharing messages, so none could change alone. Self-test: 8 breaking edits caught, adding a field passes.
- **Where:** `buf.yaml, contracts/quotes.v1.binpb, tests/contract`
- **Command:** `npm run proto:lint`
- **Repositories:** api-protocols-testing
- **Alternatives:** protolint, api-linter (Google), manual review
- **Interview question:** Why does renaming a field break JSON clients but not binary ones?

## Special test types

### axe-core

Deque's automated accessibility engine, used through @axe-core/playwright.

- **Why here:** Checks a page against WCAG 2.2 AA rules: contrast, labels, roles, structure. Finds roughly a third of issues; the rest needs manual and keyboard testing.
- **Where:** `3sMoneyTests/tests/a11y`
- **Command:** `npm run test:a11y`
- **Repositories:** 3sMoneyTests, ui-e2e-testing
- **Alternatives:** Pa11y, Lighthouse, WAVE
- **Interview question:** Can accessibility testing be fully automated?

### Pa11y CI

Command-line accessibility checks for a list of pages; HTML_CodeSniffer by default, independent of axe.

- **Why here:** A second opinion next to axe: where engines agree a finding is solid; each difference is reviewed once and recorded as a known defect or a false positive.
- **Where:** `.pa11yci.js, scripts/pa11y-summary.mjs`
- **Command:** `npm run a11y:pa11y`
- **Repositories:** ui-e2e-testing
- **Alternatives:** axe CLI, Lighthouse accessibility, WAVE
- **Interview question:** Why do two accessibility tools report different things, and which do you trust?

### Playwright toHaveScreenshot

Compares a page or element screenshot with an approved baseline pixel by pixel, with masks and a tolerance.

- **Why here:** Catches what functional tests can't see: a shifted button, a changed colour, a missing icon. Baselines are made in Playwright's Docker image so fonts match.
- **Where:** `tests/visual, tests/__screenshots__, playwright.config.ts`
- **Command:** `npm run test:visual`
- **Repositories:** ui-e2e-testing
- **Alternatives:** Percy, Chromatic, Applitools, BackstopJS
- **Interview question:** How do you keep screenshot tests stable without missing small changes?

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

### Claude API + evals

The Claude API (Messages, tool use, structured outputs) through the official TypeScript SDK; evals check the model's behaviour on a set of examples as a share of passing runs.

- **Why here:** fx-assistant on claude-haiku-5-5. The code around the model is tested against a fake Messages API (free, deterministic, 10/10 planted bugs caught); the model with 13 evals × 3 runs: correctness, no invention, prompt injection with a canary, latency and cost budgets.
- **Where:** `services/fx-assistant, src/llm, tests/llm, evals, tests/evals`
- **Command:** `npm run test:llm`
- **Repositories:** ai-api-testing
- **Alternatives:** promptfoo, DeepEval, OpenAI Evals, LangSmith
- **Interview question:** How do you test a system that gives a different answer to the same question?

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

### gRPC (grpc-js)

A way to call another service's functions over HTTP/2. The API is a .proto file, messages are binary, and a call can stream either way.

- **Why here:** Our own quote service with unary, server, client and bidirectional streaming. The tests check status codes, deadlines (the server drops the work), streams without seq gaps, health and reflection. 12 planted bugs caught.
- **Where:** `proto/quotes/v1, services/quotes, tests/grpc`
- **Command:** `npm run test:grpc`
- **Repositories:** api-protocols-testing
- **Alternatives:** grpcurl, Postman gRPC, ghz or k6 for load, Connect
- **Interview question:** How is a gRPC deadline different from an HTTP client timeout?

### WebSocket + SSE (ws)

Two ways a server pushes data itself: WebSocket, a lasting two-way connection, and SSE, an endless HTTP response of events. The ws library for the server and the test client.

- **Why here:** The same quote feed as gRPC. The tests cut the connection and check resume without gaps (since, Last-Event-ID), the heartbeat that finds dead clients, close codes 1001/1002/1008/1009, leaked subscriptions. 14 planted bugs caught.
- **Where:** `services/quotes/src/realtime.ts, src/realtime, tests/realtime`
- **Command:** `npm run test:realtime`
- **Repositories:** api-protocols-testing
- **Alternatives:** Socket.IO, k6 WebSocket module, Playwright page.routeWebSocket, EventSource
- **Interview question:** How does a client know it missed a message, and what does the server do with a half-open connection?

### Model Context Protocol (SDK)

The standard by which AI assistants reach tools and data: tools, resources and prompts over JSON-RPC via stdio or Streamable HTTP. The official TypeScript SDK for the server and the test client.

- **Why here:** Our own currency MCP server. One suite runs over both transports and checks schemas, errors for the model (isError) vs protocol errors, progress and cancellation, scoped tokens, Origin, and tool-poisoning guards. It found a race in the SDK client. 13 of 14 planted bugs caught, the 14th is equivalent.
- **Where:** `services/fx-mcp, src/mcp, tests/mcp, tests/mcp-http`
- **Command:** `npm run test:mcp`
- **Repositories:** ai-api-testing
- **Alternatives:** MCP Inspector by hand, FastMCP (Python), mcp-go
- **Interview question:** How does a tool error (isError) differ from a JSON-RPC error, and why does it matter to a model?

### MCP Inspector

The official MCP debugger: a web UI, a TUI and a CLI that connect to any MCP server.

- **Why here:** An independent client on SDK v2 (spec 2026-07-28) against our v1 server: a compatibility check. It found a pitfall: the CLI turns amount=100 into a number.
- **Where:** `tests/inspector`
- **Command:** `npx mcp-inspector`
- **Repositories:** ai-api-testing
- **Alternatives:** Claude Desktop as a client, custom scripts
- **Interview question:** Why also test the server with someone else's client?

## Run the system

### Docker + Docker Compose

Containers: the system under test starts with one command and behaves the same everywhere. Compose describes several services at once.

- **Why here:** A private Petstore for the functional tests, Pact and fuzzing; 13 Sock Shop containers with MongoDB, MySQL and RabbitMQ; PostgreSQL from Testcontainers. Chaos tests stop containers mid-test.
- **Where:** `infra/petstore, infra/sock-shop, src/ledger/fixtures.ts`
- **Command:** `npm run stack:up`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, ui-e2e-testing
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

### OWASP Juice Shop

OWASP's training web shop on Angular + Material, deliberately insecure; runs from one Docker image.

- **Why here:** A real SPA with registration, basket, checkout and a mobile layout: a full customer journey for UI e2e. 8 UI defects found, including a DOM XSS and nameless buttons.
- **Where:** `.github/workflows/tests.yml (service container), npm run shop:up`
- **Command:** `npm run shop:up && npm test`
- **Repositories:** ui-e2e-testing
- **Alternatives:** Sauce Demo, Conduit (RealWorld), your own app in Docker
- **Interview question:** How do you keep UI tests independent when they share one database?

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
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** ReportPortal, Playwright HTML report, TestRail
- **Interview question:** Which report metrics do you show the team?

### Playwright HTML report + trace

Playwright's built-in report; for UI, a trace: a step-by-step recording of actions, DOM, network and console.

- **Why here:** A failed test can be debugged without re-running it: open the trace and see the page at every step.
- **Where:** `playwright-report/ (CI artifact)`
- **Command:** `npx playwright show-report`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** videos and screenshots, Cypress Cloud
- **Interview question:** How do you debug a test that fails only in CI?

## Automate and publish

### GitHub Actions

CI built into GitHub: workflow files say when and how tests run.

- **Why here:** Runs on every push and PR, nightly on a schedule, and manually with a chosen suite. Annotations and a summary show on the run page.
- **Where:** `.github/workflows/*.yml`
- **Command:** `push → Actions`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** GitLab CI, Jenkins, TeamCity, Azure DevOps
- **Interview question:** Which tests run on a PR and which nightly?

### GitHub Pages

Free static hosting from the gh-pages branch; peaceiris/actions-gh-pages publishes to it.

- **Why here:** The Allure report, the Schemathesis report and the visual guides open from a link, no download needed. Handy in an interview.
- **Where:** `gh-pages branch`
- **Command:** `nailkarimov.github.io/api-test-automation`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** Netlify, S3, ReportPortal
- **Interview question:** How do you keep Allure history between CI runs?

### Git + GitHub

Version control and repository hosting. SSH key login, 2FA.

- **Why here:** Change history, review, a public portfolio. Every commit triggers CI.
- **Where:** `github.com/NailKarimov`
- **Command:** `git push`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** GitLab, Bitbucket
- **Interview question:** Why is force-pushing a shared branch dangerous?

### VS Code

The editor, with the ESLint, Prettier and Playwright Test extensions.

- **Why here:** Run and debug a single test with a click, record locators, see lint errors as you type.
- **Where:** `local machine`
- **Command:** `Testing → ▶`
- **Repositories:** api-test-automation, contract-testing-lab, microservices-testing, ledger-api-testing, 3sMoneyTests, qa-project-template, api-protocols-testing, ai-api-testing, ui-e2e-testing
- **Alternatives:** WebStorm, Cursor
- **Interview question:** How do you find a stable locator?

## Standards we test against

- WCAG 2.2 AA / EN 301 549 — 3sMoneyTests
- OWASP API Security Top 10 — microservices-testing
- ISO/IEC/IEEE 29119-3 — api-test-automation
- OpenAPI 3 — contract-testing-lab
- RFC 9110 (HTTP) — contract-testing-lab
- OAuth 2.0 / RFC 6749, 7636, 9068 — ledger-api-testing
- gRPC status codes, gRPC Health Checking Protocol — api-protocols-testing
- Model Context Protocol 2025-11-25, RFC 9728 — ai-api-testing
- OWASP Top 10 for LLM Applications (prompt injection) — ai-api-testing
