# Test summary report — OpenWeather API

Structure follows ISO/IEC/IEEE 29119-3 (test completion report), shortened.

- **Date:** 13.10.2026
- **System under test:** OpenWeather API, free plan (`https://api.openweathermap.org`)
- **Allure report:** https://nailkarimov.github.io/openweather-api-tests/

## 1. Summary

All 40 tests pass. The endpoints in scope return responses that match their contracts, accept
boundary coordinates, reject out-of-range input with 400 and invalid keys with 401, and convert
units consistently. No defects were found; three observations about API behaviour shaped the
test design and are listed below.

## 2. Results

| Metric                        | Value                                 |
| ----------------------------- | ------------------------------------- |
| Tests run                     | 40 (38 API + 2 unit)                  |
| Passed / failed / skipped     | 40 / 0 / 0                            |
| Pass rate                     | 100 %                                 |
| Flaky tests (passed on retry) | 0                                     |
| Test execution time           | ≈ 2.3 s (2 workers)                   |
| API calls per run             | ≈ 50 (free plan limit: 60 per minute) |

## 3. Coverage

| Endpoint                              | Tests | Techniques                                                                                 |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------ |
| `/data/2.5/weather`                   | 16    | contract, boundary values (10), missing parameter, unknown city, `mode=xml`, response time |
| `/data/2.5/forecast`                  | 10    | contract, invariants (40 steps × 3 h), `cnt` 1/8/40, units decision table (4), `lang=de`   |
| `/geo/1.0/direct`, `/geo/1.0/reverse` | 8     | equivalence partitioning (`limit`), empty result, local names, consistency with weather    |
| `/data/2.5/air_pollution`             | 1     | contract (AQI 1–5, pollutants ≥ 0)                                                         |
| Authentication                        | 3     | missing / invalid key on weather and geocoding                                             |
| Key redaction (unit)                  | 2     | —                                                                                          |

## 4. Observations

| #     | Observation                                                                                                                                                   | Impact on tests                                                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| OBS-1 | Current weather requested at the same moment in different `units` can carry a different measurement time `dt` — responses come from different data snapshots. | Unit conversions and translations are compared on **forecast steps**, which sit on a fixed 3-hour grid, instead of on current weather. |
| OBS-2 | The weather endpoint returns the local spelling `Rīga` for the query `Riga,LV`, while the geocoding API returns `Riga` (with `lv: "Rīga"` in `local_names`).  | Name checks accept both spellings.                                                                                                     |
| OBS-3 | Searching weather by city name (`q=`) uses a built-in geocoder that the documentation marks as deprecated.                                                    | Main tests use coordinates; one test keeps `q=` to detect if it is switched off.                                                       |

## 5. Deviations from the test plan

None. Load testing was out of scope by design (third-party production API).

## 6. Recommendations

1. Keep the daily scheduled run: it detects contract changes on the provider side early.
2. If the project moves to a paid plan, extend the suite to One Call 3.0 with the same contract approach.

---

# Test summary report — Swagger Petstore v3

- **Date:** 14.10.2026, updated 18.10.2026
- **System under test:** Swagger Petstore v3. Until 17.10.2026 the public sandbox
  (`https://petstore3.swagger.io/api/v3`, spec 1.0.27); since 18.10.2026 the private container
  `swaggerapi/petstore3:unstable` (spec 1.0.17) from `infra/petstore`. See `docs/test-environments.md`.

## 1. Summary

All Petstore tests pass. Pet CRUD, search and validation behave as documented, except for the defects below,
which are recorded as expected failures (`test.fail`) so that the suite turns red once they are fixed.
Re-checked on the private container on 18.10.2026: DEF-1, DEF-2 and DEF-6 reproduce, DEF-3, DEF-4 and DEF-5 do
not (closed as environment issues of the shared sandbox), DEF-7 depends on DEF-1 data.

## 2. Defects

