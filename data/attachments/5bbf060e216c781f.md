# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security/headers.spec.ts >> Security headers: Petstore >> Server header does not reveal a version
- Location: tests/security/headers.spec.ts:96:9

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
  32  |     // Not pet/1: the public sandbox is shared, and on 23.10.2026 someone had deleted pet 1, so the sanity check
  33  |     // answered 404. A search by status answers 200 whatever the data is.
  34  |     url: `${env.petstorePublicUrl}pet/findByStatus?status=available`,
  35  |     optionsUrl: `${env.petstorePublicUrl}pet`,
  36  |     errorUrl: `${env.petstorePublicUrl}pet/${'x'.repeat(20)}`,
  37  |     defects: {
  38  |       hsts: 'SEC-4: no Strict-Transport-Security header',
  39  |       nosniff: 'SEC-5: no X-Content-Type-Options header',
  40  |       'server-version': 'SEC-6: Server header discloses "Jetty(9.4.53.v20231009)"',
  41  |       'options-body': 'SEC-7: OPTIONS answers with a WADL description of the API',
  42  |       'stack-trace': 'SEC-8: error message reveals the internal class `java.lang.Long`',
  43  |     },
  44  |   },
  45  | ];
  46  | 
  47  | const EVIL_ORIGIN = 'https://evil.example';
  48  | const STACK_TRACE =
  49  |   /\bat [\w$.]+\([\w$.]+\.(java|js|ts):\d+|java\.lang\.|Traceback \(most recent|node_modules|\.java:\d+/;
  50  | 
  51  | for (const target of TARGETS) {
  52  |   test.describe(`Security headers: ${target.name}`, { tag: '@security' }, () => {
  53  |     const isHttps = target.url.startsWith('https://');
  54  | 
  55  |     let client: ApiClient;
  56  | 
  57  |     test.beforeEach(async ({ request }) => {
  58  |       if (target.name === 'OpenWeather' && !target.apiKey) throw new Error('OPENWEATHER_API_KEY is not set');
  59  |       client = new ApiClient(request, target.apiKey);
  60  |     });
  61  | 
  62  |     /** Marks the test as a known defect when the target lists one for this check. */
  63  |     function knownDefect(check: string): void {
  64  |       const defect = target.defects[check];
  65  |       if (defect) test.fail(true, defect);
  66  |     }
  67  | 
  68  |     const get = (headers: Record<string, string> = {}): Promise<ApiResult> =>
  69  |       client.send('GET', target.url, { headers });
  70  | 
  71  |     test('sanity: the endpoint answers 200', async () => {
  72  |       expect((await get()).status).toBe(200);
  73  |     });
  74  | 
  75  |     test('Strict-Transport-Security is set with a max-age of at least 180 days', async () => {
  76  |       test.skip(!isHttps, 'HSTS only applies to HTTPS');
  77  |       knownDefect('hsts');
  78  |       const hsts = (await get()).response.headers()['strict-transport-security'];
  79  | 
  80  |       expect(hsts, 'Strict-Transport-Security header').toBeDefined();
  81  |       expect(Number(/max-age=(\d+)/.exec(hsts ?? '')?.[1])).toBeGreaterThanOrEqual(15_552_000);
  82  |     });
  83  | 
  84  |     test('X-Content-Type-Options is "nosniff"', async () => {
  85  |       knownDefect('nosniff');
  86  | 
  87  |       expect((await get()).response.headers()['x-content-type-options']).toBe('nosniff');
  88  |     });
  89  | 
  90  |     test('X-Powered-By does not reveal the framework', async () => {
  91  |       knownDefect('powered-by');
  92  | 
  93  |       expect((await get()).response.headers()['x-powered-by']).toBeUndefined();
  94  |     });
  95  | 
  96  |     test('Server header does not reveal a version', async () => {
  97  |       knownDefect('server-version');
  98  |       const server = (await get()).response.headers()['server'] ?? '';
  99  | 
> 100 |       expect(server).not.toMatch(/\d+\.\d+/);
      |                          ^ Error: expect(received).not.toMatch(expected)
  101 |     });
  102 | 
  103 |     test('CORS does not reflect an arbitrary origin or combine "*" with credentials', async () => {
  104 |       knownDefect('cors');
  105 |       const h = (await get({ Origin: EVIL_ORIGIN })).response.headers();
  106 |       const allowOrigin = h['access-control-allow-origin'];
  107 |       const allowCredentials = h['access-control-allow-credentials'];
  108 | 
  109 |       // Credentials may be allowed only for a specific, trusted origin: never for "*" or for any origin sent.
  110 |       expect(allowCredentials === 'true' && allowOrigin === '*', '"*" combined with credentials').toBe(false);
  111 |       expect(allowOrigin).not.toBe(EVIL_ORIGIN);
  112 |     });
  113 | 
  114 |     test('OPTIONS does not return a description of the API', async () => {
  115 |       knownDefect('options-body');
  116 |       const res = await client.send('OPTIONS', target.optionsUrl ?? target.url, {
  117 |         // No JSON preference: a server may describe itself (WADL) to clients that accept anything.
  118 |         headers: { Accept: '*/*', Origin: EVIL_ORIGIN, 'Access-Control-Request-Method': 'GET' },
  119 |       });
  120 | 
  121 |       expect(res.contentType).not.toMatch(/wadl|xml/);
  122 |       expect(res.text).not.toMatch(/<application\b|<resources\b/);
  123 |     });
  124 | 
  125 |     test('an error response does not leak internals (stack trace, class names)', async () => {
  126 |       knownDefect('stack-trace');
  127 |       const res = await client.send('GET', target.errorUrl);
  128 | 
  129 |       expect(res.text).not.toMatch(STACK_TRACE);
  130 |     });
  131 |   });
  132 | }
  133 | 
```