import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cloudflareTransport,
  consoleTransport,
  EmailConfigError,
  emailFromEnv,
  emailRoute,
  EmailSendError,
  RESEND_ENDPOINT,
  resendTransport,
} from '../src/index.js';

afterEach(() => vi.restoreAllMocks());

const msg = { to: 'a@example.com', subject: 'Hi', html: '<p>Hi</p>', text: 'Hi', replyTo: 'r@example.com' };

describe('resendTransport', () => {
  it('POSTs to the Resend API and returns the id', async () => {
    const f = vi.fn(async () => Response.json({ id: 'em_1' }));
    const t = resendTransport({ apiKey: 're_test', defaultFrom: 'App <no-reply@example.com>', fetch: f as typeof fetch });
    await expect(t.send(msg)).resolves.toEqual({ id: 'em_1' });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RESEND_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer re_test');
    expect(JSON.parse(String(init.body))).toEqual({
      from: 'App <no-reply@example.com>',
      to: ['a@example.com'],
      subject: 'Hi',
      html: '<p>Hi</p>',
      text: 'Hi',
      reply_to: 'r@example.com',
    });
  });

  it('sends attachments to Resend as base64', async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({ id: 'r-2' }), { status: 200 }));
    const t = resendTransport({ apiKey: 'k', defaultFrom: 'f@example.com', fetch: fetch as unknown as typeof globalThis.fetch });
    await t.send({ to: 'a@example.com', subject: 'S', html: '<p/>', attachments: [{ filename: 'C.pdf', content: new Uint8Array([37, 80, 68, 70]), contentType: 'application/pdf' }] });
    const body = JSON.parse((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.attachments).toEqual([{ filename: 'C.pdf', content: 'JVBERg==' }]);
  });
  it('uses global fetch by default and throws on non-2xx without leaking the key', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ message: 'invalid from' }, { status: 422 })));
    const t = resendTransport({ apiKey: 're_secret_value', defaultFrom: 'x@example.com' });
    const err = await t.send(msg).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(EmailSendError);
    expect((err as EmailSendError).status).toBe(422);
    expect(String((err as Error).message)).not.toContain('re_secret_value');
    vi.unstubAllGlobals();
  });

  it('throws on network errors and when no from address exists', async () => {
    const t = resendTransport({ apiKey: 'k', defaultFrom: 'x@example.com', fetch: (async () => { throw new TypeError('down'); }) as typeof fetch });
    await expect(t.send(msg)).rejects.toThrow(/network/);
    const t2 = resendTransport({ apiKey: 'k', defaultFrom: '', fetch: vi.fn() as unknown as typeof fetch });
    await expect(t2.send(msg)).rejects.toThrow(/from/);
  });
});

describe('consoleTransport', () => {
  it('logs subject and recipients but never the body', async () => {
    const info = vi.fn();
    const r = await consoleTransport({ info }).send(msg);
    expect(r.id).toMatch(/^console-/);
    expect(info).toHaveBeenCalledWith(expect.any(String), { to: ['a@example.com'], subject: 'Hi' });
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await consoleTransport().send(msg);
    expect(String(log.mock.calls[0]![0])).not.toContain('<p>');
  });
});

describe('cloudflareTransport', () => {
  it('sends a builder message through the binding', async () => {
    const send = vi.fn(async () => ({ messageId: 'cf-1' }));
    const t = cloudflareTransport({ send } as unknown as SendEmail, 'from@example.com');
    await expect(t.send(msg)).resolves.toEqual({ id: 'cf-1' });
    expect(send).toHaveBeenCalledWith({
      from: 'from@example.com',
      to: 'a@example.com',
      subject: 'Hi',
      html: '<p>Hi</p>',
      text: 'Hi',
      replyTo: 'r@example.com',
    });
  });
  it('passes attachments to the binding as builder attachments', async () => {
    const send = vi.fn(async () => ({ messageId: 'cf-2' }));
    const t = cloudflareTransport({ send } as unknown as SendEmail, 'from@example.com');
    const pdf = new Uint8Array([37, 80, 68, 70]);
    await t.send({ to: 'a@example.com', subject: 'Contract', html: '<p>x</p>', attachments: [{ filename: 'C.pdf', content: pdf, contentType: 'application/pdf' }] });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      attachments: [{ disposition: 'attachment', filename: 'C.pdf', type: 'application/pdf', content: pdf }],
    }));
  });
  it('wraps binding failures', async () => {
    const t = cloudflareTransport({ send: async () => { throw new Error('nope'); } } as unknown as SendEmail, 'f@example.com');
    await expect(t.send(msg)).rejects.toBeInstanceOf(EmailSendError);
  });
});

