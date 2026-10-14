import { test, expect, expectSchema, petSchema, newPet } from '../../src';

test.describe('Pet CRUD /pet', () => {
  test(
    'full lifecycle: create → read → replace → patch via form → delete',
    { tag: '@smoke' },
    async ({ petstore }) => {
      const pet = newPet();

      await test.step('create: POST /pet echoes every field', async () => {
        const res = await petstore.addPet(pet);
        expect(res.status).toBe(200);
        expect(expectSchema(petSchema, res.body)).toMatchObject(pet);
      });

      await test.step('read: GET /pet/{id} returns what was stored', async () => {
        const res = await petstore.getPet(pet.id);
        expect(res.status).toBe(200);
        expect(expectSchema(petSchema, res.body)).toMatchObject(pet);
      });

      await test.step('replace: PUT /pet overwrites the record, fields that were omitted disappear', async () => {
        const replacement = { id: pet.id, name: `${pet.name}-v2`, photoUrls: [], status: 'sold' as const };
        const put = await petstore.updatePet(replacement);
        expect(put.status).toBe(200);

        const body = expectSchema(petSchema, (await petstore.getPet(pet.id)).body);
        expect(body).toMatchObject(replacement);
        expect(body.category).toBeUndefined();
      });

      await test.step('patch: POST /pet/{id}?name&status changes only those fields', async () => {
        const res = await petstore.updatePetWithForm(pet.id, { name: 'renamed', status: 'pending' });
        expect(res.status).toBe(200);

        const body = expectSchema(petSchema, (await petstore.getPet(pet.id)).body);
        expect(body).toMatchObject({ id: pet.id, name: 'renamed', status: 'pending' });
      });

      await test.step('delete: DELETE /pet/{id}, then the pet is gone', async () => {
        const del = await petstore.deletePet(pet.id);
        expect(del.status).toBe(200);
        expect((await petstore.getPet(pet.id)).status).toBe(404);
      });
    },
  );

  test('a pet with only the required fields is stored', async ({ petstore }) => {
    const pet = newPet();
    const minimal = { id: pet.id, name: pet.name, photoUrls: [] };
    try {
      const res = await petstore.addPet(minimal);
      expect(res.status).toBe(200);
      expect(expectSchema(petSchema, res.body)).toMatchObject(minimal);
    } finally {
      await petstore.deletePet(pet.id);
    }
  });

  test('creating a pet twice with the same id overwrites it (POST is not strictly "create")', async ({
    petstore,
  }) => {
    const pet = newPet();
    try {
      await petstore.addPet(pet);
      const second = await petstore.addPet({ ...pet, name: 'second' });
      expect(second.status).toBe(200);
      expect(expectSchema(petSchema, (await petstore.getPet(pet.id)).body).name).toBe('second');
    } finally {
      await petstore.deletePet(pet.id);
    }
  });

  test('DELETE is idempotent: deleting a missing pet is not an error', async ({ petstore }) => {
    const pet = newPet();
    await petstore.addPet(pet);
    expect((await petstore.deletePet(pet.id)).status).toBe(200);
    expect((await petstore.deletePet(pet.id)).status).toBe(200);
  });

  test('unicode and special characters in the name survive a round trip', async ({ petstore }) => {
    const pet = newPet({ name: 'Rīga ☃ "quotes" & <tags> 猫' });
    try {
      await petstore.addPet(pet);
      expect(expectSchema(petSchema, (await petstore.getPet(pet.id)).body).name).toBe(pet.name);
    } finally {
      await petstore.deletePet(pet.id);
    }
  });
});
