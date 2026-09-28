// Public, non-secret values baked into the static build (safe to commit).
// Turnstile site key: widget "syncdays-website" (hostnames syncdays.com + vlad-dodan.workers.dev).
export const TURNSTILE_SITE_KEY = "0x4AAAAAAFHrfkYve0k4O4fj";
/** data-action on the widget; the Worker rejects tokens with any other action. */
export const TURNSTILE_ACTION = "contact";

// Cloudflare Web Analytics beacon token (public). Empty = no beacon.
export const CF_BEACON_TOKEN = "";
