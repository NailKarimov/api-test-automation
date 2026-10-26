# api-test-automation

[![Tests](https://github.com/NailKarimov/api-test-automation/actions/workflows/tests.yml/badge.svg)](https://github.com/NailKarimov/api-test-automation/actions/workflows/tests.yml)
[![Allure report](https://img.shields.io/badge/report-Allure-orange)](https://nailkarimov.github.io/api-test-automation/)
[![Release](https://img.shields.io/github/v/release/NailKarimov/api-test-automation)](https://github.com/NailKarimov/api-test-automation/releases)

### ▶ Open online

| Page                                                                                            | What it is        |
| ----------------------------------------------------------------------------------------------- | ----------------- |
| **[Allure test report](https://nailkarimov.github.io/api-test-automation/)**                    | latest CI run     |
| [Bruno run report](https://nailkarimov.github.io/api-test-automation/bruno/)                    | latest CI run     |
| [API tests visualized](https://nailkarimov.github.io/api-test-automation/overview.html)         | overview          |
| [GraphQL](https://nailkarimov.github.io/api-test-automation/graphql.html)                       | interactive guide |
| [Bruno collection](https://nailkarimov.github.io/api-test-automation/bruno.html)                | interactive guide |
| [Sandbox or own copy](https://nailkarimov.github.io/api-test-automation/test-environments.html) | interactive guide |
| [Portfolio testing map](https://nailkarimov.github.io/api-test-automation/testing-map.html)     | all 13 projects   |
| [Portfolio toolbox](https://nailkarimov.github.io/api-test-automation/toolbox.html)             | all tools         |

Click these links: opening an `.html` file in the file list shows its source code, GitHub does not run it.

API test automation for REST and GraphQL with **Playwright** and **TypeScript**. One framework covers three
systems under test, and a Bruno collection runs alongside it. This repository also hosts the portfolio's
[toolbox](https://nailkarimov.github.io/api-test-automation/toolbox.html) and
[testing map](https://nailkarimov.github.io/api-test-automation/testing-map.html).

|                        |                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **System under test**  | OpenWeather API (third-party, live data); Swagger Petstore v3 in a private container; Rick and Morty GraphQL API (third-party)                                                                                                                                                                                                                                                        |
| **Language and tools** | TypeScript · Playwright Test (API) · zod · graphql-js · GraphQL Inspector · Bruno · Docker · Allure                                                                                                                                                                                                                                                                                   |
| **Types of testing**   | functional API, contract (zod schemas, OpenAPI), GraphQL, schema drift, security headers, API collections                                                                                                                                                                                                                                                                             |
| **Tests**              | 123 Playwright tests (38 OpenWeather, 33 Petstore, 34 GraphQL, 16 security, 2 unit) + 18 Bruno requests                                                                                                                                                                                                                                                                               |
| **Test quality**       | known defects pinned with `test.fail()` (DEF-n, SEC-n, GQL-n); 5/5 planted bugs caught by the Bruno collection                                                                                                                                                                                                                                                                        |
| **Reports**            | [Allure](https://nailkarimov.github.io/api-test-automation/) · [Bruno](https://nailkarimov.github.io/api-test-automation/bruno/) · guides: [GraphQL](https://nailkarimov.github.io/api-test-automation/graphql.html), [environments](https://nailkarimov.github.io/api-test-automation/test-environments.html), [Bruno](https://nailkarimov.github.io/api-test-automation/bruno.html) |

## What is tested

| Suite                   | Tool                           | What it proves                                                                                                                                                                                                          |
| ----------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/openweather/`    | Playwright + zod               | contracts with physical ranges; boundary coordinates (±90 / ±180 → 200, 0.01 outside → 400); unit conversions as a decision table; 401 without a key; geocoding and weather agree; 40 forecast steps 3 h apart; AQI 1–5 |
| `tests/petstore/`       | Playwright + zod               | the pet lifecycle create → read → replace → patch → delete → 404; validation (404, 400, 415); search by status and tags; user and store; the server against its own OpenAPI document                                    |
| `tests/graphql/`        | Playwright + GraphQL Inspector | field selection, variables, aliases, fragments, paging boundaries, the `errors` array, depth limit 4/5, introspection, batching, a REST-twin oracle, schema drift                                                       |
| `tests/security/`       | Playwright                     | HSTS, `nosniff`, `Server` version, CORS with credentials, `OPTIONS` bodies, error bodies without stack traces, on the public OpenWeather and Petstore                                                                   |
| `collections/petstore/` | Bruno                          | the same private Petstore as 18 plain-text `.bru` requests, run in CI with `bru run`                                                                                                                                    |
| `tests/unit/`           | Playwright                     | the API key never appears in the public report                                                                                                                                                                          |

## Findings

Each defect is also a bug report in [Issues](https://github.com/NailKarimov/api-test-automation/issues?q=is%3Aissue+label%3Abug); DEF-3…5 are closed as environment issues.

| ID                  | System         | Summary                                                                                                                       |
| ------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| DEF-1, DEF-2        | Petstore       | required fields and the `status` enum are not enforced on `POST /pet`                                                         |
| DEF-6               | Petstore       | `POST /pet/{id}?status=sold` demands a name the spec says is optional                                                         |
| DEF-3…5             | Petstore       | closed: errors of the **shared public sandbox**, not of the server ([`docs/test-environments.md`](docs/test-environments.md)) |
| SEC-1…3             | OpenWeather    | no HSTS, no `nosniff`; `Allow-Origin: *` together with `Allow-Credentials: true`                                              |
| SEC-4…8             | Petstore       | no HSTS, no `nosniff`; the Jetty version in `Server`; WADL on `OPTIONS`; `java.lang.Long` in error text                       |
| GQL-2, GQL-3, GQL-5 | Rick and Morty | no query cost limit; field-name suggestions; syntax errors from the edge cache without a location                             |
| —                   | Bruno          | axios under Bruno silently turned a malformed JSON body into a valid JSON string; fixed with `Application/JSON`               |

## Running it

Requirements: Node.js 22+, Docker for the private Petstore, Java 17+ for a local Allure report. The OpenWeather
tests also need a free API key in `.env`.

```bash
npm ci
cp .env.example .env       # then put your key into OPENWEATHER_API_KEY
npm run petstore:up        # private Petstore on http://localhost:8090
npm test                   # everything
npm run test:openweather   # OpenWeather only
npm run test:petstore      # Petstore only (no key needed)
npm run test:graphql       # GraphQL only
npm run test:bruno         # the Bruno collection
npm run petstore:down
npm run allure:generate && npm run allure:open
```

## Project structure

```text
config/env.ts              base URLs and secrets from the environment
src/api/ApiClient.ts       generic HTTP client; requests and responses in the report, the key redacted
src/openweather/, src/petstore/, src/graphql/   one client and zod contracts per API
src/fixtures.ts            weather, petstore and graph fixtures; Allure labels
tests/                     specs by system under test
collections/petstore/      the Bruno collection
infra/petstore/            Docker Compose file of the private Petstore
contracts/rickandmorty/    the approved GraphQL schema
docs/                      test plan, test report, guides, toolbox, testing map
```

## Design decisions

- **Contracts as code.** The zod schemas include physical and business limits, so a humidity of 140 % fails the
  contract, not only a missing field.
- **Live data, stable tests.** Weather changes every few minutes. Comparisons across requests (units,
  translations) run only when the responses share the same measurement time `dt`.
- **Own environment, isolated tests.** Petstore runs as a private container that starts clean. On the shared
  public sandbox, three "defects" turned out to be environment problems.
- **Gentle on third-party APIs.** About 100 requests per run on two workers, and one scheduled run a day. The
  GraphQL client spaces its requests and waits out a 429.
- **The key never leaves the secret store.** Every request is attached to the report with `appid=***`.

## CI

`.github/workflows/tests.yml` runs on push, pull request, nightly at 03:00 UTC and on demand:

1. It starts the private Petstore.
2. It runs lint, format and typecheck.
3. It runs the Playwright tests (with the `OPENWEATHER_API_KEY` secret) and the Bruno collection.
4. It publishes Allure with history, categories and the Bruno HTML report to GitHub Pages, together with the
   guides, the toolbox and the testing map.

Releases: committing `.github/releases/<tag>.md` runs the Release workflow, which creates the tag and the GitHub release with that file as its notes.

## Documentation

| Document                                                                                                                                      | What it is                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`docs/test-plan.md`](docs/test-plan.md)                                                                                                      | test plan (ISO/IEC/IEEE 29119-3): OpenWeather, Petstore, security headers        |
| [`docs/test-report.md`](docs/test-report.md)                                                                                                  | test summary report: latest run, DEF-n and SEC-n defects, observations           |
| [`docs/overview.html`](https://nailkarimov.github.io/api-test-automation/overview.html)                                                       | visual overview of the OpenWeather and Petstore tests: request, contract, checks |
| [`docs/test-environments.md`](docs/test-environments.md) · [visual](https://nailkarimov.github.io/api-test-automation/test-environments.html) | the shared sandbox vs a private container, and what it changed                   |
| [`docs/graphql.md`](docs/graphql.md) · [visual](https://nailkarimov.github.io/api-test-automation/graphql.html)                               | GraphQL: errors inside 200, depth limits, schema drift                           |
| [`docs/bruno.md`](docs/bruno.md) · [visual](https://nailkarimov.github.io/api-test-automation/bruno.html)                                     | the Bruno collection: `.bru` anatomy, CI, the axios trap, planted bugs           |
| [`docs/toolbox.md`](docs/toolbox.md) · [visual](https://nailkarimov.github.io/api-test-automation/toolbox.html)                               | every tool of the portfolio, by stage of work                                    |
| [`docs/testing-map.html`](https://nailkarimov.github.io/api-test-automation/testing-map.html)                                                 | the portfolio map: type of testing → standard → repository → report              |
| [`docs/sample-report/`](docs/sample-report/)                                                                                                  | a static sample of the Allure report                                             |

## Part of a portfolio

One of 13 test automation projects by [Nail Karimov](https://github.com/NailKarimov):
[all projects](https://github.com/NailKarimov) ·
[testing map](https://nailkarimov.github.io/api-test-automation/testing-map.html) ·
[toolbox](https://nailkarimov.github.io/api-test-automation/toolbox.html).
