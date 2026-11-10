import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLogger, redact, requestId, withObservability } from '../src/index.js';

let lines: Record<string, unknown>[];
beforeEach(() => {
  lines = [];
  vi.spyOn(console, 'log').mockImplementation((s: unknown) => {
    lines.push(JSON.parse(String(s)) as Record<string, unknown>);
  });
});
afterEach(() => vi.restoreAllMocks());

const ctx = {} as ExecutionContext;

describe('createLogger', () => {
  it('writes one JSON line with context, level and data', () => {
    const log = createLogger({ app: 'demo', env: 'staging', version: 'v1' });
    log.info('hello', { n: 1 });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ level: 'info', msg: 'hello', app: 'demo', env: 'staging', version: 'v1', n: 1 });
    expect(typeof lines[0]!.ts).toBe('string');
  });

  it('redacts secret-ish keys at any depth', () => {
    const log = createLogger({ app: 'demo', env: 'local' });
    log.warn('x', {
      password: 'p',
      apiKey: 'k',
      nested: { Authorization: 'Bearer abc', sessionToken: 't', cookie: 'c', ok: 'visible' },
      list: [{ client_secret: 's' }],
    });
    const text = JSON.stringify(lines[0]);
    for (const v of ['"p"', '"k"', 'Bearer abc', '"t"', '"c"', '"s"']) expect(text).not.toContain(v);
    expect(lines[0]).toMatchObject({ password: '[REDACTED]', apiKey: '[REDACTED]', nested: { ok: 'visible' } });
  });

  it('redacts Headers and handles cycles', () => {
    const a: Record<string, unknown> = { name: 'a' };
    a.self = a;
    const out = redact({ a, headers: new Headers({ cookie: 'x=1', 'content-type': 'text/plain' }) }) as any;
    expect(out.a.self).toBe('[Circular]');
    expect(out.headers).toEqual({ cookie: '[REDACTED]', 'content-type': 'text/plain' });
  });

  it('serializes errors and child loggers inherit context', () => {
    const log = createLogger({ app: 'demo', env: 'local' }).child({ requestId: 'r1' });
    log.error('boom', new Error('bad'), { route: '/x' });
    expect(lines[0]).toMatchObject({ level: 'error', requestId: 'r1', route: '/x', error: { name: 'Error', message: 'bad' } });
    log.error('plain', { token: 'zzz', k: 1 });
    expect(lines[1]).toMatchObject({ token: '[REDACTED]' });
    log.debug('d');
    expect(lines[2]).toMatchObject({ level: 'debug' });
  });
});

describe('requestId', () => {
  it('uses cf-ray when present', () => {
    expect(requestId(new Request('https://x', { headers: { 'cf-ray': 'abc-LHR' } }))).toBe('abc-LHR');
  });
  it('falls back to a UUID', () => {
    expect(requestId(new Request('https://x'))).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe('withObservability', () => {
  it('adds x-request-id and logs one line per request', async () => {
    const h = withObservability<{ ENVIRONMENT: string }>({ app: 'demo' }, {
      fetch: () => new Response('ok', { status: 201 }),
    });
    const res = await h.fetch!(new Request('https://x/path?q=1', { method: 'POST', headers: { 'cf-ray': 'ray1' } }) as any, { ENVIRONMENT: 'preview' }, ctx);
    expect(res.status).toBe(201);
    expect(res.headers.get('x-request-id')).toBe('ray1');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ msg: 'request', method: 'POST', path: '/path', status: 201, env: 'preview', app: 'demo', requestId: 'ray1' });
    expect(typeof lines[0]!.ms).toBe('number');
  });

  it('handles immutable response headers', async () => {
    const h = withObservability({ app: 'demo' }, { fetch: async () => fetchLike() });
    const res = await h.fetch!(new Request('https://x/') as any, {}, ctx);
    expect(res.headers.get('x-request-id')).toBeTruthy();
    expect(await res.text()).toBe('immutable');
  });

  it('turns thrown errors into a 500 JSON response', async () => {
    const h = withObservability({ app: 'demo' }, {
      fetch: () => {
        throw new Error('kaput');
      },
    });
    const res = await h.fetch!(new Request('https://x/a', { headers: { 'cf-ray': 'r' } }) as any, {}, ctx);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'internal', requestId: 'r' });
    expect(lines[0]).toMatchObject({ level: 'error', status: 500, error: { message: 'kaput' } });
  });

  it('passes other handlers through and leaves fetch-less handlers alone', () => {
    const scheduled = vi.fn();
    const h = withObservability({ app: 'demo' }, { fetch: () => new Response(), scheduled });
    expect(h.scheduled).toBe(scheduled);
    const noFetch = { scheduled };
    expect(withObservability({ app: 'demo' }, noFetch)).toBe(noFetch);
  });
});

function fetchLike(): Response {
  const res = new Response('immutable');
  const frozen = new Headers(res.headers);
  Object.defineProperty(res, 'headers', {
    get: () =>
      new Proxy(frozen, {
        get(target, prop) {
          if (prop === 'set') return () => { throw new TypeError('immutable'); };
          const v = Reflect.get(target, prop);
          return typeof v === 'function' ? v.bind(target) : v;
        },
      }),
  });
  return res;
}
