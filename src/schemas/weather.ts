import { z } from 'zod';

/**
 * Response contracts, written from the OpenWeather documentation.
 * Ranges encode physical limits (humidity 0–100 %, wind direction 0–360°),
 * so a schema check also catches nonsense values, not only missing fields.
 */
const coord = z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) });

const condition = z.object({
  id: z.number().int(),
  main: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().regex(/^\d{2}[dn]$/),
});

export const currentWeatherSchema = z.object({
  coord,
  weather: z.array(condition).min(1),
  base: z.string(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number().positive(),
    humidity: z.number().min(0).max(100),
    sea_level: z.number().positive().optional(),
    grnd_level: z.number().positive().optional(),
  }),
  visibility: z.number().min(0).max(10_000).optional(),
  wind: z.object({
    speed: z.number().min(0),
    deg: z.number().min(0).max(360),
    gust: z.number().min(0).optional(),
  }),
  clouds: z.object({ all: z.number().min(0).max(100) }),
  dt: z.number().int().positive(),
  sys: z.object({
    country: z.string().length(2).optional(),
    sunrise: z.number().int().optional(),
    sunset: z.number().int().optional(),
  }),
  timezone: z
    .number()
    .int()
    .min(-12 * 3600)
    .max(14 * 3600),
  id: z.number().int(),
  name: z.string(),
  cod: z.number(),
});

export const forecastSchema = z.object({
  cod: z.string(),
  cnt: z.number().int().positive(),
  list: z
    .array(
      z.object({
        dt: z.number().int().positive(),
        main: z.object({ temp: z.number(), humidity: z.number().min(0).max(100) }),
        weather: z.array(condition).min(1),
        dt_txt: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:00:00$/),
      }),
    )
    .min(1),
  city: z.object({ name: z.string(), country: z.string().length(2), coord, timezone: z.number().int() }),
});

export const geocodeSchema = z.array(
  z.object({
    name: z.string().min(1),
    local_names: z.record(z.string(), z.string()).optional(),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    country: z.string().length(2),
    state: z.string().optional(),
  }),
);

export const airPollutionSchema = z.object({
  coord: z.object({ lat: z.number(), lon: z.number() }),
  list: z
    .array(
      z.object({
        dt: z.number().int().positive(),
        main: z.object({ aqi: z.number().int().min(1).max(5) }),
        components: z.record(z.string(), z.number().min(0)),
      }),
    )
    .length(1),
});

export const errorSchema = z.object({
  cod: z.union([z.string(), z.number()]),
  message: z.string().min(1),
});

export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type Forecast = z.infer<typeof forecastSchema>;
export type GeocodeResult = z.infer<typeof geocodeSchema>;
export type AirPollution = z.infer<typeof airPollutionSchema>;
