import { type EmailTransport } from '@vdodan/email';
import { z } from 'zod';
export interface ContactEnv {
    TURNSTILE_SECRET_KEY: string;
    /** Cloudflare `send_email` binding. Preferred over Resend whenever present (see @vdodan/email). */
    EMAIL?: SendEmail;
    /** Optional: used only when there is no `send_email` binding. */
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    CONTACT_TO: string;
    ENVIRONMENT?: string;
}
export interface ContactFormOptions {
    /** Override the transport (tests, or a Cloudflare send_email binding). */
    transport?: EmailTransport;
    /** Subject prefix, default "Contact form". */
    subjectPrefix?: string;
    /** Honeypot field name, default "website". */
    honeypotField?: string;
    /**
     * Extra Turnstile checks. Set `expectedAction` to the widget's data-action and
     * `expectedHostname` to the host that served the form (skip both in local dev,
     * where Cloudflare's test keys return placeholder values).
     */
    turnstile?: {
        expectedAction?: string;
        expectedHostname?: string;
    };
}
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    message: z.ZodString;
}, z.core.$strip>;
export type ContactInput = z.infer<typeof contactSchema>;
/**
 * POST form (name, email, message, cf-turnstile-response, website) → validate → honeypot →
 * Turnstile → email → 303 to `?sent=1` (or JSON when `Accept: application/json`).
 * Success is reported only after the email transport resolved.
 */
export declare function handleContactForm(req: Request, env: ContactEnv, opts?: ContactFormOptions): Promise<Response>;
//# sourceMappingURL=contact.d.ts.map