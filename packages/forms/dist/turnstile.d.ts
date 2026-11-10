export declare const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export interface TurnstileOptions {
    /** Expected hostname or action; verification fails when they differ. */
    expectedHostname?: string;
    expectedAction?: string;
    fetch?: typeof fetch;
}
/**
 * Server-side Turnstile check. Returns `false` for a missing token, a network error
 * or any non-success answer; never throws.
 */
export declare function verifyTurnstile(token: string | null, secret: string, ip?: string | null, opts?: TurnstileOptions): Promise<boolean>;
//# sourceMappingURL=turnstile.d.ts.map