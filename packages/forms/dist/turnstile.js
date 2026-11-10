export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
/**
 * Server-side Turnstile check. Returns `false` for a missing token, a network error
 * or any non-success answer; never throws.
 */
export async function verifyTurnstile(token, secret, ip, opts = {}) {
    if (!token || !secret || token.length > 2048)
        return false;
    const body = new URLSearchParams({ secret, response: token });
    if (ip)
        body.set('remoteip', ip);
    try {
        const res = await (opts.fetch ?? fetch)(TURNSTILE_VERIFY_URL, { method: 'POST', body });
        if (!res.ok)
            return false;
        const data = (await res.json());
        if (data.success !== true)
            return false;
        if (opts.expectedHostname && data.hostname !== opts.expectedHostname)
            return false;
        if (opts.expectedAction && data.action !== opts.expectedAction)
            return false;
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=turnstile.js.map