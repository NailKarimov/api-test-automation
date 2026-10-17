import { test, expect } from '../../src';

/**
 * The GraphQL API is a facade over the REST API of the same service, which gives a free test oracle:
 * both must describe the same character, the same counts and the same episodes.
 */
type RestCharacter = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  created: string;
  episode: string[];
};

test.describe('GraphQL ↔ REST consistency', () => {
  for (const id of [1, 2, 183]) {
    test(`character ${id}: GraphQL and REST agree field by field`, async ({ graph }) => {
      const rest = (await graph.rest<RestCharacter>(`api/character/${id}`)).body;
      const gql = (
        await graph.query<{ character: Record<string, unknown> & { episode: { id: string }[] } }>(
          `{ character(id: ${id}) { id name status species type gender image created episode { id } } }`,
        )
      ).body.data!.character;

      expect({ ...gql, episode: undefined }).toEqual({
        id: String(rest.id),
        name: rest.name,
        status: rest.status,
        species: rest.species,
        type: rest.type,
        gender: rest.gender,
        image: rest.image,
        created: rest.created,
        episode: undefined,
      });
      expect(gql.episode.map((e) => e.id)).toEqual(rest.episode.map((url) => url.split('/').pop()));
    });
  }

  test('the number of dead characters is the same in both APIs', async ({ graph }) => {
    const rest = (await graph.rest<{ info: { count: number } }>('api/character', { status: 'dead' })).body;
    const gql = await graph.query<{ characters: { info: { count: number } } }>(
      '{ characters(filter: { status: "Dead" }) { info { count } } }',
    );

    expect(gql.body.data!.characters.info.count).toBe(rest.info.count);
  });

  test('episode totals match', async ({ graph }) => {
    const rest = (await graph.rest<{ info: { count: number } }>('api/episode')).body;
    const gql = await graph.query<{ episodes: { info: { count: number } } }>(
      '{ episodes { info { count } } }',
    );

    expect(gql.body.data!.episodes.info.count).toBe(rest.info.count);
  });
});
