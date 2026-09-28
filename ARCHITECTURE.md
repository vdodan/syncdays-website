# syncdays-website: architecture

```
browser ──► Cloudflare edge (syncdays.com / www) ──► Worker "syncdays-website" (run_worker_first)
                                                    ├─ host www.*      → 301 https://syncdays.com/…
                                                    ├─ POST /api/contact → CONTACT_LIMITER (rate limit, per IP)
                                                    │                     → @vdodan/forms: zod · honeypot · Turnstile siteverify
                                                    │                     → CONTACT_EMAIL (send_email) → verified inbox (Reply-To: sender)
                                                    ├─ GET /healthz    → {ok, app, env}
                                                    └─ else            → ASSETS (./out, Next.js static export, _headers, 404.html)
browser ──► challenges.cloudflare.com (Turnstile widget) · static.cloudflareinsights.com (Web Analytics beacon, when token set)
```

| Component | Choice | Why |
|---|---|---|
| Framework | Next.js 16.1 static export | Existing site. The factory rule is "don't rewrite for its own sake" (docs/05 §2). |
| Hosting | Workers Static Assets | Asset requests are free and unlimited. One Worker also handles the form and the redirect. |
| Email | `send_email` binding | No API key to manage. It can only reach the verified destination, so it can't be abused to send spam. |
| Bot protection | Turnstile + honeypot + rate-limit binding | Layered defence on the only write endpoint |
| Analytics | Cloudflare Web Analytics (cookie-free) | Replaces @vercel/analytics |
| Data | none | Messages go straight to email and are never stored or logged |

**Decisions:**
- `run_worker_first: true`, because static assets can't route by host and the Worker needs to see every request to redirect www. The Worker passes other requests to `ASSETS` with negligible CPU.
- Honeypot and failed Turnstile return 403, as the `@vdodan/forms` contract specifies. docs/16 originally said "silently accept"; the contract wins.
- Previews have no `send_email` binding, so the form returns 503 there by design.
