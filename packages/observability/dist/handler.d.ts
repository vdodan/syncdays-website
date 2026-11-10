/** `cf-ray` header when present, otherwise a random UUID. */
export declare function requestId(req: Request): string;
export interface ObservabilityOptions {
    app: string;
    /** Overrides the environment name; defaults to `env.ENVIRONMENT` or `"unknown"`. */
    env?: string;
    version?: string;
}
/**
 * Wraps a Worker's `fetch` handler: sets `x-request-id`, logs one line per request
 * (method, path, status, ms) and turns thrown errors into `500 {"error":"internal","requestId"}`.
 * Other handlers (scheduled, queue, ...) pass through unchanged.
 */
export declare function withObservability<E, Q = unknown, C = unknown>(opts: ObservabilityOptions, handler: ExportedHandler<E, Q, C>): ExportedHandler<E, Q, C>;
//# sourceMappingURL=handler.d.ts.map