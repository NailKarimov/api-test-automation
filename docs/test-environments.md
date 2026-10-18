# Test environments: shared sandbox vs private container

Visual version (before/after timeline, which defect reproduces where, what still uses the sandbox, RU/EN):
[`docs/test-environments.html`](https://nailkarimov.github.io/api-test-automation/test-environments.html).

## The decision

Since 18.10.2026 the Petstore suite (`tests/petstore`, 33 tests) runs against a **private Petstore container**
(`infra/petstore`, `swaggerapi/petstore3:unstable`, `http://localhost:8090/api/v3/`) instead of the public sandbox
`petstore3.swagger.io`. The container starts clean in every CI run (`tests.yml` already starts it for Pact) and is
removed at the end. Locally: `npm run fuzz:up`; without it the Petstore tests are skipped, in CI they fail
(`REQUIRE_STACK=1`). `PETSTORE_BASE_URL` points the suite elsewhere when needed.

## Why: the sandbox was making the results about other people

A shared public sandbox has three properties that a test environment must not have: its **data** is changed by
strangers, its **state** changes without notice, and its **version** is not ours to choose. Every one of them
turned the build red in the week before the move, with no change in our code:

| Date            | Failure                                                                    | Cause                                                                              |
| --------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 15.10           | `findByStatus=sold` returned no pets                                       | nobody happened to have a sold pet at that moment                                  |
| 17.10           | `findByStatus=available` broke the `Pet` schema; `findByTags` answered 500 | someone stored a pet without `name` / with broken tags (possible because of DEF-1) |
| 18.10 (nightly) | DEF-3 and DEF-4 "expected to fail, but passed"                             | the sandbox suddenly started answering `/store/*` correctly                        |

The first two were patched in the tests (own data, tolerant search checks, DEF-7 skips). The third showed the
real problem: the known-defect markers described the sandbox's condition, not the code.

## Re-checking the defects on a clean environment

| Id                                        | Public sandbox (until 17.10)  | Private container (18.10)          | Verdict                        |
| ----------------------------------------- | ----------------------------- | ---------------------------------- | ------------------------------ |
| DEF-1 `POST /pet` without `name` accepted | reproduces                    | reproduces                         | **code defect**, kept          |
| DEF-2 any `status` string accepted        | reproduces                    | reproduces                         | **code defect**, kept          |
| DEF-3 `GET /store/inventory` → 500        | reproduced, then 200 on 18.10 | 200                                | **closed**: environment issue  |
| DEF-4 `POST /store/order` → 500           | reproduced, then 200 on 18.10 | 200                                | **closed**: environment issue  |
| DEF-5 `POST /user` → 500                  | reproduces                    | 200                                | **closed**: environment issue  |
| DEF-6 status update needs `name`          | reproduces                    | reproduces                         | **code defect**, kept          |
| DEF-7 search returns invalid records      | depended on strangers' data   | depends only on our own DEF-1 test | kept as a consequence of DEF-1 |

The three closed tests now check the documented behaviour directly (inventory counts are non-negative integers,
an order and a user are echoed back) and would turn red if the 500s came back on our own environment.

First CI run after the move: **221 passed, 1 skipped, 0 failed**, against 1–3 sandbox-caused failures in each of the
three runs listed above.

## What still uses the public sandbox, on purpose

| Check                                                      | Why the public deployment                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Security headers (`tests/security`, `PETSTORE_PUBLIC_URL`) | TLS, HSTS and the `Server` header are properties of the deployment, not of the code; the local container has no TLS |
| Contract watch (`contract.yml`, report only)               | to see when the public spec changes (it serves 1.0.27, the container 1.0.17)                                        |

## The price of a private copy

- **We test the image's version, not the live one.** The `unstable` image serves spec 1.0.17 while the public
  sandbox runs 1.0.27 (found by oasdiff, see `docs/contract-drift.md`). The contract watch keeps that gap visible.
- **One more container in CI** (about 10 seconds to start).
- **Nothing to share.** A container proves the code works; the sandbox showed how a real shared deployment
  behaves. That is why the deployment-level checks above stay on the sandbox.

## Rule of thumb

Test the **code** on an environment you control and reset; test the **deployment** (headers, TLS, rate limits,
availability) on the deployment itself, and keep those checks separate so one cannot hide the other.
