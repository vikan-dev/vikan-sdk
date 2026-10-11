import type { WebhookEvent } from './generated/types.js';
export { WEBHOOK_HEADERS, signWebhook } from './generated/runtime.js';
export type { WebhookEvent } from './generated/types.js';
export interface VerifyWebhookOptions {
    body: string | Uint8Array;
    headers: Headers | Record<string, string>;
    secret: string;
    /** Allowed age/clock skew in seconds. Default: 300. */
    toleranceSeconds?: number;
    /** Current Unix time in milliseconds; useful for deterministic tests. */
    now?: number;
}
export declare class VikanWebhookError extends Error {
    constructor(cause: unknown);
}
/** Verify raw bytes first, then validate the event. Persist event.id to deduplicate delivery. */
export declare function verifyWebhook(options: VerifyWebhookOptions): Promise<WebhookEvent>;
