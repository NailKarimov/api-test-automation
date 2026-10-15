# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: petstore/user-and-store.spec.ts >> known defects: store and user write endpoints >> GET /store/inventory returns pet counts by status
- Location: tests/petstore/user-and-store.spec.ts:27:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  1  | import { test, expect, uniqueId } from '../../src';
  2  | 
  3  | test.describe('User session', () => {
  4  |   test('login returns a session id, logout succeeds', async ({ petstore }) => {
  5  |     const login = await petstore.login('qa-user', 'qa-password');
  6  |     expect(login.status).toBe(200);
  7  |     expect(login.text).toMatch(/^Logged in user session: \d+$/);
  8  | 
  9  |     const logout = await petstore.logout();
  10 |     expect(logout.status).toBe(200);
  11 |     expect(logout.text).toBe('User logged out');
  12 |   });
  13 | 
  14 |   test('every login gets its own session id', async ({ petstore }) => {
  15 |     const first = await petstore.login('qa-user', 'qa-password');
  16 |     const second = await petstore.login('qa-user', 'qa-password');
  17 | 
  18 |     expect(first.text).not.toBe(second.text);
  19 |   });
  20 | });
  21 | 
  22 | // On 2026-10-14 the public sandbox answered every /store/* call and every user write with
  23 | // HTTP 500 "There was an error processing your request", while /pet worked. These tests state the
  24 | // behaviour from the OpenAPI document; test.fail() keeps the suite green while the defect exists
  25 | // and turns red as soon as the server is fixed, so the annotation can be removed.
  26 | test.describe('known defects: store and user write endpoints', () => {
  27 |   test('GET /store/inventory returns pet counts by status', async ({ petstore }) => {
  28 |     test.fail(true, 'DEF-3: GET /store/inventory → 500');
  29 |     const res = await petstore.inventory();
  30 | 
> 31 |     expect(res.status).toBe(200);
     |                        ^ Error: expect(received).toBe(expected) // Object.is equality
  32 |   });
  33 | 
  34 |   test('POST /store/order places an order', async ({ petstore }) => {
  35 |     test.fail(true, 'DEF-4: POST /store/order → 500');
  36 |     const res = await petstore.placeOrder({
  37 |       id: uniqueId(),
  38 |       petId: 1,
  39 |       quantity: 1,
  40 |       shipDate: new Date().toISOString(),
  41 |       status: 'placed',
  42 |       complete: false,
  43 |     });
  44 | 
  45 |     expect(res.status).toBe(200);
  46 |   });
  47 | 
  48 |   test('POST /user creates a user', async ({ petstore }) => {
  49 |     test.fail(true, 'DEF-5: POST /user → 500');
  50 |     const id = uniqueId();
  51 |     const res = await petstore.createUser({ id, username: `qa_user_${id}`, email: 'qa@example.com' });
  52 | 
  53 |     expect(res.status).toBe(200);
  54 |   });
  55 | });
  56 | 
```