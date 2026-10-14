import { test, expect, expectSchema, petstoreErrorSchema, newPet } from '../../src';

test.describe('Pet input validation (negative tests)', () => {
  test('unknown id → 404', async ({ petstore }) => {
    const res = await petstore.getPet(newPet().id);

    expect(res.status).toBe(404);
    expect(res.text).toContain('Pet not found');
  });

  test('negative id → 404', async ({ petstore }) => {
    expect((await petstore.getPet(-5)).status).toBe(404);
  });

  for (const id of ['abc', '1.5', 'null']) {
    test(`non-numeric id "${id}" → 400`, async ({ petstore }) => {
      const res = await petstore.getPet(id);

      expect(res.status).toBe(400);
      expectSchema(petstoreErrorSchema, res.body);
    });
  }

  test('malformed JSON → 400', async ({ petstore }) => {
    const res = await petstore.addPetRaw('{bad json', 'application/json');

    expect(res.status).toBe(400);
    expect(expectSchema(petstoreErrorSchema, res.body).code).toBe(400);
  });

  test('id of the wrong type (string instead of integer) → 400', async ({ petstore }) => {
    const res = await petstore.addPet({ id: 'not-a-number', name: 'x', photoUrls: [] });

    expect(res.status).toBe(400);
  });

  test('unsupported media type (text/plain) → 415', async ({ petstore }) => {
    const res = await petstore.addPetRaw('hello', 'text/plain');

    expect(res.status).toBe(415);
  });

  test('DELETE with a non-numeric id → 400', async ({ petstore }) => {
    expect((await petstore.deletePet('abc')).status).toBe(400);
  });

  // The OpenAPI document says `name` and `photoUrls` are required and `status` is an enum,
  // but the sandbox accepts such requests. test.fail() documents the known defect: the test is
  // reported as passed while it fails, and turns red as soon as the server starts validating.
  test.describe('known defects (server is more lenient than its own OpenAPI document)', () => {
    test('pet without the required `name` is rejected', async ({ petstore }) => {
      test.fail(true, 'DEF-1: POST /pet accepts a body without required name/photoUrls');
      const pet = newPet();
      try {
        const res = await petstore.addPet({ id: pet.id });
        expect(res.status).toBeGreaterThanOrEqual(400);
      } finally {
        await petstore.deletePet(pet.id);
      }
    });

    test('status outside the enum (available | pending | sold) is rejected', async ({ petstore }) => {
      test.fail(true, 'DEF-2: POST /pet accepts any string as status');
      const pet = newPet();
      try {
        const res = await petstore.addPet({ ...pet, status: 'weird' });
        expect(res.status).toBeGreaterThanOrEqual(400);
      } finally {
        await petstore.deletePet(pet.id);
      }
    });

    test('POST /pet/{id} with only `status` (name is optional in the spec) updates the status', async ({
      petstore,
    }) => {
      test.fail(true, 'DEF-6: POST /pet/{id}?status=sold without name → 400 "No Name provided"');
      const pet = newPet();
      try {
        await petstore.addPet(pet);
        const res = await petstore.updatePetWithForm(pet.id, { status: 'sold' });
        expect(res.status).toBe(200);
      } finally {
        await petstore.deletePet(pet.id);
      }
    });
  });
});
