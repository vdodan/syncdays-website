/**
 * syncdays-website Worker.
 *
 * Static files in ./out (Next.js static export). run_worker_first is true so the www → apex
 * redirect can see every request; everything else is passed straight to ASSETS.
 * This Worker only handles:
 *   - www.syncdays.com/* → 301 https://syncdays.com/*
 *   - POST /api/contact  → rate limit + @vdodan/forms (zod + honeypot + Turnstile) + send_email
 *   - GET  /healthz      → { ok, app, env }
 *   - anything else      → env.ASSETS (so 404s get the site's 404 page)
 */
import { withObservability } from '@vdodan/observability';
import { APP_NAME, handler, type Env } from './app';

export type { Env } from './app';

// Only handler exports are allowed here (workerd rejects other named exports).
export default withObservability<Env>({ app: APP_NAME }, handler);
