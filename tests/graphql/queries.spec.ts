import { test, expect, expectSchema, characterSchema } from '../../src';

/**
 * Basic GraphQL behaviour on the public Rick and Morty API: the client chooses the fields,
 * variables, aliases and fragments, nested data, and "not found" as null instead of 404.
 */
const CHARACTER_FIELDS = 'id name status species type gender image created episode { id episode }';

test.describe('GraphQL queries', () => {
  test('returns exactly the fields that were asked for', { tag: '@smoke' }, async ({ graph }) => {
    const res = await graph.query<{ character: Record<string, unknown> }>(
      '{ character(id: 1) { name status } }',
    );

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data?.character).toEqual({ name: 'Rick Sanchez', status: 'Alive' });
    // nothing more: no id, no image, no episodes
    expect(Object.keys(res.body.data!.character)).toEqual(['name', 'status']);
  });

  test('a variable gives the same result as an inline argument', async ({ graph }) => {
    const inline = await graph.query(`{ character(id: 2) { ${CHARACTER_FIELDS} } }`);
    const withVar = await graph.query(
      `query Character($id: ID!) { character(id: $id) { ${CHARACTER_FIELDS} } }`,
      { id: 2 },
      'Character',
    );

    expect(withVar.body).toEqual(inline.body);
    expectSchema(characterSchema, (withVar.body.data as { character: unknown }).character);
  });

  test('aliases fetch the same field twice with different arguments', async ({ graph }) => {
    const res = await graph.query<Record<string, { name: string }>>(
      '{ rick: character(id: 1) { name } morty: character(id: 2) { name } }',
    );

    expect(res.body.data).toEqual({ rick: { name: 'Rick Sanchez' }, morty: { name: 'Morty Smith' } });
  });

  test('a fragment reuses one selection in several places', async ({ graph }) => {
    const res = await graph.query<Record<string, unknown>>(`
      fragment Card on Character { id name species }
      query Two { a: character(id: 1) { ...Card } b: character(id: 2) { ...Card } }`);

    expect(res.body.data).toEqual({
      a: { id: '1', name: 'Rick Sanchez', species: 'Human' },
      b: { id: '2', name: 'Morty Smith', species: 'Human' },
    });
  });

  test('nested data in one round trip: character → episodes', async ({ graph }) => {
    const res = await graph.query<{ character: { episode: { id: string; episode: string }[] } }>(
      '{ character(id: 1) { episode { id episode } } }',
    );

    const episodes = res.body.data!.character.episode;
    expect(episodes.length).toBeGreaterThan(40);
    expect(episodes[0]).toEqual({ id: '1', episode: 'S01E01' });
  });

  test('charactersByIds returns each requested id once', async ({ graph }) => {
    const res = await graph.query<{ charactersByIds: { id: string }[] }>(
      '{ charactersByIds(ids: [1, 2, 3]) { id } }',
    );

    expect(res.body.data!.charactersByIds.map((c) => c.id).sort()).toEqual(['1', '2', '3']);
  });

  test('an id that does not exist → data null, no error and HTTP 200', async ({ graph }) => {
    const res = await graph.query('{ character(id: 999999) { name } }');

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data).toEqual({ character: null });
  });

  test('the same query also works over GET (cacheable)', async ({ graph }) => {
    const res = await graph.get('query($id: ID!) { character(id: $id) { name } }', { id: 1 });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ character: { name: 'Rick Sanchez' } });
  });
});
