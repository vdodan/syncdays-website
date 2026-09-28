# syncdays-website: agent guide

**The syncdays.com marketing site:** features, pricing, changelog, roadmap, a contact form, and the privacy and terms pages. It links to the app at `https://app.syncdays.com`. Owner: Vlad. Criticality: normal (public marketing, no user data). Created in the factory on 2026-09-28, imported from `github.com/vdodan/syncdays-website`, which keeps the old history. This is factory Pilot #1 (`docs/16-pilot-plan.md`).

Read the factory root `CLAUDE.md` first. Its absolute rules apply here too.

## Architecture (one screen)
- **Next.js 16 static export** (`output: "export"`) → `out/`, served by **Workers Static Assets**.
- **Worker** (`worker/`) with `run_worker_first: true`:
  - `www.syncdays.com/*` → 301 to the apex, keeping path and query.
  - `POST /api/contact` runs these steps:
    1. rate limit per IP (`CONTACT_LIMITER`, 5 per minute);
    2. `@vdodan/forms` checks zod, the honeypot `website` field and Turnstile;
    3. the message is sent through the Cloudflare `send_email` binding (`CONTACT_EMAIL`) to the verified Email Routing address in `CONTACT_TO`, with `Reply-To` set to the sender.
  - `GET /healthz`.
  - Everything else goes to `ASSETS`.
- **No database, no user data.** Contact messages are never logged, only the request ID and status.
- **Public config** lives in `src/lib/public-config.ts` (the Turnstile site key and the Web Analytics beacon token, both public by design).
- `remotion/` is a separate video package and not part of the site build. tsconfig and eslint exclude it.

## Environments
| Env | Worker | URL | Email |
|---|---|---|---|
| local | `wrangler dev` | http://localhost:8787 | console transport (nothing sent) |
| preview | per-branch Worker Preview | `<branch>-syncdays-website.vlad-dodan.workers.dev` | form returns 503 (no send_email binding on purpose) |
| staging | `syncdays-website-staging` | https://syncdays-website-staging.vlad-dodan.workers.dev | real send to CONTACT_TO |
| production | `syncdays-website` | https://syncdays.com, https://www.syncdays.com (after cutover) | real send to CONTACT_TO |

## Develop and test
```bash
pnpm dev                          # next dev (form posts fail without the Worker; use preview for the full stack)
cp .dev.vars.example .dev.vars    # Turnstile TEST secret
pnpm preview                      # next build + wrangler dev (full stack, local)
pnpm test                         # Worker tests in workerd
pnpm typecheck && pnpm build
```

## Deploy
Only through CI (`.github/workflows/syncdays-website.yml` → `deploy-app.yml`):
- A push to a branch touching this app gives a preview.
- A push to `main` deploys staging.
- Production is a manual `workflow_dispatch`.

Never run `wrangler deploy`/`versions deploy`/`rollback` locally; the guard hook blocks them.

## Secrets (names only)
`TURNSTILE_SECRET_KEY`, per env as a Worker secret. The human sets it with `wrangler secret put … --env <env>` (see `docs/runbooks/secrets.md`). There are no other secrets: sending mail uses the `send_email` binding, not an API key.

## Agents may / must never
- **May:**
  - edit pages, components, copy and the Worker;
  - add tests;
  - open PRs;
  - trigger preview and staging runs when asked.
- **Must never:**
  - change DNS or custom domains;
  - deploy production;
  - put secrets or message contents in logs, code or chat;
  - touch `app.syncdays.com`, MX or TXT records.

  Changing `CONTACT_TO` needs the owner's approval, because the address must be a verified Email Routing destination.