| Id    | Endpoint                                       | Expected (OpenAPI document)                            | Actual                                                                                                             |
| ----- | ---------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| DEF-1 | `POST /pet`                                    | `name` and `photoUrls` are required → 4xx without them | 200, pet stored with empty `photoUrls`                                                                             |
| DEF-2 | `POST /pet`                                    | `status` is an enum `available / pending / sold`       | Any string is accepted (`"weird"`)                                                                                 |
| DEF-3 | `GET /store/inventory`                         | 200 with counts by status                              | **Closed 18.10.2026** — 200 on a clean container; the sandbox itself answered 200 in the nightly run of 18.10.2026 |
| DEF-4 | `POST /store/order`                            | 200 with the created order                             | **Closed 18.10.2026** — 200 on a clean container; the sandbox itself answered 200 in the nightly run of 18.10.2026 |
| DEF-5 | `POST /user`                                   | 200, user is created                                   | **Closed 18.10.2026** — 200 on a clean container; still 500 on the sandbox, so an environment issue there          |
| DEF-6 | `POST /pet/{id}?status=sold`                   | `name` and `status` are both optional                  | 400 "No Name provided"                                                                                             |
| DEF-7 | `GET /pet/findByStatus`, `GET /pet/findByTags` | responses match the `Pet` schema                       | records stored through DEF-1 come back without `name`; `findByTags` answers 500 while such a record exists         |

## 3. Observations

| #     | Observation                                                                                                                           | Impact on tests                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| OBS-4 | `POST /pet` with an existing id overwrites the record instead of returning 409                                                        | Test documents the overwrite                                                         |
| OBS-5 | `DELETE /pet/{id}` for a missing pet returns 200                                                                                      | Test treats DELETE as idempotent                                                     |
| OBS-6 | 404 for an unknown pet has `Content-Type: application/xml` but a plain-text body                                                      | Test checks the text, not the content type                                           |
| OBS-7 | The public sandbox is shared: seed pets such as `id=1` can be modified by anyone, and its data and availability change without notice | The suite moved to a private container; tests still create and delete their own pets |

---

# Test summary report — HTTP security headers

- **Date:** 15.10.2026
- **System under test:** OpenWeather API and Swagger Petstore v3 (public deployments). The Sock Shop gateway
  results (SEC-9, SEC-10) moved to [microservices-testing](https://github.com/NailKarimov/microservices-testing).

## 1. Summary

The suite has 16 tests: 8 checks for each of 2 systems. 8 of them are expected failures (`test.fail`) that document
8 findings in the two public APIs; they turn red when the provider fixes the issue. Neither public API sets the
two basic browser protections, and Petstore additionally discloses its server version and internals.

## 2. Findings

| Id    | System      | Expected                                                     | Actual                                                             |
| ----- | ----------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| SEC-1 | OpenWeather | `Strict-Transport-Security` with max-age ≥ 180 days          | Header missing                                                     |
| SEC-2 | OpenWeather | `X-Content-Type-Options: nosniff`                            | Header missing                                                     |
| SEC-3 | OpenWeather | No `Allow-Credentials: true` together with `Allow-Origin: *` | Both sent on every response (browsers ignore the combination)      |
| SEC-4 | Petstore    | `Strict-Transport-Security`                                  | Header missing                                                     |
| SEC-5 | Petstore    | `X-Content-Type-Options: nosniff`                            | Header missing                                                     |
| SEC-6 | Petstore    | No version in `Server`                                       | `Server: Jetty(9.4.53.v20231009)`                                  |
| SEC-7 | Petstore    | `OPTIONS` does not describe the API                          | `OPTIONS /pet` with `Accept: */*` returns a WADL document (Jersey) |
| SEC-8 | Petstore    | Error text without internals                                 | 400 message contains `java.lang.Long`                              |

## 3. Observations

| #      | Observation                                                              | Impact on tests                                  |
| ------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| OBS-14 | The WADL on `OPTIONS` appears only when the client does not ask for JSON | The `OPTIONS` test overrides `Accept` with `*/*` |
| OBS-15 | WADL is returned for the collection `/pet`, not for `/pet/{id}`          | The target has a separate `optionsUrl`           |
| OBS-16 | Neither public API reflects an arbitrary `Origin`; both answer `*`       | Only `*` with credentials is a finding (SEC-3)   |

## 4. Recommendations

1. Add `Strict-Transport-Security` and `X-Content-Type-Options: nosniff` on both public APIs (SEC-1, 2, 4, 5).
2. Do not send `Allow-Credentials: true` with a wildcard origin (SEC-3).
3. Hide the server version and the generated WADL, and return generic error messages (SEC-6, 7, 8).
