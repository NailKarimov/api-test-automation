import { test, expect, uniqueId } from '../../src';

test.describe('User session', () => {
  test('login returns a session id, logout succeeds', async ({ petstore }) => {
    const login = await petstore.login('qa-user', 'qa-password');
    expect(login.status).toBe(200);
    expect(login.text).toMatch(/^Logged in user session: \d+$/);

    const logout = await petstore.logout();
    expect(logout.status).toBe(200);
    expect(logout.text).toBe('User logged out');
  });

  test('every login gets its own session id', async ({ petstore }) => {
    const first = await petstore.login('qa-user', 'qa-password');
    const second = await petstore.login('qa-user', 'qa-password');

    expect(first.text).not.toBe(second.text);
  });
});

// On 2026-10-14 the public sandbox answered every /store/* call and every user write with
// HTTP 500 "There was an error processing your request", while /pet worked. These tests state the
// behaviour from the OpenAPI document; test.fail() keeps the suite green while the defect exists
// and turns red as soon as the server is fixed, so the annotation can be removed.
test.describe('known defects: store and user write endpoints', () => {
  test('GET /store/inventory returns pet counts by status', async ({ petstore }) => {
    test.fail(true, 'DEF-3: GET /store/inventory → 500');
    const res = await petstore.inventory();

    expect(res.status).toBe(200);
  });

  test('POST /store/order places an order', async ({ petstore }) => {
    test.fail(true, 'DEF-4: POST /store/order → 500');
    const res = await petstore.placeOrder({
      id: uniqueId(),
      petId: 1,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    });

    expect(res.status).toBe(200);
  });

  test('POST /user creates a user', async ({ petstore }) => {
    test.fail(true, 'DEF-5: POST /user → 500');
    const id = uniqueId();
    const res = await petstore.createUser({ id, username: `qa_user_${id}`, email: 'qa@example.com' });

    expect(res.status).toBe(200);
  });
});
