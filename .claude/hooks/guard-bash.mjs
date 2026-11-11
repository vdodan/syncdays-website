// .claude/hooks/guard-bash.mjs — blocks dangerous commands regardless of how they're spelled.
// Source: factory docs/17-ai-agent-guidelines.md §3.2. Changes need human review (CODEOWNERS).
// Fails closed: if the hook input cannot be read or parsed, the command is blocked.
import { readFileSync } from "node:fs";

let cmd;
try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  cmd = String(input.tool_input?.command ?? "");
} catch {
  console.error("BLOCKED by factory guard: hook input could not be parsed (fails closed).");
  process.exit(2);
}
// Normalise before matching: quotes and backslash-newlines out, whitespace collapsed.
// `-e production`, `-e=production`, `-eproduction`, `--env "production"` all reduce to one spelling.
const norm = cmd.replace(/\\\n/g, " ").replace(/\$'/g, "").replace(/\\(.)/g, "$1").replace(/["'`]/g, "").replace(/\s+/g, " ");

const MUTATE = "(?:>|>>|\\btee\\b|\\bsed\\b[^;&|]*-i|\\b(?:cp|mv|rm|ln|chmod|chown|install|truncate|dd|perl|python3?|ruby|node|find|git (?:checkout|restore|apply|stash|reset|clean))\\b)";
const rules = [
  [/(--env[ =]?|\s-e[ =]?)(prod|production)\b/i, "Production targeting is CI-only. Open a PR / trigger the approved workflow."],
  [/\b(CLOUDFLARE_ENV|WRANGLER_ENV)=\S*prod/i, "Production targeting is CI-only. Open a PR / trigger the approved workflow."],
  [/\b(pnpm|npm|yarn|bun)\b[^;&|]*\bdeploy:prod(uction)?\b/i, "Production deploys are CI-only."],
  [/\bwrangler\b[^;&|]*\bdev\b[^;&|]*--remote/i, "wrangler dev --remote runs against production bindings."],
  [/\bd1 execute\b.*--remote/i, "Remote D1 SQL is forbidden for agents."],
  [/\btime-travel restore\b/i, "D1 Time Travel restore is destructive (in-place). Human-only, via RUNBOOK."],
  [/\bwrangler\b.*\b(delete|rollback)\b/i, "Remote deletes/rollbacks are human/CI-only."],
  [/\bversions deploy\b/i, "Traffic shifting is CI-only."],
  [/\bsecret (put|delete|bulk)\b/i, "Use `factory secrets set` with a human supplying the value."],
  [/\bfactory (destroy|archive)\b.*--apply/i, "Destructive factory commands are human-only."],
  [/dns_records|\/zones\/[^ ]*\/(settings|dns)/i, "DNS/zone changes are human-only."],
  [/\bwrangler (login|tunnel)\b/i, "Not permitted for agents."],
  [/(DROP|TRUNCATE|ALTER TABLE .* (DROP|RENAME))\b/i, "Destructive SQL detected in a command. Write a migration file and follow the expand/contract policy."],
  [/CLOUDFLARE_API_TOKEN=|--no-verify|push .*--force/i, "Credential injection / check bypass is not permitted."],
  [/\.dev\.vars(?!\.example)|(^|[\s/=])\.env(?!\.example)(\.\w+)?(?=$|[\s;&|)])/i, "Secret files (.dev.vars, .env*) are not for agents. Read the .example file for names."],
  [new RegExp(MUTATE + "[^;&|]*\\.claude(?![\\w-])|\\.claude(?![\\w-])[^;&|]*" + MUTATE, "i"), ".claude/ is guardrail config. Changes need a reviewed PR."],
];
for (const [re, why] of rules) {
  if (re.test(norm)) { console.error(`BLOCKED by factory guard: ${why}\nCommand: ${norm}`); process.exit(2); }
}
process.exit(0);
