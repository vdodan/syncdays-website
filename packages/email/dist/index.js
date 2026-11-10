function base64(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000)
        s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s);
}
/** Thrown by transports when the provider rejects a message. Never contains secrets. */
export class EmailSendError extends Error {
    status;
    constructor(message, status, options) {
        super(message, options);
        this.name = 'EmailSendError';
        if (status !== undefined)
            this.status = status;
    }
}
export const RESEND_ENDPOINT = 'https://api.resend.com/emails';
function requireFrom(msg, defaultFrom) {
    const from = msg.from ?? defaultFrom;
    if (!from)
        throw new EmailSendError('email: no "from" address (set EMAIL_FROM)');
    return from;
}
/** Sends through the Resend HTTP API with `fetch`. */
export function resendTransport(opts) {
    return {
        async send(msg) {
            const body = {
                from: requireFrom(msg, opts.defaultFrom),
                to: Array.isArray(msg.to) ? msg.to : [msg.to],
                subject: msg.subject,
                html: msg.html,
            };
            if (msg.text !== undefined)
                body.text = msg.text;
            if (msg.replyTo !== undefined)
                body.reply_to = msg.replyTo;
            if (msg.attachments?.length)
                body.attachments = msg.attachments.map((a) => ({ filename: a.filename, content: base64(a.content) }));
            const doFetch = opts.fetch ?? fetch;
            let res;
            try {
                res = await doFetch(RESEND_ENDPOINT, {
                    method: 'POST',
                    headers: { authorization: `Bearer ${opts.apiKey}`, 'content-type': 'application/json' },
                    body: JSON.stringify(body),
                });
            }
            catch (err) {
                throw new EmailSendError('resend: network error', undefined, { cause: err });
            }
            if (!res.ok) {
                let detail = '';
                try {
                    const j = (await res.json());
                    detail = typeof j.message === 'string' ? `: ${j.message}` : '';
                }
                catch {
                    /* ignore body parse errors */
                }
                throw new EmailSendError(`resend: HTTP ${res.status}${detail}`, res.status);
            }
            const data = (await res.json().catch(() => ({})));
            return typeof data.id === 'string' ? { id: data.id } : {};
        },
    };
}
/** Local/dev transport: logs subject and recipients, never sends. */
export function consoleTransport(logger) {
    return {
        async send(msg) {
            const to = Array.isArray(msg.to) ? msg.to : [msg.to];
            if (logger)
                logger.info('email (console transport, not sent)', { to, subject: msg.subject });
            else
                console.log(JSON.stringify({ level: 'info', msg: 'email (console transport, not sent)', to, subject: msg.subject }));
            return { id: `console-${crypto.randomUUID()}` };
        },
    };
}
/** Cloudflare `send_email` binding (Email Routing / Email Service). */
export function cloudflareTransport(binding, defaultFrom) {
    return {
        async send(msg) {
            const builder = {
                from: requireFrom(msg, defaultFrom),
                to: msg.to,
                subject: msg.subject,
                html: msg.html,
                ...(msg.text !== undefined ? { text: msg.text } : {}),
                ...(msg.replyTo !== undefined ? { replyTo: msg.replyTo } : {}),
                ...(msg.attachments?.length
                    ? {
                        attachments: msg.attachments.map((a) => ({
                            disposition: 'attachment',
                            filename: a.filename,
                            type: a.contentType,
                            content: a.content,
                        })),
                    }
                    : {}),
            };
            try {
                const r = await binding.send(builder);
                return r?.messageId ? { id: r.messageId } : {};
            }
            catch (err) {
                throw new EmailSendError('cloudflare send_email: send failed', undefined, { cause: err });
            }
        },
    };
}
/** The binding name `emailFromEnv` looks for unless told otherwise. */
export const DEFAULT_EMAIL_BINDING = 'EMAIL';
/** Thrown (on `send`) by the transport `emailFromEnv` returns when no email path is configured. */
export class EmailConfigError extends EmailSendError {
    constructor(message) {
        super(message);
        this.name = 'EmailConfigError';
    }
}
const LOCAL_ENVS = new Set(['local', 'development', 'dev', 'test']);
/** True when `ENVIRONMENT` names a local/dev/test environment. */
export function isLocalEnv(environment) {
    return environment !== undefined && LOCAL_ENVS.has(environment);
}
function isSendEmail(v) {
    return typeof v === 'object' && v !== null && typeof v.send === 'function';
}
/** The `send_email` binding on `env` under `bindingName` (default `EMAIL`), if there is one. */
export function emailBindingFromEnv(env, bindingName = DEFAULT_EMAIL_BINDING) {
    const v = env[bindingName];
    return isSendEmail(v) ? v : undefined;
}
/** Decide the route without building a transport (use it for "is email configured?" checks). */
export function emailRoute(env, options = {}) {
    if (emailBindingFromEnv(env, options.bindingName))
        return 'cloudflare';
    if (isLocalEnv(env.ENVIRONMENT))
        return 'console';
    if (env.RESEND_API_KEY)
        return 'resend';
    return 'none';
}
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
export function emailFromEnv(env, logger, options = {}) {
    const bindingName = options.bindingName ?? DEFAULT_EMAIL_BINDING;
    const binding = emailBindingFromEnv(env, bindingName);
    if (binding)
        return cloudflareTransport(binding, env.EMAIL_FROM ?? '');
    if (isLocalEnv(env.ENVIRONMENT))
        return consoleTransport(logger);
    if (env.RESEND_API_KEY)
        return resendTransport({ apiKey: env.RESEND_API_KEY, defaultFrom: env.EMAIL_FROM ?? '' });
    const message = `email not configured: add a send_email binding named ${bindingName} (Cloudflare Email Service) or set RESEND_API_KEY`;
    return {
        async send() {
            const note = { environment: env.ENVIRONMENT ?? null, binding: bindingName };
            if (logger?.warn)
                logger.warn(message, note);
            else
                console.log(JSON.stringify({ level: 'warn', msg: message, ...note }));
            throw new EmailConfigError(message);
        },
    };
}
//# sourceMappingURL=index.js.map