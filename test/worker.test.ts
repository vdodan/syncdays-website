import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Env } from '../worker/app';
import worker from '../worker/index';

const ORIGIN = 'https://syncdays.com';
const TURNSTILE_URL = 'challenges.cloudflare.com/turnstile/v0/siteverify';

let turnstileOk: boolean;
let turnstileAnswer: { hostname: string; action: string };
let assetsFetch: ReturnType<typeof vi.fn>;
let sent: unknown[];
let sendFails: boolean;
let limiterAllows: boolean;

function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    ASSETS: { fetch: assetsFetch, connect: vi.fn() } as unknown as Fetcher,
    ENVIRONMENT: 'staging',
    CANONICAL_HOST: 'syncdays.com',
    CONTACT_TO: 'owner@example.test',
    EMAIL_FROM: 'SyncDays website <noreply@syncdays.com>',
    TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
    CONTACT_EMAIL: {
      send: vi.fn(async (msg: unknown) => {
        if (sendFails) throw new Error('send_email rejected');
        sent.push(msg);
        return { messageId: 'm-1' };
      }),
    } as unknown as SendEmail,
    CONTACT_LIMITER: { limit: vi.fn(async () => ({ success: limiterAllows })) } as unknown as RateLimit,
    ...overrides,
  };
}

function contactForm(fields: Record<string, string>): Request {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  return new Request(`${ORIGIN}/api/contact`, {
    method: 'POST',
    body,
    headers: { accept: 'application/json', 'cf-connecting-ip': '203.0.113.7', origin: ORIGIN, referer: `${ORIGIN}/contact` },
  });
}

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.test',
  message: 'Hello from the test suite',
  'cf-turnstile-response': 'token-123',
};

async function run(req: Request, env: Env): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch!(req as Request<unknown, IncomingRequestCfProperties>, env, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

beforeEach(() => {
  turnstileOk = true;
  turnstileAnswer = { hostname: 'syncdays.com', action: 'contact' };
  sendFails = false;
  limiterAllows = true;
  sent = [];
  assetsFetch = vi.fn(async () => new Response('<html>page</html>', { headers: { 'content-type': 'text/html' } }));
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url.includes(TURNSTILE_URL)) {
      return Response.json({ success: turnstileOk, ...turnstileAnswer, 'error-codes': turnstileOk ? [] : ['invalid-input-response'] });
    }
    throw new Error(`unexpected outbound fetch: ${url}`);
  });
});

afterEach(() => vi.restoreAllMocks());

describe('www → apex', () => {
  it('301s www with path and query preserved', async () => {
    const res = await run(new Request('https://www.syncdays.com/pricing?x=1'), makeEnv());
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://syncdays.com/pricing?x=1');
    expect(assetsFetch).not.toHaveBeenCalled();
  });

  it('301s plain http to https (and www to the apex in one hop)', async () => {
    const apex = await run(new Request('http://syncdays.com/pricing?x=1'), makeEnv());
    expect(apex.status).toBe(301);
    expect(apex.headers.get('location')).toBe('https://syncdays.com/pricing?x=1');
    const www = await run(new Request('http://www.syncdays.com/'), makeEnv());
    expect(www.headers.get('location')).toBe('https://syncdays.com/');
    expect(assetsFetch).not.toHaveBeenCalled();
  });

  it('serves the apex from ASSETS', async () => {
    const res = await run(new Request(`${ORIGIN}/pricing`), makeEnv());
    expect(res.status).toBe(200);
    expect(assetsFetch).toHaveBeenCalledOnce();
  });
});

describe('/healthz', () => {
  it('reports app and env', async () => {
    const res = await run(new Request(`${ORIGIN}/healthz`), makeEnv());
    expect(await res.json()).toEqual({ ok: true, app: 'syncdays-website', env: 'staging' });
  });
});

describe('POST /api/contact', () => {
  it('delivers a valid message via send_email with Reply-To set to the sender', async () => {
    const res = await run(contactForm(valid), makeEnv());
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ to: 'owner@example.test', replyTo: 'ada@example.test' });
  });

  it('never reports success when send_email fails', async () => {
    sendFails = true;
    const res = await run(contactForm(valid), makeEnv());
    expect(res.ok).toBe(false);
    expect(sent).toHaveLength(0);
  });

  it('rejects a missing Turnstile token without sending', async () => {
    const { 'cf-turnstile-response': _drop, ...noToken } = valid;
    const res = await run(contactForm(noToken), makeEnv());
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(sent).toHaveLength(0);
  });

  it('rejects a failed Turnstile check without sending', async () => {
    turnstileOk = false;
    const res = await run(contactForm(valid), makeEnv());
    expect(res.status).toBe(403);
    expect(sent).toHaveLength(0);
  });

  it('rejects a token issued for another action or hostname', async () => {
    turnstileAnswer = { hostname: 'syncdays.com', action: 'signup' };
    expect((await run(contactForm(valid), makeEnv())).status).toBe(403);
    turnstileAnswer = { hostname: 'evil.example', action: 'contact' };
    expect((await run(contactForm(valid), makeEnv())).status).toBe(403);
    expect(sent).toHaveLength(0);
  });

  it('rejects a filled honeypot without sending', async () => {
    const res = await run(contactForm({ ...valid, website: 'http://spam.test' }), makeEnv());
    expect(res.ok).toBe(false);
    expect(sent).toHaveLength(0);
  });

  it('rejects oversized messages', async () => {
    const res = await run(contactForm({ ...valid, message: 'x'.repeat(6000) }), makeEnv());
    expect(res.status).toBe(400);
    expect(sent).toHaveLength(0);
  });

  it('rate limits per IP', async () => {
    limiterAllows = false;
    const res = await run(contactForm(valid), makeEnv());
    expect(res.status).toBe(429);
    expect(sent).toHaveLength(0);
  });

  it('refuses (503) when the send_email binding is missing in a deployed env', async () => {
    const res = await run(contactForm(valid), makeEnv({ CONTACT_EMAIL: undefined }));
    expect(res.status).toBe(503);
  });

  it('rejects non-POST', async () => {
    const res = await run(new Request(`${ORIGIN}/api/contact`), makeEnv());
    expect(res.status).toBe(405);
  });
});
