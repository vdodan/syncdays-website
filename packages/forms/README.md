# @vdodan/forms

Turnstile verification, a honeypot check and a complete contact-form handler.

## API

- `verifyTurnstile(token, secret, ip?, opts?)` — POSTs to Turnstile siteverify; `false` on missing token, error or failure. Never throws.
- `isHoneypotTripped(form, field = 'website')`.
- `handleContactForm(req, env, opts?)` — POST form `name, email, message, cf-turnstile-response, website` → zod validation (400) → honeypot (403) → Turnstile (403) → email to `CONTACT_TO` (502 on failure) → `303` to `?sent=1`, or `{ ok: true }` when `Accept: application/json`. Success is only reported after the transport resolved. Email goes through `emailFromEnv` from `@vdodan/email`: the Cloudflare `send_email` binding `env.EMAIL` when present, Resend only when there is no binding and `RESEND_API_KEY` is set. Outside local, having neither returns 500 instead of falling back to the console transport. Options: `transport` (override, e.g. a binding under another name via `cloudflareTransport`), `subjectPrefix`, `honeypotField`, `turnstile: { expectedAction?, expectedHostname? }` (extra siteverify checks; skip them locally, where the test keys return placeholder values).

## Example

```ts
import { handleContactForm } from '@vdodan/forms';

app.post('/api/contact', (c) => handleContactForm(c.req.raw, c.env));
```
