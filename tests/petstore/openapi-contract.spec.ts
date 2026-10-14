import { test, expect } from '../../src';

/** The API describes itself; these tests guard against the contract changing under the test suite. */
test.describe('OpenAPI document /openapi.json', () => {
  type Spec = { openapi: string; paths: Record<string, Record<string, unknown>> };

  test('is served as JSON and declares OpenAPI 3.x', async ({ petstore }) => {
    const res = await petstore.openApi();

    expect(res.status).toBe(200);
    expect(res.contentType).toContain('json');
    expect((res.body as Spec).openapi).toMatch(/^3\./);
  });

  test('declares every operation the suite relies on', async ({ petstore }) => {
    const { paths } = (await petstore.openApi()).body as Spec;
    const operations = Object.entries(paths).flatMap(([path, methods]) =>
      Object.keys(methods).map((m) => `${m.toUpperCase()} ${path}`),
    );

    expect(operations).toEqual(
      expect.arrayContaining([
        'POST /pet',
        'PUT /pet',
        'GET /pet/{petId}',
        'POST /pet/{petId}',
        'DELETE /pet/{petId}',
        'GET /pet/findByStatus',
        'GET /pet/findByTags',
        'GET /user/login',
        'GET /user/logout',
        'GET /store/inventory',
        'POST /store/order',
        'POST /user',
      ]),
    );
  });

  test('Pet requires name and photoUrls; status is an enum of three values', async ({ petstore }) => {
    const spec = (await petstore.openApi()).body as {
      components: { schemas: { Pet: { required: string[]; properties: { status: { enum: string[] } } } } };
    };
    const pet = spec.components.schemas.Pet;

    expect(pet.required).toEqual(expect.arrayContaining(['name', 'photoUrls']));
    expect(pet.properties.status.enum).toEqual(['available', 'pending', 'sold']);
  });
});
