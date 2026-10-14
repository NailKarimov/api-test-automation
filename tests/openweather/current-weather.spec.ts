import {
  test,
  expect,
  expectSchema,
  currentWeatherSchema,
  forecastSchema,
  errorSchema,
  LOCATIONS,
} from '../../src';

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
    // The API returns the local spelling with a diacritic: "Rīga".
    expect(body.name).toMatch(/^R[iī]ga$/);
    expect(body.sys.country).toBe(riga.country);
  });

  test('unknown city returns 404 "city not found"', async ({ weather }) => {
    const res = await weather.currentByCity('Qwertyuiopville-404');

    expect(res.status).toBe(404);
    const body = expectSchema(errorSchema, res.body);
    expect(body.message).toBe('city not found');
  });

  test('lang=de localises the weather description', async ({ weather }) => {
    // Forecast steps sit on a fixed time grid, so the two languages describe the same step.
    const [en, de] = await Promise.all([
      weather.forecast(riga, { cnt: 1 }),
      weather.forecast(riga, { cnt: 1, lang: 'de' }),
    ]);

    expect(de.status).toBe(200);
    const [enStep] = expectSchema(forecastSchema, en.body).list;
    const [deStep] = expectSchema(forecastSchema, de.body).list;
    expect(deStep.dt).toBe(enStep.dt);
    expect(deStep.weather[0].id).toBe(enStep.weather[0].id);
    expect(deStep.weather[0].description).not.toBe(enStep.weather[0].description);
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
