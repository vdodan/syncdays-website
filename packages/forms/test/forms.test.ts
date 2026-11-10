import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmailTransport } from '@vdodan/email';
import { handleContactForm, isHoneypotTripped, TURNSTILE_VERIFY_URL, verifyTurnstile } from '../src/index.js';

const RESEND = 'https://api.resend.com/emails';

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>;
let routes: Record<string, Handler>;
let calls: { url: string; init: RequestInit }[];

beforeEach(() => {
  calls = [];
  routes = {
    [TURNSTILE_VERIFY_URL]: () => Response.json({ success: true, hostname: 'example.com' }),
    [RESEND]: () => Response.json({ id: 'em_1' }),
  };
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request, init: RequestInit = {}) => {
      const url = String(input instanceof Request ? input.url : input);
      calls.push({ url, init });
      const h = routes[url];
      if (!h) throw new Error(`unexpected fetch ${url}`);
      return h(url, init);
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const env = {
  TURNSTILE_SECRET_KEY: 'ts-secret',
  RESEND_API_KEY: 're_key',
  EMAIL_FROM: 'Site <no-reply@example.com>',
  CONTACT_TO: 'owner@example.com',
  ENVIRONMENT: 'production',
};

function post(fields: Record<string, string>, headers: Record<string, string> = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return new Request('https://example.com/api/contact', { method: 'POST', body: fd, headers });
}

const good = { name: 'Ada', email: 'ada@example.com', message: 'Hello <b>there</b>', 'cf-turnstile-response': 'tok' };

describe('verifyTurnstile', () => {
  it('posts secret, token and ip to siteverify', async () => {
    await expect(verifyTurnstile('tok', 'sec', '1.2.3.4')).resolves.toBe(true);
    const body = calls[0]!.init.body as URLSearchParams;
    expect(calls[0]!.url).toBe(TURNSTILE_VERIFY_URL);
    expect(body.get('secret')).toBe('sec');
    expect(body.get('response')).toBe('tok');
    expect(body.get('remoteip')).toBe('1.2.3.4');
  });
  it('returns false for missing token without calling the API', async () => {
    await expect(verifyTurnstile(null, 'sec')).resolves.toBe(false);
    await expect(verifyTurnstile('', 'sec')).resolves.toBe(false);
    expect(calls).toHaveLength(0);
  });
  it('returns false on failure, HTTP error, network error and hostname mismatch', async () => {
    routes[TURNSTILE_VERIFY_URL] = () => Response.json({ success: false, 'error-codes': ['invalid-input-response'] });
    await expect(verifyTurnstile('t', 's')).resolves.toBe(false);
    routes[TURNSTILE_VERIFY_URL] = () => new Response('x', { status: 500 });
    await expect(verifyTurnstile('t', 's')).resolves.toBe(false);
    routes[TURNSTILE_VERIFY_URL] = () => { throw new TypeError('network'); };
    await expect(verifyTurnstile('t', 's')).resolves.toBe(false);
    routes[TURNSTILE_VERIFY_URL] = () => Response.json({ success: true, hostname: 'evil.com' });
    await expect(verifyTurnstile('t', 's', null, { expectedHostname: 'example.com' })).resolves.toBe(false);
  });
});

describe('isHoneypotTripped', () => {
  it('detects a filled honeypot field', () => {
    const fd = new FormData();
    expect(isHoneypotTripped(fd)).toBe(false);
    fd.set('website', '   ');
    expect(isHoneypotTripped(fd)).toBe(false);
    fd.set('website', 'http://spam');
    expect(isHoneypotTripped(fd)).toBe(true);
    fd.set('url2', 'x');
    expect(isHoneypotTripped(fd, 'url2')).toBe(true);
  });
});

describe('handleContactForm', () => {
  it('sends the email and redirects 303 to ?sent=1 (same-origin referer)', async () => {
    const res = await handleContactForm(post(good, { referer: 'https://example.com/contact#form', 'cf-connecting-ip': '9.9.9.9' }), env);
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('https://example.com/contact?sent=1');
    const resend = calls.find((c) => c.url === RESEND)!;
    const payload = JSON.parse(String(resend.init.body));
    expect(payload).toMatchObject({ to: ['owner@example.com'], reply_to: 'ada@example.com', from: env.EMAIL_FROM });
    expect(payload.html).toContain('&lt;b&gt;there&lt;/b&gt;');
    expect((calls[0]!.init.body as URLSearchParams).get('remoteip')).toBe('9.9.9.9');
  });

  it('ignores cross-origin referers', async () => {
    const res = await handleContactForm(post(good, { referer: 'https://evil.com/x' }), env);
    expect(res.headers.get('location')).toBe('https://example.com/api/contact?sent=1');
  });

  it('returns JSON when Accept: application/json', async () => {
    const res = await handleContactForm(post(good, { accept: 'application/json' }), env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('rejects invalid input with 400 before calling any API', async () => {
    const res = await handleContactForm(post({ ...good, email: 'nope', message: '' }, { accept: 'application/json' }), env);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: 'invalid_input', fields: expect.arrayContaining(['email', 'message']) });
    expect(calls).toHaveLength(0);
  });

  it('rejects a tripped honeypot with 403 and sends nothing', async () => {
    const res = await handleContactForm(post({ ...good, website: 'spam' }), env);
    expect(res.status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it('rejects a failed Turnstile check with 403 and sends nothing', async () => {
    routes[TURNSTILE_VERIFY_URL] = () => Response.json({ success: false });
    const res = await handleContactForm(post(good), env);
    expect(res.status).toBe(403);
    expect(calls.some((c) => c.url === RESEND)).toBe(false);
  });

  it('never reports success when Resend fails', async () => {
    routes[RESEND] = () => Response.json({ message: 'rate limited' }, { status: 429 });
    const res = await handleContactForm(post(good, { accept: 'application/json' }), env);
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, error: 'email_failed' });
    routes[RESEND] = () => { throw new TypeError('network'); };
    const res2 = await handleContactForm(post(good), env);
    expect(res2.status).toBe(502);
    expect(res2.headers.get('location')).toBeNull();
  });

  it('enforces the Turnstile action and hostname when asked', async () => {
    routes[TURNSTILE_VERIFY_URL] = () => Response.json({ success: true, hostname: 'example.com', action: 'contact' });
    const ok = await handleContactForm(post(good), env, { turnstile: { expectedAction: 'contact', expectedHostname: 'example.com' } });
    expect(ok.status).toBe(303);
    const wrongAction = await handleContactForm(post(good), env, { turnstile: { expectedAction: 'signup' } });
    expect(wrongAction.status).toBe(403);
    const wrongHost = await handleContactForm(post(good), env, { turnstile: { expectedHostname: 'syncdays.com' } });
    expect(wrongHost.status).toBe(403);
  });

  it('never reports success when a custom transport throws', async () => {
    const transport: EmailTransport = { send: async () => { throw new Error('down'); } };
    const res = await handleContactForm(post(good), env, { transport });
    expect(res.status).toBe(502);
  });

  it('refuses to fall back to the console transport outside local when the key is missing', async () => {
    const res = await handleContactForm(post(good), { ...env, RESEND_API_KEY: undefined });
    expect(res.status).toBe(500);
    expect(calls.some((c) => c.url === RESEND)).toBe(false);
  });

  it('prefers the send_email binding over Resend and needs no key with it', async () => {
    const send = vi.fn(async () => ({ messageId: 'cf-1' }));
    const EMAIL = { send } as unknown as SendEmail;
    const res = await handleContactForm(post(good), { ...env, EMAIL, EMAIL_FROM: 'Site <no-reply@example.com>' });
    expect(res.status).toBe(303);
    expect(send).toHaveBeenCalledOnce();
    expect(calls.some((c) => c.url === RESEND)).toBe(false);
    const noKey = await handleContactForm(post(good), { ...env, EMAIL, EMAIL_FROM: 'Site <no-reply@example.com>', RESEND_API_KEY: undefined });
    expect(noKey.status).toBe(303);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it('uses the console transport locally (no Resend call)', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const res = await handleContactForm(post(good), { ...env, ENVIRONMENT: 'local' });
    expect(res.status).toBe(303);
    expect(calls.some((c) => c.url === RESEND)).toBe(false);
  });

  it('returns 405 for non-POST and 400 for a non-form body', async () => {
    expect((await handleContactForm(new Request('https://example.com/api/contact'), env)).status).toBe(405);
    const bad = new Request('https://example.com/api/contact', { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } });
    expect((await handleContactForm(bad, env)).status).toBe(400);
  });
});
