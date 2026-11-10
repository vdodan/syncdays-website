# @vdodan/forms

## 0.2.0

### Minor Changes

- ce35e69: `handleContactForm` takes a new `turnstile: { expectedAction?, expectedHostname? }` option, passed through to `verifyTurnstile` so a token is rejected (403) unless it came from the expected widget action on the expected host. Skip both locally, where Cloudflare's test keys return placeholder values. Email now goes Cloudflare-native first through `@vdodan/email`: `ContactEnv` gains `EMAIL?: SendEmail`, a `send_email` binding there is used ahead of Resend, and `RESEND_API_KEY` is optional. The 500 `not_configured` response outside local now means "neither a binding nor a Resend key".

### Patch Changes

- Updated dependencies [ce35e69]
  - @vdodan/email@0.2.0
