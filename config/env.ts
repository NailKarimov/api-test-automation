import 'dotenv/config';

/** Reads a variable from the environment (or .env) and falls back to a default. */
function read(name: string, fallback = ''): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value.trim() : fallback;
}

/**
 * Test environment settings. Secrets are never stored in the repository:
 * locally they come from .env, in CI from repository secrets.
 */
export const env = {
  /** OpenWeather */
  apiBaseUrl: read('API_BASE_URL', 'https://api.openweathermap.org'),
  apiKey: read('OPENWEATHER_API_KEY'),
  /**
   * Swagger Petstore v3: the private container from infra/petstore (npm run fuzz:up), so results never
   * depend on other people's data in the shared sandbox. The trailing slash matters for relative paths.
   */
  petstoreBaseUrl: read('PETSTORE_BASE_URL', 'http://localhost:8090/api/v3/'),
  /** The public deployment; only the security-header checks use it (TLS and headers are what they test). */
  petstorePublicUrl: read('PETSTORE_PUBLIC_URL', 'https://petstore3.swagger.io/api/v3/'),
  /** Rick and Morty API: GraphQL at /graphql and the same data over REST at /api (public, no key). */
  rickAndMortyBaseUrl: read('RICKANDMORTY_BASE_URL', 'https://rickandmortyapi.com/'),
  /** In CI a missing Petstore container must fail the run instead of silently skipping its tests. */
  requireStack: read('REQUIRE_STACK') === '1',
};
