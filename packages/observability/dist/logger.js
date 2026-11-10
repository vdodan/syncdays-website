import { redact, serializeError } from './redact.js';
/** Writes one JSON line per call via `console.log`. Secret-looking keys are redacted. */
export function createLogger(ctx) {
    const base = { ...ctx };
    const write = (level, msg, data) => {
        const line = redact({ ts: new Date().toISOString(), level, msg, ...base, ...(data ?? {}) });
        let text;
        try {
            text = JSON.stringify(line);
        }
        catch {
            text = JSON.stringify({ ts: new Date().toISOString(), level, msg, app: base.app, env: base.env, logError: 'unserializable' });
        }
        console.log(text);
    };
    return {
        debug: (msg, data) => write('debug', msg, data),
        info: (msg, data) => write('info', msg, data),
        warn: (msg, data) => write('warn', msg, data),
        error: (msg, errOrData, data) => {
            if (errOrData instanceof Error) {
                write('error', msg, { ...(data ?? {}), error: serializeError(errOrData) });
            }
            else if (errOrData !== null && typeof errOrData === 'object') {
                write('error', msg, { ...errOrData, ...(data ?? {}) });
            }
            else if (errOrData !== undefined) {
                write('error', msg, { ...(data ?? {}), error: serializeError(errOrData) });
            }
            else {
                write('error', msg, data);
            }
        },
        child: (extra) => createLogger({ ...base, ...extra }),
    };
}
//# sourceMappingURL=logger.js.map