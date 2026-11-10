/** Keys whose values are never logged. */
export declare const SECRET_KEY_RE: RegExp;
export declare const REDACTED = "[REDACTED]";
/** Serialize an Error into a plain, JSON-safe object (message and stack are kept, extra props redacted). */
export declare function serializeError(err: unknown): Record<string, unknown>;
/**
 * Deep-copies `value`, replacing the value of every key matching {@link SECRET_KEY_RE}
 * with `[REDACTED]`. Handles cycles, Errors, Dates, Headers/Maps and bigint.
 */
export declare function redact(value: unknown, depth?: number, seen?: WeakSet<object>): unknown;
//# sourceMappingURL=redact.d.ts.map