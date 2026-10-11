import { expect, test } from 'bun:test'
import {
  createVikanApiClient, ApiCallError, apiFailure, AGENT_PROTOCOL_VERSION,
  agentBindingCommandsStream, agentDeliverableClaimSchema,
  deliverableDocumentInputSchema, isUnsupportedAgentProtocolVersion,
} from '../src/agent.js'

const id = '11111111-1111-4111-8111-111111111111'
const origin = 'https://example.test'

test('device client uses generated routes, bearer credentials and validated output', async () => {
  const api = createVikanApiClient({ apiOrigin: origin, credential: 'device-secret', fetch: async (url, init) => {
    expect(url).toBe(`${origin}/api/agent/runs?bindingId=${id}`)
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer device-secret')
    expect(init?.redirect).toBe('error')
    return Response.json({ runs: [] })
  } })
  expect(await api.listRuns({ bindingId: id })).toEqual({ runs: [] })
  const broken = createVikanApiClient({ apiOrigin: origin, fetch: async () => Response.json({ runs: [{}] }) })
  await expect(broken.listRuns({})).rejects.toMatchObject({ failure: { kind: 'invalid-output' } })
})

test('pairing remains unauthenticated and pending is a verified problem', async () => {
  const api = createVikanApiClient({ apiOrigin: origin, fetch: async (url, init) => {
    expect(url).toBe(`${origin}/api/agent/link-requests/${id}/claim`)
    expect(new Headers(init?.headers).has('authorization')).toBe(false)
    expect(JSON.parse(String(init?.body))).toEqual({ pairingSecret: 'p'.repeat(32) })
    return Response.json({ type: 'https://errors.zebra.dev/link_pending', status: 425, title: 'Pending', instance: '/' }, { status: 425 })
  } })
  await expect(api.claimLinkRequest(id, 'p'.repeat(32))).rejects.toMatchObject({ failure: { kind: 'problem', code: 'link_pending', status: 425 } })
  const proxy = createVikanApiClient({ apiOrigin: origin, fetch: async () => new Response('<html>gateway failure</html>', { status: 502 }) })
  await expect(proxy.listBindings()).rejects.toMatchObject({ failure: { kind: 'invalid-output' } })
})

test('multipart sends the claim metadata and file without a JSON content type', async () => {
  const file = new File(['evidence'], 'result.txt', { type: 'text/plain' })
  const metadata = { sessionId: id, claimEpoch: 1, operationId: id }
  const api = createVikanApiClient({ apiOrigin: origin, credential: 'device-secret', fetch: async (url, init) => {
    expect(url).toBe(`${origin}/api/agent/runs/${id}/files`)
    expect(new Headers(init?.headers).has('content-type')).toBe(false)
    expect(init?.body).toBeInstanceOf(FormData)
    const form = init!.body as FormData
    expect(JSON.parse(String(form.get('metadata')))).toEqual(metadata)
    expect(await (form.get('file') as File).text()).toBe('evidence')
    return Response.json({ type: 'https://errors.zebra.dev/forbidden', status: 403, title: 'Forbidden', instance: '/' }, { status: 403 })
  } })
  await expect(api.uploadDeliverableFile(id, metadata, file)).rejects.toMatchObject({ failure: { kind: 'problem', code: 'forbidden' } })
})

test('ambiguous writes are not retried and timeouts retain their classification', async () => {
  let calls = 0
  const api = createVikanApiClient({ apiOrigin: origin, fetch: async () => { calls++; throw new Error('connection reset') } })
  await expect(api.claimRun(id, id)).rejects.toMatchObject({ failure: { kind: 'network' } })
  expect(calls).toBe(1)
  const timedOut = createVikanApiClient({ apiOrigin: origin, timeoutMs: 1, fetch: async (_url, init) => {
    await new Promise<void>((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal!.reason), { once: true }))
    throw new Error('unreachable')
  } })
  await expect(timedOut.listBindings()).rejects.toMatchObject({ failure: { kind: 'timeout' } })
  expect(apiFailure(new ApiCallError({ kind: 'timeout' }))).toEqual({ kind: 'timeout' })
})

test('response body disconnects and timeouts remain transport failures', async () => {
  for (const [error, kind] of [
    [new TypeError('stream disconnected'), 'network'],
    [new DOMException('body read timed out', 'TimeoutError'), 'timeout'],
  ] as const) {
    const api = createVikanApiClient({ apiOrigin: origin, fetch: async () => new Response(new ReadableStream({
      start(controller) { controller.error(error) },
    })) })
    await expect(api.listBindings()).rejects.toMatchObject({ failure: { kind } })
  }
  const malformed = createVikanApiClient({ apiOrigin: origin, fetch: async () => new Response('{"broken":') })
  await expect(malformed.listBindings()).rejects.toMatchObject({ failure: { kind: 'invalid-output' } })
})

test('health validates both success and problem responses', async () => {
  const healthy = createVikanApiClient({ apiOrigin: origin, fetch: async () => Response.json({ status: 'ok', database: 'up' }) })
  expect(await healthy.checkHealth()).toEqual({ status: 'ok', database: 'up' })
  const proxy = createVikanApiClient({ apiOrigin: origin, fetch: async () => new Response('<html>unavailable</html>', { status: 503 }) })
  await expect(proxy.checkHealth()).rejects.toMatchObject({ failure: { kind: 'invalid-output' } })
})

test('request construction failures use the classified API error boundary', async () => {
  const api = createVikanApiClient({ apiOrigin: origin })
  await expect(api.getRun('..')).rejects.toMatchObject({ name: 'ApiCallError', failure: { kind: 'network' } })
  const malformed = createVikanApiClient({ apiOrigin: 'not an origin' })
  await expect(malformed.listBindings()).rejects.toMatchObject({ name: 'ApiCallError', failure: { kind: 'network' } })
})

test('generated schemas keep refinements and stream protocol helpers', () => {
  expect(agentDeliverableClaimSchema.shape.claimEpoch.safeParse(0).success).toBe(false)
  expect(agentDeliverableClaimSchema.safeParse({ sessionId: id, claimEpoch: 1 }).success).toBe(true)
  expect(deliverableDocumentInputSchema.safeParse({ format: 'json', content: { type: 'doc', content: [{ type: 'text', text: 'invalid root child' }] } }).success).toBe(false)
  expect(agentBindingCommandsStream(id)).toBe(`bindings/${id}/commands`)
  expect(isUnsupportedAgentProtocolVersion({ protocolVersion: AGENT_PROTOCOL_VERSION + 1 })).toBe(true)
})
