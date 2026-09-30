import { S2, S2Error } from '@s2-dev/streamstore'
import type { Output, VikanClient } from './client.js'
import { parseEvent } from './generated/runtime.js'
import type { WebhookEvent } from './generated/types.js'

export type PublicEvent = WebhookEvent
export type EventSubscription = Output<'events.createSubscription'>
export interface EventRecord { seqNum: number; body: string }
export interface EventReadSession extends AsyncIterable<EventRecord> { close(): Promise<void> }
export interface EventTransport {
  open(grant: EventSubscription, cursor: number, signal: AbortSignal): Promise<EventReadSession>
}
export interface SubscribeOptions {
  projectId: string
  /** Next unprocessed sequence, persisted AFTER accepting the preceding event. */
  cursor?: string
  /** Capture this before reading an API snapshot, then pass it here to avoid a sync window. */
  subscription?: EventSubscription
  signal?: AbortSignal
}
export class VikanEventError extends Error {
  constructor(readonly kind: 'cursor' | 'gap' | 'invalid-event' | 'transport', message: string, options?: ErrorOptions) {
    super(message, options); this.name = 'VikanEventError'
  }
}
function numericCursor(value: string): number {
  if (!/^(0|[1-9][0-9]*)$/.test(value) || BigInt(value) > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new VikanEventError('cursor', 'This S2 SDK cannot represent the cursor exactly. Upgrade before reading.')
  }
  return Number(value)
}
const transport: EventTransport = {
  async open(grant, cursor, signal) {
    const account = new S2({ accessToken: grant.token, retry: { maxAttempts: 1 } })
    const session = await account.basin(grant.basin).stream(grant.stream).readSession({ start: { from: { seqNum: cursor } } }, { signal })
    const abort = () => { void session.cancel().catch(() => undefined) }
    signal.addEventListener('abort', abort, { once: true })
    if (signal.aborted) abort()
    return {
      [Symbol.asyncIterator]: () => session[Symbol.asyncIterator](),
      async close() { signal.removeEventListener('abort', abort); await session.cancel().catch(() => undefined) },
    }
  },
}
async function reconnectDelay(signal?: AbortSignal) {
  if (signal?.aborted) return
  await new Promise<void>(resolve => {
    const done = () => { clearTimeout(timer); signal?.removeEventListener('abort', done); resolve() }
    const timer = setTimeout(done, 1_000)
    signal?.addEventListener('abort', done, { once: true })
  })
}

/** Public API-key event access; it never uses CLI device credentials. */
export function createEventClient(client: VikanClient, options: { transport?: EventTransport } = {}) {
  const reader = options.transport ?? transport
  return {
    async *subscribe(input: SubscribeOptions): AsyncGenerator<{ event: PublicEvent; sequence: string; cursor: string }> {
      let grant = input.subscription
      // The snapshot's starting position survives renewal of an expired grant.
      let cursor = input.cursor ?? grant?.nextSeqNum
      if (cursor !== undefined) numericCursor(cursor)
      if (grant && grant.projectId !== input.projectId) throw new VikanEventError('invalid-event', 'The subscription belongs to another project.')
      while (!input.signal?.aborted) {
        if (!grant || Date.parse(grant.tokenExpiresAt) <= Date.now() + 5_000) {
          grant = await client.events.createSubscription({ body: { projectId: input.projectId } }, { signal: input.signal })
        }
        cursor ??= grant.nextSeqNum
        const renewal = new AbortController()
        const renewAfter = Date.parse(grant.tokenExpiresAt) - Date.now() - 5_000
        if (!Number.isFinite(renewAfter) || renewAfter <= 0) throw new VikanEventError('invalid-event', 'The server returned an expired event grant.')
        const timer = setTimeout(() => renewal.abort(), renewAfter)
        const signal = input.signal ? AbortSignal.any([input.signal, renewal.signal]) : renewal.signal
        let session: EventReadSession | undefined
        try {
          session = await reader.open(grant, numericCursor(cursor), signal)
          for await (const record of session) {
            if (signal.aborted) break
            if (!Number.isSafeInteger(record.seqNum) || record.seqNum < 0) throw new VikanEventError('cursor', 'S2 returned an inexact sequence number.')
            const position = BigInt(record.seqNum), expected = BigInt(cursor)
            if (position < expected) continue
            if (position > expected) throw new VikanEventError('gap', `Event retention gap: expected ${cursor}, received ${position}. Capture a fresh subscription and refetch current API data.`)
            let event: PublicEvent
            try {
              event = parseEvent(JSON.parse(record.body)) as PublicEvent
              if (event.workspaceId !== grant.workspaceId || event.data.projectId !== input.projectId) throw new Error('Event scope mismatch')
            } catch (cause) { throw new VikanEventError('invalid-event', 'The stream record does not match the public event contract.', { cause }) }
            const next = String(position + 1n)
            yield { event, sequence: String(position), cursor: next }
            cursor = next
          }
        } catch (error) {
          if (input.signal?.aborted) return
          if (error instanceof VikanEventError) throw error
          if (error instanceof S2Error && (error.status === 404 || error.status === 416)) throw new VikanEventError('gap', 'The stream or saved cursor is outside retention. Refetch current API data.', { cause: error })
          if (error instanceof S2Error && (error.status === 401 || error.status === 403)) grant = undefined
          else if (error instanceof S2Error && error.status !== undefined && error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
            throw new VikanEventError('transport', 'S2 rejected the stream request.', { cause: error })
          }
          // Other transport failures reconnect at the current exact cursor.
        } finally {
          clearTimeout(timer)
          await session?.close()
        }
        if (!input.signal?.aborted && !renewal.signal.aborted) await reconnectDelay(input.signal)
      }
    },
  }
}
