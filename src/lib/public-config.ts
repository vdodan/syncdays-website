// Public, non-secret values baked into the static build (safe to commit).
// Turnstile site key: widget "syncdays-website" (hostnames syncdays.com + vlad-dodan.workers.dev).
// Until the real widget exists this is Cloudflare's documented always-pass TEST key.
export const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

// Cloudflare Web Analytics beacon token (public). Empty = no beacon.
export const CF_BEACON_TOKEN = "";
