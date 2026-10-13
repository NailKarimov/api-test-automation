import { test, expect, expectSchema, airPollutionSchema, LOCATIONS } from '../src';

test.describe('Air pollution /data/2.5/air_pollution', () => {
  test('returns AQI 1–5 and non-negative pollutant concentrations', async ({ weather }) => {
    const res = await weather.airPollution(LOCATIONS.riga);

    expect(res.status).toBe(200);
    const body = expectSchema(airPollutionSchema, res.body);
    const components = Object.keys(body.list[0].components);
    for (const key of ['co', 'no2', 'o3', 'so2', 'pm2_5', 'pm10']) {
      expect(components, `pollutant ${key}`).toContain(key);
    }
  });
});
