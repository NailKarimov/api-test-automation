import { ApiClient, ApiResult } from '../api/ApiClient';
import type { NewPet, PetStatus } from './schemas';

/**
 * Swagger Petstore v3 endpoints. Paths are relative (no leading slash) so they resolve against the
 * `/api/v3/` base URL.
 */
export class PetstoreClient {
  constructor(readonly api: ApiClient) {}

  /** Add a new pet — POST /pet */
  addPet(pet: NewPet | Record<string, unknown>): Promise<ApiResult> {
    return this.api.post('pet', { body: pet });
  }

  /** Update an existing pet (full replacement) — PUT /pet */
  updatePet(pet: NewPet | Record<string, unknown>): Promise<ApiResult> {
    return this.api.put('pet', { body: pet });
  }

  /** Find pet by id — GET /pet/{petId}; accepts a string to test invalid ids. */
  getPet(id: number | string): Promise<ApiResult> {
    return this.api.get(`pet/${id}`);
  }

  /** Update name and/or status through query parameters — POST /pet/{petId} */
  updatePetWithForm(id: number, fields: { name?: string; status?: PetStatus }): Promise<ApiResult> {
    return this.api.post(`pet/${id}`, { query: fields });
  }

  /** Delete a pet — DELETE /pet/{petId} */
  deletePet(id: number | string): Promise<ApiResult> {
    return this.api.delete(`pet/${id}`);
  }

  /** GET /pet/findByStatus */
  findByStatus(status?: string): Promise<ApiResult> {
    return this.api.get('pet/findByStatus', { status });
  }

  /** GET /pet/findByTags */
  findByTags(tags?: string): Promise<ApiResult> {
    return this.api.get('pet/findByTags', { tags });
  }

  /** POST /pet with a hand-made body and content type (malformed JSON, wrong media type). */
  addPetRaw(data: string, contentType: string): Promise<ApiResult> {
    return this.api.post('pet', { raw: { data, contentType } });
  }

  /** POST /user — create a user. */
  createUser(user: Record<string, unknown>): Promise<ApiResult> {
    return this.api.post('user', { body: user });
  }

  /** GET /user/login */
  login(username: string, password: string): Promise<ApiResult> {
    return this.api.get('user/login', { username, password });
  }

  /** GET /user/logout */
  logout(): Promise<ApiResult> {
    return this.api.get('user/logout');
  }

  /** GET /store/inventory — pet counts by status. */
  inventory(): Promise<ApiResult> {
    return this.api.get('store/inventory');
  }

  /** POST /store/order */
  placeOrder(order: Record<string, unknown>): Promise<ApiResult> {
    return this.api.post('store/order', { body: order });
  }

  /** GET /openapi.json — the API's own contract. */
  openApi(): Promise<ApiResult> {
    return this.api.get('openapi.json');
  }
}
