import { test, expect, nestedQuery } from '../../src';
test('diag', async ({ graph }) => {
  const qs: [string, string][] = [
    ['introspection', '{ __schema { queryType { name } types { name } } }'],
    ['typename', '{ __typename }'],
    ['depth4', nestedQuery(4, 1)],
    ['depth5', nestedQuery(5, 1)],
    ['episodes', '{ episodes { info { count } } }'],
    ['episodes2', '{ episodes(page: 1) { info { count pages } } }'],
    ['syntax', '{ character(id: 1) { name '],
  ];
  const out: string[] = [];
  for (const [n, q] of qs) {
    const r = await graph.query(q);
    const h = r.response.headers();
    out.push(`${n}: ${r.status} ${JSON.stringify({ server: h['server'], via: h['via'], cache: h['gcdn-cache'] ?? h['x-cache'] ?? h['cf-cache-status'], ct: h['content-type'] })} ${r.text.slice(0, 600).replace(/\n/g, ' ')}`);
  }
  expect(out.join('\n')).toBe('');
});
