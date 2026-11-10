import { redact, serializeError } from './redact.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  app: string;
  env: string;
  version?: string;
  requestId?: string;
  [k: string]: unknown;
}

export type LogData = Record<string, unknown>;

export interface Logger {
  debug(msg: string, data?: LogData): void;
  info(msg: string, data?: LogData): void;
  warn(msg: string, data?: LogData): void;
  /** `errOrData` may be an Error (serialized under `error`) or a data object. */
  error(msg: string, errOrData?: unknown, data?: LogData): void;
  child(extra: Partial<LogContext> & LogData): Logger;
}

/** Writes one JSON line per call via `console.log`. Secret-looking keys are redacted. */
export function createLogger(ctx: LogContext): Logger {
  const base = { ...ctx };

  const write = (level: LogLevel, msg: string, data?: LogData) => {
    const line = redact({ ts: new Date().toISOString(), level, msg, ...base, ...(data ?? {}) });
    let text: string;
    try {
      text = JSON.stringify(line);
    } catch {
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
      } else if (errOrData !== null && typeof errOrData === 'object') {
        write('error', msg, { ...(errOrData as LogData), ...(data ?? {}) });
      } else if (errOrData !== undefined) {
        write('error', msg, { ...(data ?? {}), error: serializeError(errOrData) });
      } else {
        write('error', msg, data);
      }
    },
    child: (extra) => createLogger({ ...base, ...extra } as LogContext),
  };
}
