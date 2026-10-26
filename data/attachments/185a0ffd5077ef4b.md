# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: petstore/pet-validation.spec.ts >> Pet input validation (negative tests) >> known defects (server is more lenient than its own OpenAPI document) >> POST /pet/{id} with only `status` (name is optional in the spec) updates the status
- Location: tests/petstore/pet-validation.spec.ts:73:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  1  | import { test, expect, expectSchema, petstoreErrorSchema, newPet } from '../../src';
  2  | 
  3  | test.describe('Pet input validation (negative tests)', () => {
  4  |   test('unknown id → 404', async ({ petstore }) => {
  5  |     const res = await petstore.getPet(newPet().id);
  6  | 
  7  |     expect(res.status).toBe(404);
  8  |     expect(res.text).toContain('Pet not found');
  9  |   });
  10 | 
  11 |   test('negative id → 404', async ({ petstore }) => {
  12 |     expect((await petstore.getPet(-5)).status).toBe(404);
  13 |   });
  14 | 
  15 |   for (const id of ['abc', '1.5', 'null']) {
  16 |     test(`non-numeric id "${id}" → 400`, async ({ petstore }) => {
  17 |       const res = await petstore.getPet(id);
  18 | 
  19 |       expect(res.status).toBe(400);
  20 |       expectSchema(petstoreErrorSchema, res.body);
  21 |     });
  22 |   }
  23 | 
  24 |   test('malformed JSON → 400', async ({ petstore }) => {
  25 |     const res = await petstore.addPetRaw('{bad json', 'application/json');
  26 | 
  27 |     expect(res.status).toBe(400);
  28 |     expect(expectSchema(petstoreErrorSchema, res.body).code).toBe(400);
  29 |   });
  30 | 
  31 |   test('id of the wrong type (string instead of integer) → 400', async ({ petstore }) => {
  32 |     const res = await petstore.addPet({ id: 'not-a-number', name: 'x', photoUrls: [] });
  33 | 
  34 |     expect(res.status).toBe(400);
  35 |   });
  36 | 
  37 |   test('unsupported media type (text/plain) → 415', async ({ petstore }) => {
  38 |     const res = await petstore.addPetRaw('hello', 'text/plain');
  39 | 
  40 |     expect(res.status).toBe(415);
  41 |   });
  42 | 
  43 |   test('DELETE with a non-numeric id → 400', async ({ petstore }) => {
  44 |     expect((await petstore.deletePet('abc')).status).toBe(400);
  45 |   });
  46 | 
  47 |   // The OpenAPI document says `name` and `photoUrls` are required and `status` is an enum,
  48 |   // but the sandbox accepts such requests. test.fail() documents the known defect: the test is
  49 |   // reported as passed while it fails, and turns red as soon as the server starts validating.
  50 |   test.describe('known defects (server is more lenient than its own OpenAPI document)', () => {
  51 |     test('pet without the required `name` is rejected', async ({ petstore }) => {
  52 |       test.fail(true, 'DEF-1: POST /pet accepts a body without required name/photoUrls');
  53 |       const pet = newPet();
  54 |       try {
  55 |         const res = await petstore.addPet({ id: pet.id });
  56 |         expect(res.status).toBeGreaterThanOrEqual(400);
  57 |       } finally {
  58 |         await petstore.deletePet(pet.id);
  59 |       }
  60 |     });
  61 | 
  62 |     test('status outside the enum (available | pending | sold) is rejected', async ({ petstore }) => {
  63 |       test.fail(true, 'DEF-2: POST /pet accepts any string as status');
  64 |       const pet = newPet();
  65 |       try {
  66 |         const res = await petstore.addPet({ ...pet, status: 'weird' });
  67 |         expect(res.status).toBeGreaterThanOrEqual(400);
  68 |       } finally {
  69 |         await petstore.deletePet(pet.id);
  70 |       }
  71 |     });
  72 | 
  73 |     test('POST /pet/{id} with only `status` (name is optional in the spec) updates the status', async ({
  74 |       petstore,
  75 |     }) => {
  76 |       test.fail(true, 'DEF-6: POST /pet/{id}?status=sold without name → 400 "No Name provided"');
  77 |       const pet = newPet();
  78 |       try {
  79 |         await petstore.addPet(pet);
  80 |         const res = await petstore.updatePetWithForm(pet.id, { status: 'sold' });
> 81 |         expect(res.status).toBe(200);
     |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  82 |       } finally {
  83 |         await petstore.deletePet(pet.id);
  84 |       }
  85 |     });
  86 |   });
  87 | });
  88 | 
```