import { test, expect, expectSchema, forecastSchema, LOCATIONS } from '../../src';

const THREE_HOURS = 3 * 60 * 60;

test.describe('5 day / 3 hour forecast /data/2.5/forecast', () => {
  test('returns 40 time steps exactly 3 hours apart', { tag: '@smoke' }, async ({ weather }) => {
    const res = await weather.forecast(LOCATIONS.sydney);

    expect(res.status).toBe(200);
    const body = expectSchema(forecastSchema, res.body);
    expect(body.cnt).toBe(40);
    expect(body.list).toHaveLength(40);
    for (let i = 1; i < body.list.length; i++) {
      expect(body.list[i].dt - body.list[i - 1].dt, `step ${i}`).toBe(THREE_HOURS);
    }
    expect(body.city.country).toBe('AU');
  });

  for (const cnt of [1, 8, 40]) {
    test(`cnt=${cnt} limits the number of time steps`, async ({ weather }) => {
      const res = await weather.forecast(LOCATIONS.riga, { cnt });

      expect(res.status).toBe(200);
      expect(expectSchema(forecastSchema, res.body).list).toHaveLength(cnt);
    });
  }

  test('first time step is in the future (not older than 3 hours)', async ({ weather }) => {
    const res = await weather.forecast(LOCATIONS.riga, { cnt: 1 });
    const [first] = expectSchema(forecastSchema, res.body).list;

    const now = Math.floor(Date.now() / 1000);
    expect(first.dt).toBeGreaterThan(now - THREE_HOURS);
  });
});
