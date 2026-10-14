import { z } from 'zod';

/**
 * Contracts for Swagger Petstore v3, written from its OpenAPI document
 * (https://petstore3.swagger.io/api/v3/openapi.json). `name` and `photoUrls` are required for a Pet.
 */
export const PET_STATUSES = ['available', 'pending', 'sold'] as const;
export type PetStatus = (typeof PET_STATUSES)[number];

const category = z.object({ id: z.number().int().optional(), name: z.string().optional() });
const tag = z.object({ id: z.number().int().optional(), name: z.string().optional() });

export const petSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  category: category.optional(),
  photoUrls: z.array(z.string()),
  tags: z.array(tag).optional(),
  status: z.enum(PET_STATUSES).optional(),
});
export type Pet = z.infer<typeof petSchema>;

export const petListSchema = z.array(petSchema);

/** Error body returned by the framework for invalid input: { code, message }. */
export const petstoreErrorSchema = z.object({ code: z.number().int(), message: z.string().min(1) });

/** Fields a client may send; `id` is optional because the server can assign one. */
export type NewPet = {
  id?: number;
  name: string;
  category?: { id?: number; name?: string };
  photoUrls: string[];
  tags?: { id?: number; name?: string }[];
  status?: PetStatus;
};
