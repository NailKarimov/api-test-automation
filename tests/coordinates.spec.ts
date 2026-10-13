import {
  test,
  expect,
  expectSchema,
  currentWeatherSchema,
  errorSchema,
  VALID_COORDS,
  INVALID_COORDS,
} from '../src';

/**
 * Boundary value analysis for coordinates: latitude is valid in [-90, 90],
 * longitude in [-180, 180]. Values exactly on the boundary must be accepted,
 * values just outside must be rejected with 400.
 */
test.describe('Coordinates: boundary values', () => {
  for (const c of VALID_COORDS) {
    test(`valid: ${c.case} → 200`, async ({ weather }) => {
      const res = await weather.current(c);

      expect(res.status).toBe(200);
      expectSchema(currentWeatherSchema, res.body);
    });
  }

  for (const c of INVALID_COORDS) {
    test(`invalid: ${c.case} → 400`, async ({ weather }) => {
      const res = await weather.current(c);

      expect(res.status).toBe(400);
      const body = expectSchema(errorSchema, res.body);
      expect(body.message).toMatch(/latitude|longitude/i);
    });
  }

  test('missing lon → 400 "Nothing to geocode"', async ({ weather }) => {
    const res = await weather.api.get('/data/2.5/weather', { lat: 56.95 });

    expect(res.status).toBe(400);
    expectSchema(errorSchema, res.body);
  });
});
