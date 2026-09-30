import { expect, test } from 'bun:test'
import { createVikanClient } from '../src/index.js'
import { createEventClient, VikanEventError, type EventSubscription, type EventTransport } from '../src/events.js'

const id = '11111111-1111-4111-8111-111111111111'
const grant = (): EventSubscription => ({ id, projectId: id, workspaceId: id, basin: 'example', stream: `vikan/projects/${id}/events/v1`,
  token: 'stream-only-token', tokenExpiresAt: new Date(Date.now() + 300_000).toISOString(), nextSeqNum: '0', retentionSeconds: 604800 })
const body = JSON.stringify({ id, version: 1, type: 'issue.created', createdAt: new Date().toISOString(), workspaceId: id, data: { issueId: id, projectId: id } })
const api = createVikanClient({ apiKey: 'test', fetch: async () => Response.json(grant()) })

test('resumes from the next unprocessed cursor and closes the stream on return', async () => {
  let closed = false, start = -1
  const transport: EventTransport = { open: async (_grant, cursor) => {
    start = cursor
    return { async *[Symbol.asyncIterator]() { yield { seqNum: cursor, body } }, async close() { closed = true } }
  } }
  const events = createEventClient(api, { transport }).subscribe({ projectId: id, cursor: '12' })
  const record = await events.next()
  expect(start).toBe(12)
  expect(record.value).toMatchObject({ sequence: '12', cursor: '13', event: { id } })
  await events.return(undefined)
  expect(closed).toBe(true)
})
test('reports retention gaps and rejects unsafe numeric cursors', async () => {
  const transport: EventTransport = { open: async () => ({ async *[Symbol.asyncIterator]() { yield { seqNum: 4, body } }, async close() {} }) }
  const events = createEventClient(api, { transport })
  await expect(events.subscribe({ projectId: id, cursor: '0' }).next()).rejects.toMatchObject({ kind: 'gap' })
  await expect(events.subscribe({ projectId: id, cursor: '9007199254740992' }).next()).rejects.toBeInstanceOf(VikanEventError)
})
test('keeps the pre-snapshot cursor when the supplied grant has expired', async () => {
  const expired = { ...grant(), tokenExpiresAt: new Date(Date.now() - 1_000).toISOString(), nextSeqNum: '12' }
  const fresh = { ...grant(), nextSeqNum: '20' }
  const client = createVikanClient({ apiKey: 'test', fetch: async () => Response.json(fresh) })
  const transport: EventTransport = { open: async (renewed, cursor) => {
    expect(renewed.tokenExpiresAt).toBe(fresh.tokenExpiresAt)
    expect(cursor).toBe(12)
    return { async *[Symbol.asyncIterator]() { yield { seqNum: cursor, body } }, async close() {} }
  } }
  const events = createEventClient(client, { transport }).subscribe({ projectId: id, subscription: expired })
  expect((await events.next()).value?.cursor).toBe('13')
  await events.return(undefined)
})
test('reconnects at the acknowledged cursor and honors abort', async () => {
  const starts: number[] = []
  const controller = new AbortController()
  const transport: EventTransport = { open: async (_grant, cursor) => {
    starts.push(cursor)
    return { async *[Symbol.asyncIterator]() { yield { seqNum: cursor, body }; throw new Error('Disconnected') }, async close() {} }
  } }
  const events = createEventClient(api, { transport }).subscribe({ projectId: id, signal: controller.signal })
  expect((await events.next()).value?.cursor).toBe('1')
  expect((await events.next()).value?.cursor).toBe('2')
  expect(starts).toEqual([0, 1])
  controller.abort()
  expect((await events.next()).done).toBe(true)
})
