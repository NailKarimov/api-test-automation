# api-test-automation

[![Tests](https://github.com/NailKarimov/api-test-automation/actions/workflows/tests.yml/badge.svg)](https://github.com/NailKarimov/api-test-automation/actions/workflows/tests.yml)
[![Allure report](https://img.shields.io/badge/report-Allure-orange)](https://nailkarimov.github.io/api-test-automation/)

API test automation for public REST and GraphQL APIs. One framework, three systems under test:

- **[OpenWeather API](https://openweathermap.org/api)** — read-only API with live data: contract validation,
  boundary values, unit conversions, authentication, geocoding, forecast and air quality.
- **[Swagger Petstore v3](https://petstore3.swagger.io)** — CRUD API with an OpenAPI document: full resource
  lifecycle, search, input validation, negative tests, and checks of the server against its own contract. Runs
  against a **private Petstore container** (`infra/petstore`), not the shared public sandbox — see
  [`docs/test-environments.md`](docs/test-environments.md).
- **[Rick and Morty API](https://rickandmortyapi.com/documentation)** — GraphQL: field selection, pagination,
  errors, security limits, a REST-twin oracle and schema drift.

**Playwright (API testing) + TypeScript + zod + Allure + Docker**, run daily in **GitHub Actions**.

## Moved to their own repositories (18.10.2026)

This repository used to hold the whole portfolio. Each larger topic now lives on its own, with its history:

| Repository                                                                    | What moved there                                                                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [contract-testing-lab](https://github.com/NailKarimov/contract-testing-lab)   | Schemathesis (property-based fuzzing), oasdiff (contract drift), Pact (consumer-driven contracts) on Petstore |
| [microservices-testing](https://github.com/NailKarimov/microservices-testing) | Sock Shop: service and end-to-end tests, chaos, RabbitMQ events, OWASP API Top 10, k6 load tests              |
| [ledger-api-testing](https://github.com/NailKarimov/ledger-api-testing)       | our own Ledger API on PostgreSQL with Testcontainers: atomicity, idempotency, concurrency                     |

## Toolbox

All tools used across the portfolio, by stage of work, with why each one is here and where it lives:
[`docs/toolbox.md`](docs/toolbox.md) · interactive map
[`docs/toolbox.html`](https://nailkarimov.github.io/api-test-automation/toolbox.html).

## What is tested

### OpenWeather (`tests/openweather/`)

| Area            | Spec                   | Technique                             | Examples                                                                                                          |
| --------------- | ---------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Current weather | `current-weather.spec` | Contract testing                      | Schema with physical ranges; by coordinates and by city; unknown city → 404; `lang=de`; `mode=xml`; response time |
| Coordinates     | `coordinates.spec`     | Boundary value analysis               | lat ±90, lon ±180 → 200; ±0.01 outside → 400; non-numeric → 400                                                   |
| Units           | `units.spec`           | Decision table                        | K − 273.15 = °C, °F = °C × 9/5 + 32, mph = m/s × 2.23694 for the same measurement                                 |
| Authentication  | `auth.spec`            | Negative testing                      | No key / invalid key → 401 on weather and geocoding                                                               |
| Geocoding       | `geocoding.spec`       | Equivalence partitioning, consistency | `limit` 1/3/5; unknown place → `[]`; Latvian local name; geocoding ↔ weather agree                                |
| Forecast        | `forecast.spec`        | Data invariants                       | 40 steps, exactly 3 h apart; `cnt` 1/8/40; first step not in the past                                             |
| Air pollution   | `air-pollution.spec`   | Contract testing                      | AQI 1–5; all main pollutants present and non-negative                                                             |

### Swagger Petstore (`tests/petstore/`)

| Area             | Spec                    | Technique                         | Examples                                                                                                         |
| ---------------- | ----------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Pet CRUD         | `pet-crud.spec`         | State transition, lifecycle       | create → read → replace (PUT) → patch (form) → delete → 404; minimal body; idempotent DELETE; unicode round trip |
| Input validation | `pet-validation.spec`   | Negative testing, equivalence     | unknown id → 404; `abc` → 400; malformed JSON → 400; `text/plain` → 415                                          |
| Search           | `pet-search.spec`       | Equivalence partitioning, oracle  | `findByStatus` for each status; a new pet appears and moves between statuses; `findByTags`; invalid status → 400 |
| User and store   | `user-and-store.spec`   | Negative testing, known defects   | login / logout session; store and user-write endpoints currently answer 500 (documented, see below)              |
| API contract     | `openapi-contract.spec` | Contract testing against the spec | `openapi.json` is served; every operation the suite uses is declared; `Pet` required fields and status enum      |

**Known defects.** Tests that describe behaviour required by the OpenAPI document but not delivered by the
server are marked with `test.fail()` and a `DEF-n` id. They stay green while the defect exists and
turn red the moment the server is fixed, so the marker can be removed. See
[`docs/test-report.md`](docs/test-report.md).

### Bruno collection (`collections/petstore/`)

The same private Petstore as a [Bruno](https://www.usebruno.com/) collection: 18 requests in plain-text `.bru`
files (pet lifecycle chained by runtime variables, validation, store), 27 assertions and 9 tests, run headless in CI
with `bru run`; results go to Allure (JUnit XML) and to Bruno's own HTML report. Two lessons from building it:
axios under Bruno silently turns a malformed JSON body into a valid JSON string (fixed with `Application/JSON`), and a
status-filter bug survived until the data held a pet the filter had to leave out. 5/5 planted server bugs caught.
Read more: [`docs/bruno.md`](docs/bruno.md) · visual guide
[`docs/bruno.html`](https://nailkarimov.github.io/api-test-automation/bruno.html). Run: `npm run test:bruno`.

### GraphQL (`tests/graphql/`)

34 tests against the public [Rick and Morty API](https://rickandmortyapi.com/documentation): field selection,
variables, aliases, fragments, pagination boundaries, filters, the `errors` array (validation, syntax, variables),
security (depth limit 4/5 boundary, introspection, batching, a 200-alias query, field-name suggestions), a REST-twin
oracle (GraphQL and `/api/...` must agree), and schema drift with GraphQL Inspector against
`contracts/rickandmorty/schema.graphql`. Findings: **GQL-2** no query cost limit, **GQL-3** field-name suggestions,
**GQL-5** syntax errors answered by the Stellate edge cache without a location. The client is polite to the
rate-limited service (spacing, waits out a 429). Read more: [`docs/graphql.md`](docs/graphql.md) · visual guide
[`docs/graphql.html`](https://nailkarimov.github.io/api-test-automation/graphql.html). Run: `npm run test:graphql`.

### Security headers (`tests/security/`)

One spec runs the same checks against the public OpenWeather and Petstore deployments: HSTS, `X-Content-Type-Options`, `X-Powered-By`,
version in the `Server` header, CORS (no `*` with credentials, no reflected origin), `OPTIONS` that does not
describe the API, and error bodies without stack traces or class names. Findings the servers currently have
are marked `test.fail()` with a `SEC-n` id (for example Petstore: no HSTS, `Server: Jetty(9.4.53…)`, WADL on
`OPTIONS`; OpenWeather: `Allow-Origin: *` with `Allow-Credentials: true`). Run: `npm run test:security`.

### Helpers

| Spec                        | What it checks                                 |
| --------------------------- | ---------------------------------------------- |
| `tests/unit/redact.spec.ts` | The API key never appears in the public report |

Test design, scope, risks and exit criteria: [`docs/test-plan.md`](docs/test-plan.md).

## Design decisions

- **Contracts as code.** Response schemas (zod) live next to each API (`src/openweather/schemas.ts`,
  `src/petstore/schemas.ts`) and include physical or business limits — a humidity of 140 % fails the contract,
  not only a missing field.
- **One HTTP client, one client class per API.** `ApiClient` knows nothing about a specific API; `WeatherClient`
  and `PetstoreClient` expose one method per endpoint. Playwright projects give each API its own `baseURL`.
- **Live data, stable tests.** Weather changes every few minutes, so cross-request comparisons
  (units, translations) run only when the responses share the same measurement time `dt`.
- **Own environment, isolated tests.** The Petstore suite runs against a private container that starts clean in
  every CI run; every test still creates its own pet with a unique id and removes it afterwards. On the shared
  public sandbox three "defects" (DEF-3…5) turned out to be environment problems
  ([`docs/test-environments.md`](docs/test-environments.md)).
- **The key never leaves the secret store.** `OPENWEATHER_API_KEY` comes from `.env` locally and from a
  repository secret in CI. Every request is attached to the Allure report with `appid=***`.
- **Gentle on third-party APIs.** About 100 requests per run, two workers, one daily scheduled run.
  No load testing against production services. The GraphQL client spaces its requests and waits out a 429.

## Project structure

```
config/env.ts              base URLs and secrets from the environment
src/api/ApiClient.ts       generic HTTP client: GET/POST/PUT/DELETE, redacted request/response in the report
src/openweather/           WeatherClient, zod contracts, reference locations
src/petstore/              PetstoreClient, zod contracts, test data builders
src/graphql/               GraphQLClient (polite to the rate limit), zod contracts
src/fixtures.ts            `weather`, `petstore` and `graph` fixtures injected into tests
tests/openweather/         OpenWeather specs
tests/petstore/            Petstore specs (private container)
tests/graphql/             GraphQL specs, schema drift with GraphQL Inspector
tests/security/            security headers of the public deployments
tests/unit/                unit tests of helpers
infra/petstore/            Docker Compose file of the private Petstore
contracts/rickandmorty/    approved GraphQL schema
docs/                      test plan, test summary report, guides, toolbox, static sample of the Allure report
```

## Running locally

Requirements: Node.js 22+, Java 17+ (for the Allure CLI), Docker for the private Petstore. OpenWeather tests also
need a free API key; Petstore and GraphQL need nothing.

```bash
npm ci
cp .env.example .env       # then put your key into OPENWEATHER_API_KEY
npm run petstore:up        # private Petstore on http://localhost:8090
npm test                   # everything
npm run test:openweather   # OpenWeather only
npm run test:petstore      # Petstore only (needs the container, no key)
npm run test:graphql       # GraphQL only
npm run test:smoke         # @smoke tests only
npm run petstore:down
npm run lint && npm run typecheck
npm run allure:generate && npm run allure:open
```

In CI the key is the repository secret `OPENWEATHER_API_KEY`
(Settings → Secrets and variables → Actions).

## Tech stack

Playwright Test (APIRequestContext) · TypeScript · zod · graphql-js · GraphQL Inspector · Docker Compose · Allure Report · ESLint · Prettier · husky · GitHub Actions

## Allure report

Every test gets `owner`, `layer`, `epic` (system under test) and `severity` (`@smoke` and `@security` are
critical) automatically from a fixture in [`src/fixtures.ts`](src/fixtures.ts). `npm run allure:generate` first
runs [`scripts/allure-prepare.mjs`](scripts/allure-prepare.mjs), which adds failure
[categories](allure/categories.json) (known defects, fixed defects, security findings, infrastructure, product
and test defects), the environment block and, in CI, a link to the run. Run history is restored from
`gh-pages`, so the report shows trends.
