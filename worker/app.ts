/**
 * Request handling for the syncdays-website Worker (see worker/index.ts for routing notes).
 * Kept separate from the entry module: workerd treats every named export of the main
 * module as an entrypoint, so the entry file may only export handlers.
 */
import { cloudflareTransport, type EmailTransport } from '@vdodan/email';
import { handleContactForm } from '@vdodan/forms';

export interface Env {
  /** Static assets binding (wrangler.jsonc `assets.binding`). */
  ASSETS: Fetcher;
  /** local | preview | staging | production (wrangler.jsonc `vars`). */
  ENVIRONMENT: string;
  /** Apex host that www redirects to, e.g. "syncdays.com" (var). */
  CANONICAL_HOST?: string;
  /** Verified Email Routing destination that receives contact messages (var). */
  CONTACT_TO?: string;
  /** Sender on the syncdays.com zone, e.g. "SyncDays website <noreply@syncdays.com>" (var). */
  EMAIL_FROM?: string;
  /** Secret. Local: .dev.vars. Deployed: Worker secret. */
  TURNSTILE_SECRET_KEY?: string;
  /** Cloudflare send_email binding, restricted to CONTACT_TO. Absent locally. */
  CONTACT_EMAIL?: SendEmail;
  /** Workers rate-limiting binding for POST /api/contact. Absent in unit tests. */
  CONTACT_LIMITER?: RateLimit;
}

export const APP_NAME = 'syncdays-website';

function json(status: number, body: unknown, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

/** The form must never report success when nothing will be delivered. */
function missingConfig(env: Env): string[] {
  const missing: string[] = [];
  if (!env.TURNSTILE_SECRET_KEY) missing.push('TURNSTILE_SECRET_KEY');
  if (!env.CONTACT_TO) missing.push('CONTACT_TO');
  if (!env.EMAIL_FROM) missing.push('EMAIL_FROM');
  if (env.ENVIRONMENT !== 'local' && !env.CONTACT_EMAIL) missing.push('CONTACT_EMAIL (send_email binding)');
  return missing;
}

function transportFor(env: Env): EmailTransport | undefined {
  // Deployed: Cloudflare send_email binding (no API key; only reaches the verified CONTACT_TO).
  // Local: undefined → @vdodan/forms falls back to the console transport (nothing is sent).
  return env.CONTACT_EMAIL ? cloudflareTransport(env.CONTACT_EMAIL, env.EMAIL_FROM as string) : undefined;
}

export const handler: ExportedHandler<Env> = {
  async fetch(request, env) {
    const url = new URL(request.url);

    // www → apex, path and query preserved (run_worker_first covers every path on www).
    if (env.CANONICAL_HOST && url.hostname === `www.${env.CANONICAL_HOST}`) {
      url.hostname = env.CANONICAL_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json(405, { error: 'method_not_allowed' }, { allow: 'POST' });
      }
      const missing = missingConfig(env);
      if (missing.length > 0) {
        // Names only, never values.
        console.error(JSON.stringify({ level: 'error', msg: 'contact form not configured', missing }));
        return json(503, { error: 'contact_form_unavailable' });
      }
      if (env.CONTACT_LIMITER) {
        const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
        const { success } = await env.CONTACT_LIMITER.limit({ key: `contact:${ip}` });
        if (!success) return json(429, { error: 'rate_limited' }, { 'retry-after': '60' });
      }
      return handleContactForm(
        request,
        {
          TURNSTILE_SECRET_KEY: env.TURNSTILE_SECRET_KEY as string,
          CONTACT_TO: env.CONTACT_TO as string,
          EMAIL_FROM: env.EMAIL_FROM,
          ENVIRONMENT: env.ENVIRONMENT,
        },
        { transport: transportFor(env), subjectPrefix: 'syncdays.com contact' },
      );
    }

    if (url.pathname === '/healthz') {
      return json(200, { ok: true, app: APP_NAME, env: env.ENVIRONMENT });
    }

    return env.ASSETS.fetch(request);
  },
};
