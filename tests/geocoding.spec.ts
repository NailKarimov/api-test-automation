import { test, expect, expectSchema, geocodeSchema, currentWeatherSchema, LOCATIONS } from '../src';

const { riga } = LOCATIONS;

test.describe('Geocoding /geo/1.0', () => {
  test('direct: "Riga,LV" resolves to Riga, Latvia', { tag: '@smoke' }, async ({ weather }) => {
    const res = await weather.geocode('Riga,LV', 1);

    expect(res.status).toBe(200);
    const [place] = expectSchema(geocodeSchema, res.body);
    expect(place.name).toBe(riga.name);
    expect(place.country).toBe(riga.country);
    expect(place.lat).toBeCloseTo(riga.lat, 1);
    expect(place.lon).toBeCloseTo(riga.lon, 1);
  });

  for (const limit of [1, 3, 5]) {
    test(`direct: limit=${limit} returns at most ${limit} results`, async ({ weather }) => {
      const res = await weather.geocode('London', limit);

      expect(res.status).toBe(200);
      const places = expectSchema(geocodeSchema, res.body);
      expect(places.length).toBeGreaterThan(0);
      expect(places.length).toBeLessThanOrEqual(limit);
    });
  }

  test('direct: unknown place returns an empty list, not an error', async ({ weather }) => {
    const res = await weather.geocode('Qwertyuiopville-404');

    expect(res.status).toBe(200);
    expect(expectSchema(geocodeSchema, res.body)).toEqual([]);
  });

  test('direct: local_names contains the Latvian name', async ({ weather }) => {
    const res = await weather.geocode('Riga,LV', 1);
    const [place] = expectSchema(geocodeSchema, res.body);

    expect(place.local_names?.lv).toBe('Rīga');
  });

  test('reverse: Riga coordinates resolve to a place in Latvia', async ({ weather }) => {
    const res = await weather.reverseGeocode(riga, 1);

    expect(res.status).toBe(200);
    const [place] = expectSchema(geocodeSchema, res.body);
    expect(place.country).toBe(riga.country);
  });

  test('geocoding and weather agree on the location', async ({ weather }) => {
    const geo = await weather.geocode('Reykjavik,IS', 1);
    const [place] = expectSchema(geocodeSchema, geo.body);

    const res = await weather.current({ lat: place.lat, lon: place.lon });
    const current = expectSchema(currentWeatherSchema, res.body);

    expect(current.sys.country).toBe('IS');
    expect(current.coord.lat).toBeCloseTo(place.lat, 1);
    expect(current.coord.lon).toBeCloseTo(place.lon, 1);
  });
});
