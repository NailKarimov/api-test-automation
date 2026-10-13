import { test, expect, expectSchema, currentWeatherSchema, errorSchema, LOCATIONS } from '../src';

const { riga } = LOCATIONS;

test.describe('Current weather /data/2.5/weather', () => {
  test(
    'by coordinates returns a response that matches the contract',
    { tag: '@smoke' },
    async ({ weather }) => {
      const res = await weather.current(riga);

      expect(res.status).toBe(200);
      const body = expectSchema(currentWeatherSchema, res.body);
      expect(body.sys.country).toBe(riga.country);
      expect(body.coord.lat).toBeCloseTo(riga.lat, 1);
      expect(body.coord.lon).toBeCloseTo(riga.lon, 1);
    },
  );

  test('by city name returns the same city', async ({ weather }) => {
    const res = await weather.currentByCity(`${riga.name},${riga.country}`);

    expect(res.status).toBe(200);
    const body = expectSchema(currentWeatherSchema, res.body);
    expect(body.name).toBe(riga.name);
    expect(body.sys.country).toBe(riga.country);
  });

  test('unknown city returns 404 "city not found"', async ({ weather }) => {
    const res = await weather.currentByCity('Qwertyuiopville-404');

    expect(res.status).toBe(404);
    const body = expectSchema(errorSchema, res.body);
    expect(body.message).toBe('city not found');
  });

  test('lang=de localises the weather description', async ({ weather }) => {
    const en = await weather.current(riga);
    const de = await weather.current(riga, { lang: 'de' });

    expect(de.status).toBe(200);
    const enBody = expectSchema(currentWeatherSchema, en.body);
    const deBody = expectSchema(currentWeatherSchema, de.body);
    // Same conditions code, but the text is translated (when the snapshot is the same).
    // eslint-disable-next-line playwright/no-skipped-test -- conditional skip: live data may change between calls
    test.skip(enBody.dt !== deBody.dt, 'Weather snapshot changed between requests');
    expect(deBody.weather[0].id).toBe(enBody.weather[0].id);
    expect(deBody.weather[0].description).not.toBe(enBody.weather[0].description);
  });

  test('mode=xml returns XML instead of JSON', async ({ weather }) => {
    const res = await weather.current(riga, { mode: 'xml' });

    expect(res.status).toBe(200);
    expect(res.contentType).toContain('xml');
    expect(res.text).toContain('<current>');
    expect(res.text).toContain(`<city id=`);
  });

  test('response time is under 3 seconds', async ({ weather }) => {
    const res = await weather.current(riga);

    expect(res.status).toBe(200);
    test.info().annotations.push({ type: 'response-time', description: `${res.durationMs} ms` });
    expect(res.durationMs).toBeLessThan(3_000);
  });
});
