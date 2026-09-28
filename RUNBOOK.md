# syncdays-website: runbook

- **Owner:** Vlad
- **Criticality:** normal
- **Data:** none (no backups needed)
- **Health:** `https://syncdays.com/healthz` (staging: `https://syncdays-website-staging.vlad-dodan.workers.dev/healthz`)
- **Logs:** `wrangler tail syncdays-website --env production` (read-only), or Workers Logs in the dashboard. Each request logs one JSON line (requestId, path, status, ms). Message bodies are never logged.

| Symptom | Check | Fix |
|---|---|---|
| Form says "could not be sent" (502) | Logs show `send_email` errors | Check that `CONTACT_TO` is still a verified Email Routing destination and that Email Routing is enabled on syncdays.com |
| Form returns 503 | Log line "contact form not configured" lists the missing names | Set the missing secret or var for that env |
| Form always 403 | Turnstile widget hostnames and secret | The widget must include the serving hostname, and the site key must match the secret |
| www not redirecting | `curl -sI https://www.syncdays.com` | Custom domain attached? `CANONICAL_HOST` var set? |
| Site down | `/healthz`, Workers dashboard | `rollback.yml`, or the DNS rollback in DEPLOYMENT.md |

## Incidents
(none yet)

## Change log
- **2026-09-28, CHANGE syncdays-website-01** (approved by the owner in chat): production Worker + custom domain `www.syncdays.com`.
  - Pre-change DNS: www CNAME `cname.vercel-dns.com. `, apex A `216.198.79.1 `, app CNAME `cname.vercel-dns.com. `.
  - Rollback: remove the route, redeploy, and re-create the www CNAME above.
