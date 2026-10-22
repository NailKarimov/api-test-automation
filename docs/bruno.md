# Bruno: an API collection that lives in git

[Bruno](https://www.usebruno.com/) is an API client like Postman, with one difference that matters for a team:
a collection is a folder of plain-text `.bru` files, not an export from a cloud workspace. It is reviewed in pull
requests like code, needs no account, and runs headless in CI with the same CLI (`bru run`).

The collection is in [`collections/petstore/`](../collections/petstore) and targets the same private Petstore
container (port 8090) the Playwright suite uses.

| Folder             | Requests | What it checks                                                                                                                                                 |
| ------------------ | -------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `01 Pet lifecycle` |        9 | create → read → find by status → update with a form → read → delete → 404; a sold "control" pet that the status filter must leave out                          |
| `02 Validation`    |        7 | non-numeric id 400, unknown id 404, unknown / missing status 400, malformed JSON 400 without a stack trace, `text/plain` 415, DELETE with a non-numeric id 400 |
| `03 Store`         |        2 | inventory counts are whole and non-negative; an order is echoed back                                                                                           |

18 requests, 27 assertions and 9 tests. In CI the run writes JUnit XML (picked up by Allure next to the Playwright
tests) and Bruno's own HTML report, published at `…/api-test-automation/bruno/`.

## 1. Anatomy of a request

```text
meta { name, type: http, seq }        order inside the folder
post { url: {{baseUrl}}/pet }         {{baseUrl}} comes from environments/local.bru
body:json { … "id": {{petId}} … }     runtime variable set by the script below
script:pre-request {                  JavaScript before sending
  bru.setVar("petId", 900000000 + random)
}
assert {                              declarative checks, one per line
  res.status: eq 200
  res.body.name: eq bruno-{{petId}}
}
tests {                               Chai-style tests for anything the assert block cannot say
  test("echoes every field", …)
}
```

Requests in one folder share runtime variables, so the lifecycle is a chain: `petId` created in request 1 is
read, searched for, updated and deleted by the next ones. Each run uses a fresh id, so runs never collide.

## 2. A trap: Bruno could not send malformed JSON

The first version of "Malformed JSON is 400" failed with _socket hang up_ on the local stand-in server. The server
had received **valid** JSON: the string `"{ \"id\": 1, \"name\":"`. The HTTP library under Bruno (axios)
re-encodes any string body that does not parse as JSON into a JSON _string_ whenever the content type contains
`application/json` — a helpful default that makes a negative test impossible. A `Buffer` from a script did not
help either: the safe sandbox serialises it as an object.

The fix uses the protocol: media types are case-insensitive (RFC 9110), axios's check is not. With
`Content-Type: Application/JSON` the broken bytes reach the server intact, and the server still treats the
body as JSON. A negative test is only as good as what actually goes over the wire — so it is worth looking at
what the server received at least once.

## 3. Does the collection catch real bugs?

A small stand-in Petstore (only for checking the collection locally; CI uses the real container) was started
with one bug at a time:

| Planted bug                                  | Caught by                                                                                                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `findByStatus` ignores the filter            | "Find by status" — **only after adding the sold control pet**; before that it survived, because every pet in the store happened to be available |
| a form update ignores `status`               | "Get updated pet"                                                                                                                               |
| DELETE does nothing                          | "Deleted pet is gone"                                                                                                                           |
| POST /pet drops `tags`                       | "Create pet" and "Get pet"                                                                                                                      |
| a non-numeric id gives 500 with a Java trace | "Non-numeric id is 400"                                                                                                                         |

5 of 5. The survivor in the first round is the useful lesson: "every item matches the filter" proves nothing
unless the data contains items that should **not** match.

## 4. Bruno, Postman or code?

|          | Bruno                                                                            | Postman                                          | Playwright / pytest                            |
| -------- | -------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Storage  | `.bru` text files in git                                                         | cloud workspace, JSON export                     | code in git                                    |
| Review   | diff in a pull request                                                           | export, then diff                                | diff in a pull request                         |
| CI       | `bru run`                                                                        | `newman` / Postman CLI                           | the test runner                                |
| Best for | exploring an API, a living set of examples, quick smoke checks by the whole team | the same, when the team already lives in Postman | logic, data generation, fixtures, large suites |

Here Bruno does not replace the Playwright suite: it is the collection a developer or analyst opens to try the
API, and CI makes sure it never goes stale.

## Running it

```bash
npm run petstore:up
npm run test:bruno                 # bru run -r --env local in collections/petstore
```

Or open `collections/petstore` in the Bruno app and pick the `local` environment.
