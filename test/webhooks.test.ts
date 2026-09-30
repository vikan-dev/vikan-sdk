import { createHmac } from 'node:crypto'
import { expect, test } from 'bun:test'
import { verifyWebhook, VikanWebhookError, WEBHOOK_HEADERS } from '../src/webhooks.js'

const id = '11111111-1111-4111-8111-111111111111'
const secret = 'vwhsec_' + 'a'.repeat(43)
const timestamp = '1790769600'
const event = { id, version: 1, type: 'issue.created', createdAt: '2026-09-30T12:00:00.000Z', workspaceId: id, data: { issueId: id, projectId: id } } as const
const body = JSON.stringify(event)
const headers = {
  [WEBHOOK_HEADERS.id]: id,
  [WEBHOOK_HEADERS.timestamp]: timestamp,
  [WEBHOOK_HEADERS.signature]: 'v1=' + createHmac('sha256', secret).update(`${id}.${timestamp}.${body}`).digest('hex'),
}
test('verifies a Node HMAC test vector over the original bytes and parses the event', async () => {
  expect(await verifyWebhook({ body: new TextEncoder().encode(body), headers, secret, now: Number(timestamp) * 1000 })).toEqual(event)
})
test('rejects changed body, delivery ID, stale timestamps and malformed events', async () => {
  const base = { body, headers, secret, now: Number(timestamp) * 1000 }
  await expect(verifyWebhook({ ...base, body: body + ' ' })).rejects.toBeInstanceOf(VikanWebhookError)
  await expect(verifyWebhook({ ...base, headers: { ...headers, [WEBHOOK_HEADERS.id]: '22222222-2222-4222-8222-222222222222' } })).rejects.toBeInstanceOf(VikanWebhookError)
  await expect(verifyWebhook({ ...base, now: base.now + 301_000 })).rejects.toBeInstanceOf(VikanWebhookError)
  const invalidBody = '{}'
  const signature = 'v1=' + createHmac('sha256', secret).update(`${id}.${timestamp}.${invalidBody}`).digest('hex')
  await expect(verifyWebhook({ ...base, body: invalidBody, headers: { ...headers, [WEBHOOK_HEADERS.signature]: signature } })).rejects.toBeInstanceOf(VikanWebhookError)
})
