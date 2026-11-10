# @vdodan/config

Shared TypeScript presets for App Factory packages and apps.

## API

- `@vdodan/config/tsconfig.base.json`: strict, ES2023, `moduleResolution: bundler`, `verbatimModuleSyntax`.
- `@vdodan/config/tsconfig.worker.json`: base plus `types: ["@cloudflare/workers-types"]`.
- `COMPATIBILITY_DATE` (`2026-09-01`) and `COMPATIBILITY_FLAGS` (`["nodejs_compat"]`).

## Example

```jsonc
// tsconfig.json
{
  "extends": "@vdodan/config/tsconfig.worker.json",
  "include": ["src"]
}
```
