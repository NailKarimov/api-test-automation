# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security/headers.spec.ts >> Security headers: Petstore >> Server header does not reveal a version
- Location: tests/security/headers.spec.ts:94:9

# Error details

```
Error: expect(received).not.toMatch(expected)

Expected pattern: not /\d+\.\d+/
Received string:      "Jetty(9.4.53.v20231009)"
```

# Test source

```ts
  1   | import { test, expect, env } from '../../src';
  2   | import { ApiClient, type ApiResult } from '../../src/api/ApiClient';
  3   | 
  4   | /** One system under test: an absolute URL of a cheap, valid GET endpoint. */
  5   | type Target = {
  6   |   name: string;
  7   |   url: string;
  8   |   /** Appended as `appid` to every request. */
  9   |   apiKey?: string;
  10  |   /** Collection endpoint used for the OPTIONS check (defaults to `url`). */
  11  |   optionsUrl?: string;
  12  |   /** A request the server must reject, used to inspect its error body. */
  13  |   errorUrl: string;
  14  |   /** Known deviations: check id → defect id. The test is expected to fail until the server is fixed. */
  15  |   defects: Record<string, string>;
  16  | };
  17  | 
  18  | const TARGETS: Target[] = [
  19  |   {
  20  |     name: 'OpenWeather',
  21  |     url: `${env.apiBaseUrl}/data/2.5/weather?q=Riga`,
  22  |     apiKey: env.apiKey,
  23  |     errorUrl: `${env.apiBaseUrl}/data/2.5/weather?lat=abc&lon='"<>`,
  24  |     defects: {
  25  |       hsts: 'SEC-1: no Strict-Transport-Security header',
  26  |       nosniff: 'SEC-2: no X-Content-Type-Options header',
  27  |       cors: 'SEC-3: Access-Control-Allow-Origin "*" together with Allow-Credentials "true"',
  28  |     },
  29  |   },
  30  |   {
  31  |     name: 'Petstore',
  32  |     url: `${env.petstorePublicUrl}pet/1`,
  33  |     optionsUrl: `${env.petstorePublicUrl}pet`,
  34  |     errorUrl: `${env.petstorePublicUrl}pet/${'x'.repeat(20)}`,
  35  |     defects: {
  36  |       hsts: 'SEC-4: no Strict-Transport-Security header',
  37  |       nosniff: 'SEC-5: no X-Content-Type-Options header',
  38  |       'server-version': 'SEC-6: Server header discloses "Jetty(9.4.53.v20231009)"',
  39  |       'options-body': 'SEC-7: OPTIONS answers with a WADL description of the API',
  40  |       'stack-trace': 'SEC-8: error message reveals the internal class `java.lang.Long`',
  41  |     },
  42  |   },
  43  | ];
  44  | 
  45  | const EVIL_ORIGIN = 'https://evil.example';
  46  | const STACK_TRACE =
  47  |   /\bat [\w$.]+\([\w$.]+\.(java|js|ts):\d+|java\.lang\.|Traceback \(most recent|node_modules|\.java:\d+/;
  48  | 
  49  | for (const target of TARGETS) {
  50  |   test.describe(`Security headers: ${target.name}`, { tag: '@security' }, () => {
  51  |     const isHttps = target.url.startsWith('https://');
  52  | 
  53  |     let client: ApiClient;
  54  | 
  55  |     test.beforeEach(async ({ request }) => {
  56  |       if (target.name === 'OpenWeather' && !target.apiKey) throw new Error('OPENWEATHER_API_KEY is not set');
  57  |       client = new ApiClient(request, target.apiKey);
  58  |     });
  59  | 
  60  |     /** Marks the test as a known defect when the target lists one for this check. */
  61  |     function knownDefect(check: string): void {
  62  |       const defect = target.defects[check];
  63  |       if (defect) test.fail(true, defect);
  64  |     }
  65  | 
  66  |     const get = (headers: Record<string, string> = {}): Promise<ApiResult> =>
  67  |       client.send('GET', target.url, { headers });
  68  | 
  69  |     test('sanity: the endpoint answers 200', async () => {
  70  |       expect((await get()).status).toBe(200);
  71  |     });
  72  | 
  73  |     test('Strict-Transport-Security is set with a max-age of at least 180 days', async () => {
  74  |       test.skip(!isHttps, 'HSTS only applies to HTTPS');
  75  |       knownDefect('hsts');
  76  |       const hsts = (await get()).response.headers()['strict-transport-security'];
  77  | 
  78  |       expect(hsts, 'Strict-Transport-Security header').toBeDefined();
  79  |       expect(Number(/max-age=(\d+)/.exec(hsts ?? '')?.[1])).toBeGreaterThanOrEqual(15_552_000);
  80  |     });
  81  | 
  82  |     test('X-Content-Type-Options is "nosniff"', async () => {
  83  |       knownDefect('nosniff');
  84  | 
  85  |       expect((await get()).response.headers()['x-content-type-options']).toBe('nosniff');
  86  |     });
  87  | 
  88  |     test('X-Powered-By does not reveal the framework', async () => {
  89  |       knownDefect('powered-by');
  90  | 
  91  |       expect((await get()).response.headers()['x-powered-by']).toBeUndefined();
  92  |     });
  93  | 
  94  |     test('Server header does not reveal a version', async () => {
  95  |       knownDefect('server-version');
  96  |       const server = (await get()).response.headers()['server'] ?? '';
  97  | 
> 98  |       expect(server).not.toMatch(/\d+\.\d+/);
      |                          ^ Error: expect(received).not.toMatch(expected)
  99  |     });
  100 | 
  101 |     test('CORS does not reflect an arbitrary origin or combine "*" with credentials', async () => {
  102 |       knownDefect('cors');
  103 |       const h = (await get({ Origin: EVIL_ORIGIN })).response.headers();
  104 |       const allowOrigin = h['access-control-allow-origin'];
  105 |       const allowCredentials = h['access-control-allow-credentials'];
  106 | 
  107 |       // Credentials may be allowed only for a specific, trusted origin: never for "*" or for any origin sent.
  108 |       expect(allowCredentials === 'true' && allowOrigin === '*', '"*" combined with credentials').toBe(false);
  109 |       expect(allowOrigin).not.toBe(EVIL_ORIGIN);
  110 |     });
  111 | 
  112 |     test('OPTIONS does not return a description of the API', async () => {
  113 |       knownDefect('options-body');
  114 |       const res = await client.send('OPTIONS', target.optionsUrl ?? target.url, {
  115 |         // No JSON preference: a server may describe itself (WADL) to clients that accept anything.
  116 |         headers: { Accept: '*/*', Origin: EVIL_ORIGIN, 'Access-Control-Request-Method': 'GET' },
  117 |       });
  118 | 
  119 |       expect(res.contentType).not.toMatch(/wadl|xml/);
  120 |       expect(res.text).not.toMatch(/<application\b|<resources\b/);
  121 |     });
  122 | 
  123 |     test('an error response does not leak internals (stack trace, class names)', async () => {
  124 |       knownDefect('stack-trace');
  125 |       const res = await client.send('GET', target.errorUrl);
  126 | 
  127 |       expect(res.text).not.toMatch(STACK_TRACE);
  128 |     });
  129 |   });
  130 | }
  131 | 
```