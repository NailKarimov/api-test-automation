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

// DEF-3, DEF-4 and DEF-5 (HTTP 500 on /store/* and user writes) were seen only on the public sandbox.
// On the same code in a clean private container these calls work, so they are environment problems of the
// shared sandbox, not code defects, and are closed (docs/test-report.md). The tests now check the
// documented behaviour directly and would turn red if the 500s ever came back.
test.describe('Store and user writes', () => {
  test('GET /store/inventory returns a count per status', async ({ petstore }) => {
    const res = await petstore.inventory();

    expect(res.status).toBe(200);
    const counts = res.body as Record<string, unknown>;
    expect(Object.values(counts).every((n) => Number.isInteger(n) && (n as number) >= 0)).toBe(true);
  });

  test('POST /store/order places an order and echoes it back', async ({ petstore }) => {
    const order = {
      id: uniqueId(),
      petId: 1,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    };
    const res = await petstore.placeOrder(order);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: order.id, petId: 1, quantity: 1, status: 'placed' });
  });

  test('POST /user creates a user', async ({ petstore }) => {
    const id = uniqueId();
    const res = await petstore.createUser({ id, username: `qa_user_${id}`, email: 'qa@example.com' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ username: `qa_user_${id}` });
  });
});
