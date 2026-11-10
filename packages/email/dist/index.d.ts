export interface EmailAttachmentFile {
    filename: string;
    content: Uint8Array;
    contentType: string;
}
export interface EmailMessage {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
    attachments?: EmailAttachmentFile[];
}
export interface EmailTransport {
    /** Resolves only when the provider accepted the message; throws otherwise. */
    send(msg: EmailMessage): Promise<{
        id?: string;
    }>;
}
/** Thrown by transports when the provider rejects a message. Never contains secrets. */
export declare class EmailSendError extends Error {
    readonly status?: number;
    constructor(message: string, status?: number, options?: {
        cause?: unknown;
    });
}
export declare const RESEND_ENDPOINT = "https://api.resend.com/emails";
/** Sends through the Resend HTTP API with `fetch`. */
export declare function resendTransport(opts: {
    apiKey: string;
    defaultFrom: string;
    fetch?: typeof fetch;
}): EmailTransport;
type MinimalLogger = {
    info(msg: string, data?: Record<string, unknown>): void;
};
/** Local/dev transport: logs subject and recipients, never sends. */
export declare function consoleTransport(logger?: MinimalLogger): EmailTransport;
/** Cloudflare `send_email` binding (Email Routing / Email Service). */
export declare function cloudflareTransport(binding: SendEmail, defaultFrom: string): EmailTransport;
export interface EmailEnv {
    /** Cloudflare `send_email` binding (Cloudflare Email Service). Preferred whenever present. */
    EMAIL?: SendEmail;
    /** Optional. Used only when no `send_email` binding is present. */
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    ENVIRONMENT?: string;
}
export interface EmailFromEnvOptions {
    /** Name of the `send_email` binding on `env`. Default `EMAIL` (the factory convention). */
    bindingName?: string;
}
/** The binding name `emailFromEnv` looks for unless told otherwise. */
export declare const DEFAULT_EMAIL_BINDING = "EMAIL";
/** Thrown (on `send`) by the transport `emailFromEnv` returns when no email path is configured. */
export declare class EmailConfigError extends EmailSendError {
    constructor(message: string);
}
/** True when `ENVIRONMENT` names a local/dev/test environment. */
export declare function isLocalEnv(environment: string | undefined): boolean;
/** The `send_email` binding on `env` under `bindingName` (default `EMAIL`), if there is one. */
export declare function emailBindingFromEnv(env: object, bindingName?: string): SendEmail | undefined;
/** Which transport `emailFromEnv` would pick. `none` means sending will fail with `EmailConfigError`. */
export type EmailRoute = 'cloudflare' | 'resend' | 'console' | 'none';
/** Decide the route without building a transport (use it for "is email configured?" checks). */
export declare function emailRoute(env: EmailEnv, options?: EmailFromEnvOptions): EmailRoute;
/**
 * Picks the transport from the environment, Cloudflare-native first:
 *
 * 1. the Cloudflare `send_email` binding (`env.EMAIL`, or `options.bindingName`) whenever present,
 *    even if `RESEND_API_KEY` is also set;
 * 2. the console transport in a local/dev/test `ENVIRONMENT` (nothing is sent);
 * 3. Resend, only when `RESEND_API_KEY` is set;
 * 4. otherwise a transport whose `send` rejects with `EmailConfigError`, so a deployed app can't
 *    silently pretend to send. The error is raised on `send`, not here, so building the transport
 *    per request (e.g. inside Better Auth setup) doesn't break routes that never send email.
 *
 * `EMAIL_FROM` is the default sender for the binding and Resend paths (`msg.from` overrides it).
 */
export declare function emailFromEnv(env: EmailEnv, logger?: MinimalLogger & {
    warn?(msg: string, data?: Record<string, unknown>): void;
}, options?: EmailFromEnvOptions): EmailTransport;
export {};
//# sourceMappingURL=index.d.ts.map