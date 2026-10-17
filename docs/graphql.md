# GraphQL testing on the Rick and Morty API

Visual version (field picker vs REST, the four layers a request passes, depth boundary, findings, RU/EN):
[`docs/graphql.html`](https://nailkarimov.github.io/api-test-automation/graphql.html).

## What it is

GraphQL has **one endpoint** (`/graphql`). The client sends a query document and gets exactly the fields it asked
for. For a tester this changes the basics:

|                  | REST                           | GraphQL                                                    |
| ---------------- | ------------------------------ | ---------------------------------------------------------- |
| URL              | one per resource               | a single `/graphql`                                        |
| Method           | GET/POST/PUT/DELETE by meaning | almost always POST (GET for caching)                       |
| "Not found"      | 404                            | 200 with `data: null`                                      |
| A bad request    | 400 with an error body         | an `errors` array; HTTP 400 or 200 depending on the server |
| What to assert   | status + body                  | always `data` and `errors`; the status is secondary        |
| Contract         | OpenAPI → oasdiff              | SDL schema → GraphQL Inspector                             |
| Load per request | predictable                    | depends on depth and aliases → needs limits                |

System under test: the public [Rick and Morty API](https://rickandmortyapi.com/documentation). It has a **REST twin**
with the same data (`/api/character/…`), which gives a free test oracle.

## What is tested (`tests/graphql/`, 34 tests, project `graphql`)

| Spec                    | Technique                                 | Examples                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `queries.spec`          | GraphQL features                          | exactly the requested fields and nothing else; variables = inline arguments; aliases; fragments; nested data in one round trip; `charactersByIds`; unknown id → `data: null`, no error, HTTP 200; the same query over GET |
| `pagination.spec`       | boundary values, equivalence partitioning | first page (20, `next = 2`, `prev = null`, `pages = ceil(count / 20)`); last page holds the remainder; a page after the last → empty; each status filter; case-insensitive name filter; no match → empty, not an error    |
| `errors.spec`           | negative testing                          | unknown field → `GRAPHQL_VALIDATION_FAILED`, no `data`; syntax error; missing or wrong-typed variable; non-JSON body; no stack trace in errors                                                                            |
| `security.spec`         | OWASP API4, information disclosure        | depth limit (4 runs, 5 is rejected); introspection; batching; 200 aliases (cost limit); field-name suggestions                                                                                                            |
| `rest-consistency.spec` | test oracle                               | characters 1, 2, 183 field by field; number of dead characters; number of episodes — GraphQL vs REST                                                                                                                      |
| `schema-drift.spec`     | contract testing                          | live schema (introspection) vs `contracts/rickandmorty/schema.graphql`, diffed with GraphQL Inspector; breaking changes fail                                                                                              |

The client is `src/graphql/GraphQLClient.ts` (on top of `ApiClient`, so every request and response is attached to
the Allure report); response contracts are zod schemas in `src/graphql/schemas.ts`.

**Politeness.** The service is behind Cloudflare rate limiting (HTTP 429, error 1015, `retry_after: 30`). The first
CI run hit it. The client now spaces requests (700 ms per worker, `GRAPHQL_MIN_INTERVAL_MS`) and waits out a 429
once instead of hammering the service; the project has a 120 s test timeout to allow for that.

## Findings (CI, 17.10.2026)

**The setup differs from the source code.** The public source (2022) shows a single Apollo Server. The responses
show **four layers**: Cloudflare (rate limit) → **Stellate**, a GraphQL edge cache (`extensions.stellate`) →
Apollo Server (validation, `GRAPHQL_VALIDATION_FAILED`) → the REST API and its database. Each layer answers different
bad requests, so the same "bad query" can come back in three different shapes.

| Id    | Level       | Finding                                                                                                                                                                          |
| ----- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GQL-2 | defect      | **No cost / alias limit.** 200 aliases of one field in one query return 200; only depth is limited (OWASP API4: unrestricted resource consumption). Recorded with `test.fail()`. |
| GQL-3 | observation | **Field-name suggestions**: `Cannot query field "nam" … Did you mean "name"?`. With introspection off this still lets a schema be mapped. Recorded with `test.fail()`.           |
| GQL-5 | observation | **Syntax errors are answered by the edge** with a generic message ("The request did not contain a valid GraphQL request") and no line or column.                                 |
| GQL-1 | by design   | **Introspection is enabled.** Fine for a public demo; it would be a finding on a private API.                                                                                    |
| —     | protection  | **Batching is rejected** by Stellate (400, "Batch queries and APQ request are not currently supported").                                                                         |
| —     | protection  | **Depth limit**: depth 4 runs, depth 5 is rejected ("Query depth limit exceeded."; not the wording of `graphql-depth-limit`, so most likely enforced at the edge).               |
| —     | consistent  | GraphQL and REST agree on every compared field and count.                                                                                                                        |
| —     | consistent  | Validation errors use HTTP **400** with `GRAPHQL_VALIDATION_FAILED`; an unknown id is HTTP 200 with `data: null`.                                                                |

**Schema drift**: 0 breaking, 0 dangerous, 11 non-breaking changes. All 11 come from Apollo Server 2 itself
(`@cacheControl` directive, `CacheControlScope` enum, `Upload` scalar), which the hand-written SDL does not contain.

## Running it

```bash
npm run test:graphql                                  # 34 tests, about a minute
GRAPHQL_MIN_INTERVAL_MS=1500 npm run test:graphql     # even politer if you hit 429
```

## Terms

| Term                  | Meaning                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Query / mutation      | reading data / changing it (this API has queries only)                                          |
| Schema / SDL          | every type and field in GraphQL's schema language; the GraphQL contract                         |
| Variables             | parameters sent apart from the query text (`$id`)                                               |
| Alias                 | a custom name for a field in the answer; lets one field be asked for many times                 |
| Fragment              | a named set of fields reused in several places                                                  |
| Introspection         | the `__schema` query that returns the API's own schema                                          |
| Depth / cost limit    | limits on nesting and on a query's "cost", against overload by a single request                 |
| Batching / APQ        | several operations in one HTTP request / sending a hash of a known document instead of its text |
| Over-fetching         | receiving data the client does not need, a typical REST problem GraphQL solves                  |
| Edge cache (Stellate) | a cache at the network edge that understands GraphQL and answers before the origin              |
