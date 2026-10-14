import type { NewPet } from './schemas';

/**
 * The Petstore is a shared public sandbox, so every test creates its own pet with a unique id and name
 * and never touches records it did not create.
 */
export function uniqueId(): number {
  // ~1.7e15 stays below Number.MAX_SAFE_INTEGER (9e15) and the int64 limit of the API.
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

export function newPet(overrides: Partial<NewPet> = {}): NewPet & { id: number } {
  const id = overrides.id ?? uniqueId();
  return {
    id,
    name: `qa-pet-${id}`,
    category: { id: 1, name: 'Dogs' },
    photoUrls: ['https://example.com/photo.png'],
    tags: [{ id: 1, name: `qa-tag-${id}` }],
    status: 'available',
    ...overrides,
    // id is always set above
  } as NewPet & { id: number };
}
