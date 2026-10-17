import { z } from 'zod';

/** Rick and Morty API: what the schema documents ('Alive', 'Dead' or 'unknown'; four genders). */
export const CHARACTER_STATUSES = ['Alive', 'Dead', 'unknown'] as const;
export const GENDERS = ['Female', 'Male', 'Genderless', 'unknown'] as const;

export const episodeRefSchema = z.object({
  id: z.string().regex(/^\d+$/),
  episode: z.string().regex(/^S\d{2}E\d{2}$/),
});

export const characterSchema = z.object({
  id: z.string().regex(/^\d+$/), // GraphQL ID is serialised as a string
  name: z.string().min(1),
  status: z.enum(CHARACTER_STATUSES),
  species: z.string(),
  type: z.string(),
  gender: z.enum(GENDERS),
  image: z.string().url(),
  created: z.string().datetime({ offset: true }),
  episode: z.array(episodeRefSchema).min(1),
});

export const infoSchema = z.object({
  count: z.number().int().nonnegative(),
  pages: z.number().int().nonnegative(),
  next: z.number().int().positive().nullable(),
  prev: z.number().int().positive().nullable(),
});

export const graphQLErrorSchema = z.object({
  message: z.string().min(1),
  locations: z.array(z.object({ line: z.number(), column: z.number() })).optional(),
  path: z.array(z.union([z.string(), z.number()])).optional(),
  extensions: z.record(z.string(), z.unknown()).optional(),
});
export const errorEnvelopeSchema = z.object({ errors: z.array(graphQLErrorSchema).min(1) });
