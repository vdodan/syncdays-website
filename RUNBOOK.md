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
  - Result: the first attempt failed with error 100117 ("hostname already has externally managed DNS records"). The dangling www CNAME was deleted in the dashboard (covered by the approval) and the deploy re-run. It now returns `301 https://syncdays.com/…` with valid TLS. Apex, app, MX and TXT are unchanged.
- **2026-09-29, CHANGE syncdays-website-02** (approved by the owner in chat): apex `syncdays.com` moved to the Worker.
  - Pre-change: apex A `216.198.79.1` (Vercel), DNS only, TTL 10 min.
  - Rollback: remove the apex custom domain, then re-create that A record.
  - Result: the apex was served by the Worker with valid TLS within about 3 minutes of deleting the A record (00:26 → 00:29 EEST).
    - Checks passed: all 8 pages, 404, security headers, http→https and www→apex (one hop), and a production contact message delivered to the inbox.
    - Unchanged: `app.syncdays.com`, MX, SPF and Resend DKIM.
  - Watch: on the first production form test, typed values were cleared once before submit and a retype worked. This is possibly a hydration timing effect on the controlled inputs. Not reproduced; check whether real users hit it.
  - Vercel project `syncdays-website` stays up until 2026-10-13 (14-day window) for DNS rollback.
- **2026-10-01, Web Analytics:** already enabled for syncdays.com in the Cloudflare dashboard (automatic setup, created 2026-09-29; 36 page views and 3 visits in the 24 h before the check). `CF_BEACON_TOKEN` stays empty because the automatic setup injects the beacon. Nothing to deploy.

### Planned: CHANGE syncdays-website-03, not before 2026-10-13 (TASKS.md T3; approved by the owner in chat 2026-10-01)
- **What:**
  1. Confirm the 14 days passed without a rollback:
     - `curl -s https://syncdays.com/healthz` returns `"env":"production"`;
     - `dig +short syncdays.com` shows Cloudflare addresses;
     - no incident in the log above.
  2. Record the project: run `vercel project inspect syncdays-website` and list its env var **names**, saving both to `~/syncdays-backups/<date>-vercel-website/`. The source lives on in `apps/syncdays-website` and in the old repo.
  3. Delete the Vercel project: `vercel project rm syncdays-website`. It's irreversible, so only after 1 and 2.
  4. Old repo `vdodan/syncdays-website` (public):
     - commit a README pointer to `github.com/vdodan/factory/tree/main/apps/syncdays-website` (the factory repo is private, so say "moved to the private factory monorepo");
     - then `gh repo archive vdodan/syncdays-website --yes`. That's reversible with `gh repo unarchive`.
- **Why:** Pilot #1 closure; the Vercel copy was only the DNS rollback target.
- **Impact:** none on syncdays.com, which is served by the Worker. syncdays-website-*.vercel.app URLs stop working.
- **Rollback:** after step 3, a DNS rollback to Vercel is no longer possible. Recovery is redeploying the Worker (`rollback.yml`).
- **Downtime risk:** none. **Data-loss risk:** none (static site, source in git).
- **Verification:** `vercel project ls` no longer lists it; `gh repo view vdodan/syncdays-website --json isArchived` returns `true`; syncdays.com/healthz is still OK.
