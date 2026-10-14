import {
  test,
  expect,
  expectSchema,
  petListSchema,
  petstoreErrorSchema,
  newPet,
  PET_STATUSES,
} from '../../src';

test.describe('Pet search', () => {
  for (const status of PET_STATUSES) {
    test(`findByStatus=${status} returns only pets with that status`, async ({ petstore }) => {
      const res = await petstore.findByStatus(status);

      expect(res.status).toBe(200);
      const pets = expectSchema(petListSchema, res.body);
      expect(pets.length).toBeGreaterThan(0);
      expect(pets.every((p) => p.status === status)).toBe(true);
    });
  }

  test('a new pet shows up under its status and moves when the status changes', async ({ petstore }) => {
    const pet = newPet({ status: 'pending' });
    try {
      await petstore.addPet(pet);
      const pending = expectSchema(petListSchema, (await petstore.findByStatus('pending')).body);
      expect(pending.map((p) => p.id)).toContain(pet.id);

      await petstore.updatePetWithForm(pet.id, { name: pet.name, status: 'sold' });
      const afterPending = expectSchema(petListSchema, (await petstore.findByStatus('pending')).body);
      const sold = expectSchema(petListSchema, (await petstore.findByStatus('sold')).body);
      expect(afterPending.map((p) => p.id)).not.toContain(pet.id);
      expect(sold.map((p) => p.id)).toContain(pet.id);
    } finally {
      await petstore.deletePet(pet.id);
    }
  });

  test('findByStatus with an unknown value → 400', async ({ petstore }) => {
    const res = await petstore.findByStatus('bogus');

    expect(res.status).toBe(400);
    expect(expectSchema(petstoreErrorSchema, res.body).message).toContain('status');
  });

  test('findByStatus without the required parameter → 400', async ({ petstore }) => {
    expect((await petstore.findByStatus()).status).toBe(400);
  });

  test('findByTags finds a pet by its unique tag', async ({ petstore }) => {
    const pet = newPet();
    const tag = pet.tags![0].name!;
    try {
      await petstore.addPet(pet);
      const res = await petstore.findByTags(tag);

      expect(res.status).toBe(200);
      expect(expectSchema(petListSchema, res.body).map((p) => p.id)).toEqual([pet.id]);
    } finally {
      await petstore.deletePet(pet.id);
    }
  });

  test('findByTags with a tag nobody uses → empty list, not an error', async ({ petstore }) => {
    const res = await petstore.findByTags(`no-such-tag-${newPet().id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
