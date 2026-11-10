# @vdodan/observability

Structured JSON logs, request IDs and a Worker `fetch` wrapper. Keys matching
`/secret|token|password|key|authorization|cookie/i` are redacted at any depth.

## API

- `createLogger(ctx: LogContext): Logger` — `debug/info/warn(msg, data?)`, `error(msg, errOrData?, data?)`, `child(extra)`. One JSON line per call via `console.log`.
- `requestId(req)` — `cf-ray` header, else `crypto.randomUUID()`.
- `withObservability({ app, env?, version? }, handler)` — sets `x-request-id`, logs `{method, path, status, ms}` per request, turns thrown errors into `500 {"error":"internal","requestId"}`. `env` defaults to `env.ENVIRONMENT`.
- `redact(value)`, `serializeError(err)`.

## Example

```ts
import { createLogger, withObservability } from '@vdodan/observability';

export default withObservability<Env>({ app: 'notes' }, {
  async fetch(req, env) {
    const log = createLogger({ app: 'notes', env: env.ENVIRONMENT });
    log.info('hello', { path: new URL(req.url).pathname });
    return new Response('ok');
  },
});
```
