import assert from 'node:assert/strict'
import { createVikanClient } from '../dist/index.js'
import { signWebhook, verifyWebhook, WEBHOOK_HEADERS } from '../dist/webhooks.js'
import { createEventClient } from '../dist/events.js'
import { createVikanApiClient, agentDeliverableClaimSchema } from '../dist/agent.js'

const id = '11111111-1111-4111-8111-111111111111'
const api = createVikanClient({ apiKey: 'test', fetch: async () => Response.json({
  user: { id, name: 'Test' }, workspace: { id, name: 'Test', role: 'admin', archived: false }, scope: 'vikan:read',
}) })
assert.equal((await api.identity.get()).workspace.id, id)
const secret = `vwhsec_${'a'.repeat(43)}`, timestamp = String(Math.floor(Date.now() / 1000))
const body = JSON.stringify({ id, version: 1, type: 'issue.created', createdAt: new Date().toISOString(), workspaceId: id, data: { projectId: id, issueId: id } })
const signature = await signWebhook({ id, timestamp, body, secret })
assert.equal((await verifyWebhook({ body, secret, headers: {
  [WEBHOOK_HEADERS.id]: id, [WEBHOOK_HEADERS.timestamp]: timestamp, [WEBHOOK_HEADERS.signature]: signature,
} })).id, id)
const subscription = { id, projectId: id, workspaceId: id, basin: 'example', stream: 'events', token: 'test',
  tokenExpiresAt: new Date(Date.now() + 300_000).toISOString(), nextSeqNum: '7', retentionSeconds: 604800 }
const events = createEventClient(api, { transport: { open: async (_grant, cursor) => ({
  async *[Symbol.asyncIterator]() { yield { seqNum: cursor, body } }, async close() {},
}) } }).subscribe({ projectId: id, subscription })
assert.equal((await events.next()).value.cursor, '8')
await events.return()
const device = createVikanApiClient({ apiOrigin: 'https://example.test', credential: 'device-test', fetch: async (url, init) => {
  assert.equal(url, 'https://example.test/api/agent/runs')
  assert.equal(new Headers(init.headers).get('authorization'), 'Bearer device-test')
  return Response.json({ runs: [] })
} })
assert.deepEqual(await device.listRuns({}), { runs: [] })
assert.equal(agentDeliverableClaimSchema.safeParse({ sessionId: id, claimEpoch: 1 }).success, true)
console.log(`Node ${process.versions.node}: built API and device clients, webhook verification and S2 iterator passed.`)
