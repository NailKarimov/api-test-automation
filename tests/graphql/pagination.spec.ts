import { test, expect, expectSchema, infoSchema, CHARACTER_STATUSES } from '../../src';

type Page = { characters: { info: unknown; results: { id: string; name: string; status: string }[] } };
const PAGE =
  'query Page($page: Int, $filter: FilterCharacter) { characters(page: $page, filter: $filter) { info { count pages next prev } results { id name status } } }';
const PAGE_SIZE = 20;

test.describe('GraphQL pagination and filters', () => {
  test('first page: 20 results, next = 2, prev = null, pages = ceil(count / 20)', async ({ graph }) => {
    const res = await graph.query<Page>(PAGE, { page: 1 });

    const info = expectSchema(infoSchema, res.body.data!.characters.info);
    expect(res.body.data!.characters.results).toHaveLength(PAGE_SIZE);
    expect(info).toMatchObject({ next: 2, prev: null });
    expect(info.pages).toBe(Math.ceil(info.count / PAGE_SIZE));
  });

  test('last page: the remainder of the results, next = null (boundary)', async ({ graph }) => {
    const first = expectSchema(
      infoSchema,
      (await graph.query<Page>(PAGE, { page: 1 })).body.data!.characters.info,
    );
    const last = (await graph.query<Page>(PAGE, { page: first.pages })).body.data!.characters;

    expect(last.results).toHaveLength(first.count - PAGE_SIZE * (first.pages - 1));
    expect(last.info).toMatchObject({ next: null, prev: first.pages - 1 });
  });

  test('a page after the last one → empty results, not an error', async ({ graph }) => {
    const first = expectSchema(
      infoSchema,
      (await graph.query<Page>(PAGE, { page: 1 })).body.data!.characters.info,
    );
    const res = await graph.query<Page>(PAGE, { page: first.pages + 1 });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data!.characters.results).toEqual([]);
  });

  for (const status of CHARACTER_STATUSES) {
    test(`filter status=${status} returns only that status`, async ({ graph }) => {
      const res = await graph.query<Page>(PAGE, { filter: { status } });
      const results = res.body.data!.characters.results;

      expect(results.length).toBeGreaterThan(0);
      // the REST filter behind it is case-insensitive; the values themselves keep their case
      expect(results.every((c) => c.status.toLowerCase() === status.toLowerCase())).toBe(true);
    });
  }

  test('filter by part of a name is case-insensitive', async ({ graph }) => {
    const lower = (await graph.query<Page>(PAGE, { filter: { name: 'rick sanchez' } })).body.data!.characters;
    const upper = (await graph.query<Page>(PAGE, { filter: { name: 'RICK SANCHEZ' } })).body.data!.characters;

    expect(lower.results.map((c) => c.id)).toEqual(upper.results.map((c) => c.id));
    expect(lower.results.every((c) => /rick sanchez/i.test(c.name))).toBe(true);
  });

  test('a filter that matches nothing → empty results, not an error', async ({ graph }) => {
    const res = await graph.query<Page>(PAGE, { filter: { name: 'no-such-character-qa-2026' } });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data!.characters.results).toEqual([]);
  });
});
