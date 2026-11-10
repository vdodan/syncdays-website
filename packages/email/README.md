# @vdodan/email

One `EmailTransport` interface over the Cloudflare `send_email` binding (Cloudflare Email Service), Resend and a console transport for local dev. Transports throw `EmailSendError` when the provider rejects a message, so callers can't mistake a failure for success.

Cloudflare-native first: apps send through a `send_email` binding named `EMAIL`. Resend is optional and used only when an environment has no binding.

## API

- `emailFromEnv(env, logger?, { bindingName? })` picks the transport:
  1. the `send_email` binding `env.EMAIL` (or `env[bindingName]`) whenever it is present, even if `RESEND_API_KEY` is also set;
  2. the console transport when `ENVIRONMENT` is `local`/`development`/`dev`/`test` (nothing is sent);
  3. Resend when `RESEND_API_KEY` is set;
  4. otherwise a transport whose `send` rejects with `EmailConfigError` ("email not configured: add a send_email binding named EMAIL … or set RESEND_API_KEY"). It fails on `send`, not on construction, so building it per request doesn't break routes that never send mail.

  `EMAIL_FROM` is the default sender (`msg.from` overrides it). With the binding, the sender must be on a domain onboarded to Cloudflare Email Service.
- `emailRoute(env, { bindingName? })` returns `'cloudflare' | 'resend' | 'console' | 'none'` without building a transport. Use it for "is email configured?" checks.
- `emailBindingFromEnv(env, bindingName = 'EMAIL')` returns the binding if `env[bindingName]` looks like one.
- `EmailMessage` takes optional `attachments: { filename, content: Uint8Array, contentType }[]`: the Cloudflare transport passes them as builder attachments (`disposition: 'attachment'`), Resend as base64.
- `cloudflareTransport(binding: SendEmail, defaultFrom)` calls `binding.send({ from, to, subject, html, text?, replyTo?, attachments? })` (the builder form of `SendEmail.send`, as used by syncdays-app in production) and returns `{ id: messageId }`.
- `resendTransport({ apiKey, defaultFrom, fetch? })` POSTs to `https://api.resend.com/emails`.
- `consoleTransport(logger?)` logs recipients and subject only and never sends.
- `isLocalEnv(environment)`, `EmailSendError`, `EmailConfigError` (a subclass of `EmailSendError`), `DEFAULT_EMAIL_BINDING`.

## wrangler.jsonc

```jsonc
// staging / production blocks (bindings are not inherited, so repeat it per env)
"send_email": [{ "name": "EMAIL" }],
"vars": { "EMAIL_FROM": "App <no-reply@example.com>" }
```

No API key is needed for the binding. Local `wrangler dev` simulates the binding and sends nothing; with no binding locally the console transport is used.

## Example

```ts
import { emailFromEnv } from '@vdodan/email';

await emailFromEnv(env).send({ to: 'ada@example.com', subject: 'Welcome', html: '<p>Hi</p>' });

// A binding under another name:
await emailFromEnv(env, log, { bindingName: 'CONTACT_EMAIL' }).send(msg);
```

## Upgrading from 0.1

- A `send_email` binding named `EMAIL` now wins over `RESEND_API_KEY`.
- Outside local, with neither a binding nor a key, `send` now rejects with `EmailConfigError`. In 0.1 it logged a warning and used the console transport, so nothing was sent and the caller saw success.
