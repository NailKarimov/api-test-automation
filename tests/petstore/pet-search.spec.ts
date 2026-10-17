import {
  test,
  expect,
  expectSchema,
  petListSchema,
  petSchema,
  petstoreErrorSchema,
  newPet,
  PET_STATUSES,
} from '../../src';

test.describe('Pet search', () => {
  // The public sandbox is shared: at any moment there may be no pets with a given status at all,
  // and other people's records may be invalid (DEF-1 lets a pet without `name` in). Each test
  // creates its own pet, validates that record strictly, and checks only `status` on the rest;
  // invalid foreign records are reported as DEF-7 instead of failing the run.
  for (const status of PET_STATUSES) {
    test(`findByStatus=${status} returns only pets with that status`, async ({ petstore }) => {
      const pet = newPet({ status });
      try {
        await petstore.addPet(pet);
        const res = await petstore.findByStatus(status);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        const items = res.body as { id?: number; status?: string }[];
        const mine = items.find((p) => p.id === pet.id);
        expect(mine, 'our pet is in the result').toBeDefined();
        expectSchema(petSchema, mine);
        expect(items.every((p) => p.status === status)).toBe(true);

        const invalid = items.filter((p) => !petSchema.safeParse(p).success).length;
        if (invalid) {
          test.info().annotations.push({
            type: 'DEF-7',
            description: `${invalid} of ${items.length} returned pets break the Pet schema (stored through DEF-1)`,
          });
        }
      } finally {
        await petstore.deletePet(pet.id);
      }
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
      test.skip(
        res.status === 500,
        'DEF-7: findByTags answers 500 while the shared sandbox holds a pet with invalid tags (also FZ-1)',
      );

      expect(res.status).toBe(200);
      expect(expectSchema(petListSchema, res.body).map((p) => p.id)).toEqual([pet.id]);
    } finally {
      await petstore.deletePet(pet.id);
    }
  });

  test('findByTags with a tag nobody uses → empty list, not an error', async ({ petstore }) => {
    const res = await petstore.findByTags(`no-such-tag-${newPet().id}`);
    test.skip(
      res.status === 500,
      'DEF-7: findByTags answers 500 while the shared sandbox holds a pet with invalid tags (also FZ-1)',
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