describe('emailFromEnv', () => {
  const binding = () => {
    const send = vi.fn(async () => ({ messageId: 'cf-9' }));
    return { send, EMAIL: { send } as unknown as SendEmail };
  };

  it('uses the send_email binding when present, even if RESEND_API_KEY is also set', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const { send, EMAIL } = binding();
    const env = { ENVIRONMENT: 'production', EMAIL, RESEND_API_KEY: 'k', EMAIL_FROM: 'App <no-reply@example.com>' };
    expect(emailRoute(env)).toBe('cloudflare');
    await expect(emailFromEnv(env).send(msg)).resolves.toEqual({ id: 'cf-9' });
    expect(send).toHaveBeenCalledWith({
      from: 'App <no-reply@example.com>',
      to: 'a@example.com',
      subject: 'Hi',
      html: '<p>Hi</p>',
      text: 'Hi',
      replyTo: 'r@example.com',
    });
    expect(f).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('uses the binding locally too (miniflare simulates it)', async () => {
    const { send, EMAIL } = binding();
    await emailFromEnv({ ENVIRONMENT: 'local', EMAIL, EMAIL_FROM: 'f@example.com' }).send(msg);
    expect(send).toHaveBeenCalledOnce();
  });

  it('accepts an explicit binding name', async () => {
    const { send, EMAIL } = binding();
    const env = { ENVIRONMENT: 'staging', CONTACT_EMAIL: EMAIL, EMAIL_FROM: 'f@example.com' };
    expect(emailRoute(env, { bindingName: 'CONTACT_EMAIL' })).toBe('cloudflare');
    await emailFromEnv(env, undefined, { bindingName: 'CONTACT_EMAIL' }).send(msg);
    expect(send).toHaveBeenCalledOnce();
    // The default name is not looked up when another one is given, and vice versa.
    expect(emailRoute(env)).toBe('none');
  });

  it('ignores a non-binding value under the binding name', () => {
    expect(emailRoute({ ENVIRONMENT: 'staging', EMAIL: 'oops' as unknown as SendEmail, RESEND_API_KEY: 'k' })).toBe('resend');
  });

  it('uses Resend when there is no binding and a key is set outside local', async () => {
    const f = vi.fn(async () => Response.json({ id: 'em_2' }));
    vi.stubGlobal('fetch', f);
    const env = { ENVIRONMENT: 'staging', RESEND_API_KEY: 'k', EMAIL_FROM: 'a@example.com' };
    expect(emailRoute(env)).toBe('resend');
    await expect(emailFromEnv(env).send(msg)).resolves.toEqual({ id: 'em_2' });
    expect(f).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('uses console locally when there is no binding, even with a key', async () => {
    const info = vi.fn();
    expect(emailRoute({ ENVIRONMENT: 'local', RESEND_API_KEY: 'k' })).toBe('console');
    const r = await emailFromEnv({ ENVIRONMENT: 'local', RESEND_API_KEY: 'k' }, { info }).send(msg);
    expect(r.id).toMatch(/^console-/);
  });

  it('fails with a clear EmailConfigError when neither a binding nor a key exists', async () => {
    const warn = vi.fn();
    const info = vi.fn();
    const env = { ENVIRONMENT: 'production' };
    expect(emailRoute(env)).toBe('none');
    const t = emailFromEnv(env, { info, warn }); // building the transport does not throw
    expect(warn).not.toHaveBeenCalled();
    const err = await t.send(msg).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(EmailConfigError);
    expect(err).toBeInstanceOf(EmailSendError);
    expect((err as Error).message).toMatch(/send_email binding named EMAIL.*RESEND_API_KEY/);
    expect(warn).toHaveBeenCalledOnce();
    expect(info).not.toHaveBeenCalled();
  });

  it('names the custom binding in the error', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await expect(emailFromEnv({}, undefined, { bindingName: 'MAILER' }).send(msg)).rejects.toThrow(/MAILER/);
  });
});
