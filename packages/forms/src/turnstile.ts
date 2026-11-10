export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileOptions {
  /** Expected hostname or action; verification fails when they differ. */
  expectedHostname?: string;
  expectedAction?: string;
  fetch?: typeof fetch;
}

interface SiteverifyResponse {
  success?: boolean;
  hostname?: string;
  action?: string;
  'error-codes'?: string[];
}

/**
 * Server-side Turnstile check. Returns `false` for a missing token, a network error
 * or any non-success answer; never throws.
 */
export async function verifyTurnstile(
  token: string | null,
  secret: string,
  ip?: string | null,
  opts: TurnstileOptions = {},
): Promise<boolean> {
  if (!token || !secret || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await (opts.fetch ?? fetch)(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    if (!res.ok) return false;
    const data = (await res.json()) as SiteverifyResponse;
    if (data.success !== true) return false;
    if (opts.expectedHostname && data.hostname !== opts.expectedHostname) return false;
    if (opts.expectedAction && data.action !== opts.expectedAction) return false;
    return true;
  } catch {
    return false;
  }
}
