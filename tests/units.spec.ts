import { test, expect, expectSchema, currentWeatherSchema, LOCATIONS, CurrentWeather } from '../src';

/**
 * The same location requested in three unit systems must describe the same
 * measurement: K − 273.15 = °C, °F = °C × 9/5 + 32, mph = m/s × 2.23694.
 * The provider updates data every few minutes, so the comparison runs only
 * when all three responses share the same `dt` (measurement time).
 */
test.describe('Units of measurement', () => {
  let standard: CurrentWeather;
  let metric: CurrentWeather;
  let imperial: CurrentWeather;

  test.beforeEach(async ({ weather }) => {
    const [s, m, i] = await Promise.all([
      weather.current(LOCATIONS.riga, { units: 'standard' }),
      weather.current(LOCATIONS.riga, { units: 'metric' }),
      weather.current(LOCATIONS.riga, { units: 'imperial' }),
    ]);
    standard = expectSchema(currentWeatherSchema, s.body);
    metric = expectSchema(currentWeatherSchema, m.body);
    imperial = expectSchema(currentWeatherSchema, i.body);
    // eslint-disable-next-line playwright/no-skipped-test -- conditional skip: live data may change between calls
    test.skip(
      new Set([standard.dt, metric.dt, imperial.dt]).size > 1,
      'Measurement updated between requests',
    );
  });

  test('Kelvin (standard) and Celsius (metric) describe the same temperature', () => {
    expect(standard.main.temp - 273.15).toBeCloseTo(metric.main.temp, 0);
  });

  test('Fahrenheit (imperial) equals Celsius × 9/5 + 32', () => {
    expect((metric.main.temp * 9) / 5 + 32).toBeCloseTo(imperial.main.temp, 0);
  });

  test('wind speed: mph equals m/s × 2.23694', () => {
    expect(metric.wind.speed * 2.23694).toBeCloseTo(imperial.wind.speed, 0);
  });

  test('units do not change non-unit fields (humidity, pressure, city)', () => {
    expect(imperial.main.humidity).toBe(metric.main.humidity);
    expect(imperial.main.pressure).toBe(metric.main.pressure);
    expect(imperial.id).toBe(metric.id);
  });
});
