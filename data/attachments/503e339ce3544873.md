# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: petstore/pet-search.spec.ts >> Pet search >> findByStatus=available returns only pets with that status
- Location: tests/petstore/pet-search.spec.ts:17:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  1   | import {
  2   |   test,
  3   |   expect,
  4   |   expectSchema,
  5   |   petListSchema,
  6   |   petSchema,
  7   |   petstoreErrorSchema,
  8   |   newPet,
  9   |   PET_STATUSES,
  10  | } from '../../src';
  11  | 
  12  | test.describe('Pet search', () => {
  13  |   // Each test creates its own pet, validates that record strictly and checks only `status` on the rest:
  14  |   // the DEF-1 test (running in parallel) may store a pet without `name`, which the search then returns.
  15  |   // Such records are reported as DEF-7 instead of failing the run.
  16  |   for (const status of PET_STATUSES) {
  17  |     test(`findByStatus=${status} returns only pets with that status`, async ({ petstore }) => {
  18  |       const pet = newPet({ status });
  19  |       try {
  20  |         await petstore.addPet(pet);
  21  |         const res = await petstore.findByStatus(status);
  22  | 
> 23  |         expect(res.status).toBe(200);
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  24  |         expect(Array.isArray(res.body)).toBe(true);
  25  |         const items = res.body as { id?: number; status?: string }[];
  26  |         const mine = items.find((p) => p.id === pet.id);
  27  |         expect(mine, 'our pet is in the result').toBeDefined();
  28  |         expectSchema(petSchema, mine);
  29  |         expect(items.every((p) => p.status === status)).toBe(true);
  30  | 
  31  |         const invalid = items.filter((p) => !petSchema.safeParse(p).success).length;
  32  |         if (invalid) {
  33  |           test.info().annotations.push({
  34  |             type: 'DEF-7',
  35  |             description: `${invalid} of ${items.length} returned pets break the Pet schema (stored through DEF-1)`,
  36  |           });
  37  |         }
  38  |       } finally {
  39  |         await petstore.deletePet(pet.id);
  40  |       }
  41  |     });
  42  |   }
  43  | 
  44  |   test('a new pet shows up under its status and moves when the status changes', async ({ petstore }) => {
  45  |     const pet = newPet({ status: 'pending' });
  46  |     try {
  47  |       await petstore.addPet(pet);
  48  |       const pending = expectSchema(petListSchema, (await petstore.findByStatus('pending')).body);
  49  |       expect(pending.map((p) => p.id)).toContain(pet.id);
  50  | 
  51  |       await petstore.updatePetWithForm(pet.id, { name: pet.name, status: 'sold' });
  52  |       const afterPending = expectSchema(petListSchema, (await petstore.findByStatus('pending')).body);
  53  |       const sold = expectSchema(petListSchema, (await petstore.findByStatus('sold')).body);
  54  |       expect(afterPending.map((p) => p.id)).not.toContain(pet.id);
  55  |       expect(sold.map((p) => p.id)).toContain(pet.id);
  56  |     } finally {
  57  |       await petstore.deletePet(pet.id);
  58  |     }
  59  |   });
  60  | 
  61  |   test('findByStatus with an unknown value → 400', async ({ petstore }) => {
  62  |     const res = await petstore.findByStatus('bogus');
  63  | 
  64  |     expect(res.status).toBe(400);
  65  |     expect(expectSchema(petstoreErrorSchema, res.body).message).toContain('status');
  66  |   });
  67  | 
  68  |   test('findByStatus without the required parameter → 400', async ({ petstore }) => {
  69  |     expect((await petstore.findByStatus()).status).toBe(400);
  70  |   });
  71  | 
  72  |   test('findByTags finds a pet by its unique tag', async ({ petstore }) => {
  73  |     const pet = newPet();
  74  |     const tag = pet.tags![0].name!;
  75  |     try {
  76  |       await petstore.addPet(pet);
  77  |       const res = await petstore.findByTags(tag);
  78  |       test.skip(
  79  |         res.status === 500,
  80  |         'DEF-7: findByTags answers 500 while the store holds a pet with invalid tags (DEF-1 lets one in; also FZ-1)',
  81  |       );
  82  | 
  83  |       expect(res.status).toBe(200);
  84  |       expect(expectSchema(petListSchema, res.body).map((p) => p.id)).toEqual([pet.id]);
  85  |     } finally {
  86  |       await petstore.deletePet(pet.id);
  87  |     }
  88  |   });
  89  | 
  90  |   test('findByTags with a tag nobody uses → empty list, not an error', async ({ petstore }) => {
  91  |     const res = await petstore.findByTags(`no-such-tag-${newPet().id}`);
  92  |     test.skip(
  93  |       res.status === 500,
  94  |       'DEF-7: findByTags answers 500 while the store holds a pet with invalid tags (DEF-1 lets one in; also FZ-1)',
  95  |     );
  96  | 
  97  |     expect(res.status).toBe(200);
  98  |     expect(res.body).toEqual([]);
  99  |   });
  100 | });
  101 | 
```