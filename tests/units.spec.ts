import { test, expect, expectSchema, forecastSchema, LOCATIONS } from '../src';
import type { Forecast } from '../src';

/**
 * Decision table for the `units` parameter. The same forecast step requested in
 * three unit systems must describe the same value:
 *   standard (K) − 273.15 = metric (°C);  metric × 9/5 + 32 = imperial (°F);
 *   metric wind (m/s) × 2.23694 = imperial wind (mph).
 * Forecast steps sit on a fixed 3-hour grid, so values are matched by `dt` —
 * unlike current weather, whose measurement time can differ between requests.
 */
type Step = Forecast['list'][number];

test.describe('Units of measurement (forecast, matched by time step)', () => {
  let standard: Step;
  let metric: Step;
  let imperial: Step;

  test.beforeEach(async ({ weather }) => {
    const [s, m, i] = await Promise.all(
      (['standard', 'metric', 'imperial'] as const).map((units) =>
        weather.forecast(LOCATIONS.riga, { cnt: 2, units }),
      ),
    );
    const lists = [s, m, i].map((r) => expectSchema(forecastSchema, r.body).list);
    const dt = lists[0][0].dt;
    const pick = (list: Step[]) => list.find((step) => step.dt === dt);
    const steps = lists.map(pick);
    expect(steps.every(Boolean), `time step ${dt} is missing in one of the unit systems`).toBe(true);
    [standard, metric, imperial] = steps as Step[];
  });

  test('Kelvin (standard) − 273.15 equals Celsius (metric)', () => {
    expect(standard.main.temp - 273.15).toBeCloseTo(metric.main.temp, 0);
  });

  test('Fahrenheit (imperial) equals Celsius × 9/5 + 32', () => {
    expect((metric.main.temp * 9) / 5 + 32).toBeCloseTo(imperial.main.temp, 0);
  });

  test('wind speed: mph equals m/s × 2.23694', () => {
    expect(metric.wind.speed * 2.23694).toBeCloseTo(imperial.wind.speed, 0);
  });

  test('units do not change unitless fields (humidity, pressure, wind direction)', () => {
    expect(imperial.main.humidity).toBe(metric.main.humidity);
    expect(imperial.main.pressure).toBe(metric.main.pressure);
    expect(imperial.wind.deg).toBe(metric.wind.deg);
  });
});
