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
export declare function createLogger(ctx: LogContext): Logger;
//# sourceMappingURL=logger.d.ts.map