import { readFileSync } from 'node:fs';
import path from 'node:path';
import { buildClientSchema, buildSchema, getIntrospectionQuery, type IntrospectionQuery } from 'graphql';
import { diff, CriticalityLevel } from '@graphql-inspector/core';
import { test, expect } from '../../src';

/**
 * Schema drift for GraphQL, the counterpart of oasdiff for OpenAPI: the live schema (introspection) is
 * compared with the approved one in contracts/rickandmorty/schema.graphql. Breaking changes fail;
 * non-breaking and dangerous ones are listed in the report.
 */
const APPROVED = path.resolve(__dirname, '../../contracts/rickandmorty/schema.graphql');

test('the live schema has no breaking changes against the approved one', async ({ graph }) => {
  const res = await graph.query<IntrospectionQuery>(getIntrospectionQuery());
  expect(res.body.errors).toBeUndefined();

  const live = buildClientSchema(res.body.data!);
  const approved = buildSchema(readFileSync(APPROVED, 'utf8'));
  const changes = await diff(approved, live);

  const by = (level: CriticalityLevel) =>
    changes.filter((c) => c.criticality.level === level).map((c) => c.message);
  const breaking = by(CriticalityLevel.Breaking);
  const dangerous = by(CriticalityLevel.Dangerous);
  const safe = by(CriticalityLevel.NonBreaking);
  await test.info().attach('schema diff', {
    contentType: 'application/json',
    body: JSON.stringify({ breaking, dangerous, nonBreaking: safe }, null, 2),
  });
  test.info().annotations.push({
    type: 'schema diff',
    description: `${breaking.length} breaking, ${dangerous.length} dangerous, ${safe.length} non-breaking`,
  });

  expect(breaking).toEqual([]);
});

test('the approved schema itself is valid and matches what the tests query', () => {
  const schema = buildSchema(readFileSync(APPROVED, 'utf8'));
  const character = schema.getType('Character');

  expect(character).toBeDefined();
  expect(Object.keys((character as unknown as { getFields(): object }).getFields())).toEqual(
    expect.arrayContaining([
      'id',
      'name',
      'status',
      'species',
      'type',
      'gender',
      'image',
      'created',
      'episode',
    ]),
  );
});
