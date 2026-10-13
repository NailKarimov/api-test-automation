import { test, expect, expectSchema, errorSchema, LOCATIONS } from '../src';

test.describe('Authentication', () => {
  test('request without appid → 401', async ({ weather }) => {
    const res = await weather.api.get('/data/2.5/weather', LOCATIONS.riga, null);

    expect(res.status).toBe(401);
    const body = expectSchema(errorSchema, res.body);
    expect(String(body.cod)).toBe('401');
  });

  test('request with an invalid key → 401 "Invalid API key"', async ({ weather }) => {
    const res = await weather.api.get(
      '/data/2.5/weather',
      LOCATIONS.riga,
      'invalid-key-0000000000000000000000',
    );

    expect(res.status).toBe(401);
    const body = expectSchema(errorSchema, res.body);
    expect(body.message).toContain('Invalid API key');
  });

  test('geocoding API also rejects an invalid key', async ({ weather }) => {
    const res = await weather.api.get('/geo/1.0/direct', { q: 'Riga' }, 'invalid-key-0000000000000000000000');

    expect(res.status).toBe(401);
  });
});
