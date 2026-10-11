// Runtime implementation is exported directly from the main vikan contract.
export const operations: Record<string, { method: string; path: string; status: number; description: string }>
export function parseInput(name: string, value: unknown): Record<string, Record<string, unknown>>
export function parseOutput(name: string, value: unknown): unknown
export function parseEvent(value: unknown): unknown
export function parseProblem(value: unknown): unknown
export const WEBHOOK_HEADERS: { readonly id: 'vikan-webhook-id'; readonly timestamp: 'vikan-webhook-timestamp'; readonly signature: 'vikan-webhook-signature' }
export function signWebhook(input: { id: string; timestamp: string; body: string | Uint8Array; secret: string }): Promise<string>
export function verifyWebhookSignature(input: { id: string; timestamp: string; signature: string; body: string | Uint8Array; secret: string; now?: number; toleranceSeconds?: number }): Promise<void>
