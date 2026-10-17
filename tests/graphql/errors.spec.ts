import { test, expect, expectSchema, errorEnvelopeSchema } from '../../src';

/**
 * In GraphQL, problems come back in the `errors` array. Validation and syntax errors stop the operation
 * before it runs, so there is no `data`; the HTTP status may be 400 or 200 depending on the server,
 * which is why every test asserts on the body and records the status.
 */
function recordStatus(status: number) {
  test.info().annotations.push({ type: 'HTTP status', description: String(status) });
}

test.describe('GraphQL errors', () => {
  test('an unknown field is a validation error, nothing is executed', async ({ graph }) => {
    const res = await graph.query('{ character(id: 1) { name salary } }');
    recordStatus(res.status);

    const { errors } = expectSchema(errorEnvelopeSchema, res.body);
    expect(errors[0].message).toContain('Cannot query field "salary" on type "Character"');
    expect(res.body.data).toBeUndefined();
    expect([200, 400]).toContain(res.status);
  });

  test('a syntax error is rejected before it reaches the GraphQL server', async ({ graph }) => {
    const res = await graph.query('{ character(id: 1) { name ');
    recordStatus(res.status);

    // The public endpoint answers unparsable documents from its edge layer, with a generic message
    // and no line/column (graphql-js itself would say "Syntax Error: …" with a location). GQL-5.
    const { errors } = expectSchema(errorEnvelopeSchema, res.body);
    test.info().annotations.push({ type: 'GQL-5', description: errors[0].message });
    expect(errors[0].message).toMatch(/Syntax Error|not contain a valid GraphQL request/);
    expect(res.body.data ?? undefined).toBeUndefined();
  });

  test('a missing required variable is rejected', async ({ graph }) => {
    const res = await graph.query('query($id: ID!) { character(id: $id) { name } }', {});
    recordStatus(res.status);

    const { errors } = expectSchema(errorEnvelopeSchema, res.body);
    expect(errors[0].message).toMatch(/\$id/);
  });

  test('a variable of the wrong type is rejected (page: "two")', async ({ graph }) => {
    const res = await graph.query('query($p: Int) { characters(page: $p) { info { count } } }', { p: 'two' });
    recordStatus(res.status);

    const { errors } = expectSchema(errorEnvelopeSchema, res.body);
    expect(errors[0].message).toMatch(/\$p/);
  });

  test('a body that is not JSON is rejected', async ({ graph }) => {
    const res = await graph.raw('{ "query": ');
    recordStatus(res.status);

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  test('errors do not expose a server stack trace', async ({ graph }) => {
    const res = await graph.query('{ character(id: 1) { name salary } }');

    for (const e of expectSchema(errorEnvelopeSchema, res.body).errors) {
      expect(JSON.stringify(e.extensions ?? {})).not.toMatch(/stacktrace|at .+\.js:\d+/);
    }
  });
});
