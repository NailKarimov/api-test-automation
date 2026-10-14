# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: petstore/pet-search.spec.ts >> Pet search >> a new pet shows up under its status and moves when the status changes
- Location: tests/petstore/pet-search.spec.ts:23:7

# Error details

```
Error: Response does not match the contract

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 6

- Array []
+ Array [
+   "5.tags.0.id: Too big: expected int to be <=9007199254740991",
+   "5.tags.1.id: Too big: expected int to be <=9007199254740991",
+   "5.tags.2.id: Too big: expected int to be <=9007199254740991",
+   "5.tags.3.id: Too big: expected int to be <=9007199254740991",
+ ]
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { z } from 'zod';
  3  | 
  4  | /** Validates a response body against a zod schema and fails with readable field paths. */
  5  | export function expectSchema<S extends z.ZodType>(schema: S, body: unknown): z.infer<S> {
  6  |   const result = schema.safeParse(body);
  7  |   const issues = result.success
  8  |     ? []
  9  |     : result.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`);
> 10 |   expect(issues, 'Response does not match the contract').toEqual([]);
     |                                                          ^ Error: Response does not match the contract
  11 |   return result.data as z.infer<S>;
  12 | }
  13 | 
```