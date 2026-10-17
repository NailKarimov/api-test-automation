import { test, expect, nestedQuery, expectSchema, errorEnvelopeSchema } from '../../src';

/**
 * GraphQL-specific risks (OWASP API4: unrestricted resource consumption, information disclosure).
 * Kept small on purpose: this is a public demo service.
 */
test.describe('GraphQL security', () => {
  test('query depth is limited: depth 4 runs, depth 5 is rejected before execution (boundary)', async ({
    graph,
  }) => {
    // Character 183 (one episode) → episode → its characters → their episodes → name: depth 4.
    const allowed = await graph.query(nestedQuery(4, 183));
    expect(allowed.body.errors, 'depth 4 must run').toBeUndefined();

    const rejected = await graph.query(nestedQuery(5, 183));
    const { errors } = expectSchema(errorEnvelopeSchema, rejected.body);
    expect(errors[0].message).toMatch(/exceeds maximum operation depth of 4/);
    expect(rejected.body.data).toBeUndefined();
  });

  test('introspection is enabled (by design for a public demo; a finding on a private API)', async ({
    graph,
  }) => {
    const res = await graph.query<{ __schema: { queryType: { name: string }; types: unknown[] } }>(
      '{ __schema { queryType { name } types { name } } }',
    );

    expect(res.body.data?.__schema.queryType.name).toBe('Query');
    test.info().annotations.push({
      type: 'GQL-1 (by design)',
      description: `introspection exposes ${res.body.data?.__schema.types.length} types to anyone`,
    });
  });

  test('batched operations: several queries in one HTTP request', async ({ graph }) => {
    const res = await graph.batch([
      { query: '{ character(id: 1) { name } }' },
      { query: '{ character(id: 2) { name } }' },
    ]);
    test.info().annotations.push({ type: 'HTTP status', description: String(res.status) });

    // Batching multiplies brute force and rate-limit bypass; record whether the server allows it.
    if (Array.isArray(res.body)) {
      test.info().annotations.push({ type: 'GQL-4', description: 'array batching is accepted' });
      expect(res.body.map((r) => (r.data as { character: { name: string } }).character.name)).toEqual([
        'Rick Sanchez',
        'Morty Smith',
      ]);
    } else {
      expect(res.status).toBeGreaterThanOrEqual(400);
    }
  });

  test('query cost is limited: 200 aliases in one query are rejected', async ({ graph }) => {
    test.fail(
      true,
      'GQL-2: no cost or alias limit, only a depth limit; one HTTP request can ask for the same field hundreds of times',
    );
    // Same id every time, so the server's per-request cache keeps the real load to one lookup.
    const aliases = Array.from({ length: 200 }, (_, i) => `a${i}: character(id: 1) { name }`).join(' ');
    const res = await graph.query(`{ ${aliases} }`);

    expect(res.body.errors, 'a cost limit would reject this query').toBeDefined();
  });

  test('error messages do not suggest field names ("Did you mean …")', async ({ graph }) => {
    test.fail(
      true,
      'GQL-3: validation errors suggest real field names, which helps map a schema with introspection off',
    );
    const res = await graph.query('{ character(id: 1) { nam } }');

    expect(JSON.stringify(res.body.errors)).not.toMatch(/Did you mean/);
  });
});
