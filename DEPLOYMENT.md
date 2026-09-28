# syncdays-website: deployment

All deploys go through GitHub Actions: `.github/workflows/syncdays-website.yml` calls the reusable `deploy-app.yml`.

| Trigger | Environment | Result |
|---|---|---|
| push to any branch except main that touches `apps/syncdays-website/**` | preview | Worker Preview URL in the job summary |
| push to `main` that touches the app | staging | https://syncdays-website-staging.vlad-dodan.workers.dev, smoke test `/healthz` |
| manual `workflow_dispatch` (environment=production, optional gradual) | production | 10%→100% if gradual; smoke `/healthz` |

**Before the first production deploy:**
- `TURNSTILE_SECRET_KEY` must be set on the Worker for each env (human-only, `docs/runbooks/secrets.md`).
- The real Turnstile site key goes in `src/lib/public-config.ts`.

**Custom domains (cutover):**
1. Add the `routes` entries in `env.production` of `wrangler.jsonc`, `www.syncdays.com` first, then the apex, following the change proposals in `docs/16` steps 12–13.
2. Deploy production through CI.

Wrangler replaces the existing DNS record. Record the old values first (apex A 216.198.79.1; www CNAME to Vercel).

**Rollback:**
- Code: `rollback.yml` (manual dispatch, `app-dir=apps/syncdays-website`).
- Platform: remove the routes, redeploy, and re-create the recorded DNS records. Vercel keeps serving until Phase 5.
