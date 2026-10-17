import type { ApiClient, ApiResult } from '../api/ApiClient';

export type GraphQLError = {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: { code?: string; exception?: { stacktrace?: string[] } } & Record<string, unknown>;
};
/** The GraphQL response envelope: `data` and/or `errors`, whatever the HTTP status says. */
export type GraphQLResponse<T> = { data?: T | null; errors?: GraphQLError[] };
export type Operation = { query: string; variables?: Record<string, unknown>; operationName?: string };

/**
 * GraphQL over HTTP on top of ApiClient (so every request and response lands in the report).
 * One endpoint for everything: the operation travels in the body (POST) or in the query string (GET).
 */
export class GraphQLClient {
  constructor(
    readonly api: ApiClient,
    private readonly path = 'graphql',
  ) {}

  /** POST { query, variables, operationName } */
  query<T = Record<string, unknown>>(
    query: string,
    variables?: Record<string, unknown>,
    operationName?: string,
  ): Promise<ApiResult<GraphQLResponse<T>>> {
    return this.api.post<GraphQLResponse<T>>(this.path, { body: { query, variables, operationName } });
  }

  /** GET ?query=…&variables=… (cacheable by CDNs; only queries, never mutations). */
  get<T = Record<string, unknown>>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<ApiResult<GraphQLResponse<T>>> {
    return this.api.get<GraphQLResponse<T>>(this.path, {
      query,
      variables: variables ? JSON.stringify(variables) : undefined,
    });
  }

  /** Several operations in one HTTP request (Apollo-style batching): the body is an array. */
  batch(ops: Operation[]): Promise<ApiResult<GraphQLResponse<Record<string, unknown>>[]>> {
    return this.api.post(this.path, { body: ops });
  }

  /** Raw body, for malformed requests. */
  raw(data: string, contentType = 'application/json'): Promise<ApiResult<GraphQLResponse<unknown>>> {
    return this.api.post(this.path, { raw: { data, contentType } });
  }
}

/**
 * A query whose deepest field sits at `depth` (root field = depth 0), walking
 * character → episode → characters → episode → … as graphql-depth-limit counts it.
 */
export function nestedQuery(depth: number, rootId = 1): string {
  const chain = ['episode', 'characters'];
  let inner = 'name';
  for (let d = depth - 1; d >= 1; d--) inner = `${chain[(d - 1) % 2]} { ${inner} }`;
  return `query Nested { character(id: ${rootId}) { ${inner} } }`;
}
