// .claude/hooks/guard-bash.mjs — blocks dangerous commands regardless of how they're spelled.
// Source: factory docs/17-ai-agent-guidelines.md §3.2. Changes need human review (CODEOWNERS).
import { readFileSync } from "node:fs";
const input = JSON.parse(readFileSync(0, "utf8"));
const cmd = (input.tool_input?.command ?? "").replace(/\s+/g, " ");

const rules = [
  [/(--env[ =]|-e )(prod|production)\b/i, "Production targeting is CI-only. Open a PR / trigger the approved workflow."],
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
];
for (const [re, why] of rules) {
  if (re.test(cmd)) { console.error(`BLOCKED by factory guard: ${why}\nCommand: ${cmd}`); process.exit(2); }
}
process.exit(0);
