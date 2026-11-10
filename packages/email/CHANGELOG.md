# @vdodan/email

## 0.2.0

### Minor Changes

- ce35e69: `emailFromEnv` is Cloudflare-native first: it uses the `send_email` binding `env.EMAIL` (Cloudflare Email Service) whenever it is present, even if `RESEND_API_KEY` is also set. A third argument `{ bindingName }` selects a binding under another name. Resend is now optional and used only when there is no binding and `RESEND_API_KEY` is set. Outside local, with neither, `send` rejects with the new `EmailConfigError` (a subclass of `EmailSendError`) instead of logging a warning and silently using the console transport. New exports: `emailRoute`, `emailBindingFromEnv`, `EmailConfigError`, `DEFAULT_EMAIL_BINDING`, `EmailFromEnvOptions`, `EmailRoute`; `EmailEnv` gains `EMAIL?: SendEmail`.
