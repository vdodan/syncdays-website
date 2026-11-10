import { createLogger } from './logger.js';
/** `cf-ray` header when present, otherwise a random UUID. */
export function requestId(req) {
    return req.headers.get('cf-ray') ?? crypto.randomUUID();
}
function envName(env) {
    const v = env?.ENVIRONMENT;
    return typeof v === 'string' && v ? v : 'unknown';
}
function withHeader(res, name, value) {
    // WebSocket upgrades and some responses have immutable headers; copy when needed.
    if (res.status === 101 || res.webSocket)
        return res;
    try {
        res.headers.set(name, value);
        return res;
    }
    catch {
        const copy = new Response(res.body, res);
        copy.headers.set(name, value);
        return copy;
    }
}
/**
 * Wraps a Worker's `fetch` handler: sets `x-request-id`, logs one line per request
 * (method, path, status, ms) and turns thrown errors into `500 {"error":"internal","requestId"}`.
 * Other handlers (scheduled, queue, ...) pass through unchanged.
 */
export function withObservability(opts, handler) {
    const inner = handler.fetch;
    if (!inner)
        return handler;
    const fetch = async (request, env, ctx) => {
        const id = requestId(request);
        const start = Date.now();
        const log = createLogger({
            app: opts.app,
            env: opts.env ?? envName(env),
            ...(opts.version ? { version: opts.version } : {}),
            requestId: id,
        });
        const url = new URL(request.url);
        const base = { method: request.method, path: url.pathname };
        try {
            const res = await inner.call(handler, request, env, ctx);
            const out = withHeader(res, 'x-request-id', id);
            log.info('request', { ...base, status: out.status, ms: Date.now() - start });
            return out;
        }
        catch (err) {
            log.error('request', err, { ...base, status: 500, ms: Date.now() - start });
            return new Response(JSON.stringify({ error: 'internal', requestId: id }), {
                status: 500,
                headers: { 'content-type': 'application/json; charset=utf-8', 'x-request-id': id },
            });
        }
    };
    return { ...handler, fetch };
}
//# sourceMappingURL=handler.js.map