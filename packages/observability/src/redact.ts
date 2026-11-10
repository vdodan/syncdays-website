/** Keys whose values are never logged. */
export const SECRET_KEY_RE = /secret|token|password|key|authorization|cookie/i;

export const REDACTED = '[REDACTED]';

const MAX_DEPTH = 8;

/** Serialize an Error into a plain, JSON-safe object (message and stack are kept, extra props redacted). */
export function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    const out: Record<string, unknown> = { name: err.name, message: err.message };
    if (err.stack) out.stack = err.stack;
    if ('cause' in err && err.cause !== undefined) out.cause = redact(err.cause instanceof Error ? serializeError(err.cause) : err.cause);
    for (const [k, v] of Object.entries(err)) {
      if (!(k in out)) out[k] = SECRET_KEY_RE.test(k) ? REDACTED : redact(v);
    }
    return out;
  }
  return { message: String(err) };
}

/**
 * Deep-copies `value`, replacing the value of every key matching {@link SECRET_KEY_RE}
 * with `[REDACTED]`. Handles cycles, Errors, Dates, Headers/Maps and bigint.
 */
export function redact(value: unknown, depth = 0, seen: WeakSet<object> = new WeakSet()): unknown {
  if (value === null || value === undefined) return value;
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return value;
  if (t === 'bigint') return (value as bigint).toString();
  if (t === 'function' || t === 'symbol') return undefined;
  const obj = value as object;
  if (depth >= MAX_DEPTH) return '[Truncated]';
  if (seen.has(obj)) return '[Circular]';
  seen.add(obj);
  try {
    if (obj instanceof Error) return serializeError(obj);
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map((v) => redact(v, depth + 1, seen));
    if (typeof Headers !== 'undefined' && obj instanceof Headers) {
      return redactEntries(obj.entries(), depth, seen);
    }
    if (obj instanceof Map) return redactEntries(obj.entries(), depth, seen);
    return redactEntries(Object.entries(obj), depth, seen);
  } finally {
    seen.delete(obj);
  }
}

function redactEntries(entries: Iterable<[unknown, unknown]>, depth: number, seen: WeakSet<object>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of entries) {
    const key = String(k);
    out[key] = SECRET_KEY_RE.test(key) ? REDACTED : redact(v, depth + 1, seen);
  }
  return out;
}
