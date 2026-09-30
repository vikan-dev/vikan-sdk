import { parseEvent, verifyWebhookSignature, WEBHOOK_HEADERS } from './generated/runtime.js'
import type { WebhookEvent } from './generated/types.js'

export { WEBHOOK_HEADERS, signWebhook } from './generated/runtime.js'
export type { WebhookEvent } from './generated/types.js'
export interface VerifyWebhookOptions {
  body: string | Uint8Array
  headers: Headers | Record<string, string>
  secret: string
  /** Allowed age/clock skew in seconds. Default: 300. */
  toleranceSeconds?: number
  /** Current Unix time in milliseconds; useful for deterministic tests. */
  now?: number
}
export class VikanWebhookError extends Error {
  constructor(cause: unknown) {
    super('The vikan webhook could not be verified.', { cause })
    this.name = 'VikanWebhookError'
  }
}
/** Verify raw bytes first, then validate the event. Persist event.id to deduplicate delivery. */
export async function verifyWebhook(options: VerifyWebhookOptions): Promise<WebhookEvent> {
  try {
    const headers = new Headers(options.headers)
    await verifyWebhookSignature({
      body: options.body, secret: options.secret,
      id: headers.get(WEBHOOK_HEADERS.id) ?? '',
      timestamp: headers.get(WEBHOOK_HEADERS.timestamp) ?? '',
      signature: headers.get(WEBHOOK_HEADERS.signature) ?? '',
      toleranceSeconds: options.toleranceSeconds, now: options.now,
    })
    const text = typeof options.body === 'string' ? options.body : new TextDecoder('utf-8', { fatal: true }).decode(options.body)
    return parseEvent(JSON.parse(text)) as WebhookEvent
  } catch (error) { throw new VikanWebhookError(error) }
}
