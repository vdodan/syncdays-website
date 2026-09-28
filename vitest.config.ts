import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

// Tests run inside workerd (Miniflare). They do not need `astro build`: the ASSETS
// binding is replaced with a stub per test, and outbound fetches (Turnstile, Resend)
// are mocked. remoteBindings is off so tests never talk to a Cloudflare account.
export default defineConfig({
  plugins: [
    cloudflareTest({
      main: './worker/index.ts',
      remoteBindings: false,
      miniflare: {
        // wrangler.jsonc uses 2026-09-01, but the workerd bundled with
        // @cloudflare/vitest-pool-workers 0.22.0 (miniflare 5.20260815) supports dates up to
        // 2026-08-22 only. Bump to match wrangler.jsonc when the pool is upgraded.
        compatibilityDate: '2026-08-22',
        compatibilityFlags: ['nodejs_compat'],
      },
    }),
  ],
  test: {
    include: ['test/**/*.test.ts'],
  },
});
