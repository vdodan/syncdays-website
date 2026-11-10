import { emailFromEnv, emailRoute } from '@vdodan/email';
import { z } from 'zod';
import { isHoneypotTripped } from './honeypot.js';
import { verifyTurnstile } from './turnstile.js';
export const contactSchema = z.object({
    name: z.string().trim().min(1).max(200),
    email: z.email().max(320),
    message: z.string().trim().min(1).max(5000),
});
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const stripControls = (s) => s.replace(/[\r\n\t]+/g, ' ');
function wantsJson(req) {
    return (req.headers.get('accept') ?? '').includes('application/json');
}
function fail(req, status, error, extra) {
    if (wantsJson(req))
        return Response.json({ ok: false, error, ...extra }, { status });
    return new Response(`Error: ${error}`, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
function successLocation(req) {
    const reqUrl = new URL(req.url);
    const ref = req.headers.get('referer');
    let target = reqUrl;
    if (ref) {
        try {
            const r = new URL(ref);
            if (r.origin === reqUrl.origin)
                target = r;
        }
        catch {
            /* ignore bad referer */
        }
    }
    const out = new URL(target.toString());
    out.searchParams.set('sent', '1');
    out.hash = '';
    return out.toString();
}
/**
 * POST form (name, email, message, cf-turnstile-response, website) → validate → honeypot →
 * Turnstile → email → 303 to `?sent=1` (or JSON when `Accept: application/json`).
 * Success is reported only after the email transport resolved.
 */
export async function handleContactForm(req, env, opts = {}) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
    }
    let form;
    try {
        form = await req.formData();
    }
    catch {
        return fail(req, 400, 'invalid_form');
    }
    const str = (k) => {
        const v = form.get(k);
        return typeof v === 'string' ? v : undefined;
    };
    const parsed = contactSchema.safeParse({ name: str('name'), email: str('email'), message: str('message') });
    if (!parsed.success) {
        const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
        return fail(req, 400, 'invalid_input', { fields });
    }
    if (isHoneypotTripped(form, opts.honeypotField ?? 'website'))
        return fail(req, 403, 'rejected');
    const ip = req.headers.get('cf-connecting-ip');
    const human = await verifyTurnstile(str('cf-turnstile-response') ?? null, env.TURNSTILE_SECRET_KEY, ip, {
        ...(opts.turnstile?.expectedAction ? { expectedAction: opts.turnstile.expectedAction } : {}),
        ...(opts.turnstile?.expectedHostname ? { expectedHostname: opts.turnstile.expectedHostname } : {}),
    });
    if (!human)
        return fail(req, 403, 'turnstile_failed');
    if (!env.CONTACT_TO)
        return fail(req, 500, 'not_configured');
    // Outside local, no send_email binding and no Resend key must not silently fall back to the console transport.
    if (!opts.transport && emailRoute(env) === 'none')
        return fail(req, 500, 'not_configured');
    const transport = opts.transport ?? emailFromEnv(env);
    const { name, email, message } = parsed.data;
    const subject = `${opts.subjectPrefix ?? 'Contact form'}: ${stripControls(name)}`.slice(0, 250);
    try {
        await transport.send({
            to: env.CONTACT_TO,
            replyTo: email,
            subject,
            text: `From: ${name} <${email}>\n\n${message}`,
            html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
        });
    }
    catch {
        return fail(req, 502, 'email_failed');
    }
    if (wantsJson(req))
        return Response.json({ ok: true });
    return new Response(null, { status: 303, headers: { location: successLocation(req) } });
}
//# sourceMappingURL=contact.js.map