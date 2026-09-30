import { expect, test } from 'bun:test'
import { createVikanClient, VikanApiError, VikanConnectionError, VikanValidationError } from '../src/index.js'

const id = '11111111-1111-4111-8111-111111111111'
const identity = { user: { id, name: 'Example' }, workspace: { id, name: 'Workspace', role: 'admin', archived: false }, scope: 'vikan:write' } as const
function client(implementation: (url: string | URL | Request, init?: RequestInit) => Promise<Response>, maxRetries = 0) {
  return createVikanClient({ apiKey: 'test-key', baseUrl: 'https://example.test/api', fetch: implementation, maxRetries })
}

test('sends the contract URL, auth and query, and validates successful responses', async () => {
  const api = client(async (url, init) => {
    expect(String(url)).toBe('https://example.test/api/mcp/tools/identity')
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer test-key')
    expect(init?.redirect).toBe('error')
    return Response.json(identity)
  })
  expect(await api.identity.get()).toEqual(identity)
  const bad = client(async () => Response.json({ user: { id } }))
  await expect(bad.identity.get()).rejects.toBeInstanceOf(VikanValidationError)
})

test('rejects invalid input before sending and does not retry writes', async () => {
  let calls = 0
  const api = client(async () => { calls++; throw new Error('connection reset') }, 2)
  await expect(api.issues.create({ body: { title: 'No project', operationId: id } } as never)).rejects.toBeInstanceOf(VikanValidationError)
  expect(calls).toBe(0)
  await expect(api.issues.create({ body: { title: 'Task', projectId: id, operationId: id } })).rejects.toBeInstanceOf(VikanConnectionError)
  expect(calls).toBe(1)
})

test('retries transient reads and exposes verified error details', async () => {
  let calls = 0
  const api = client(async () => ++calls === 1 ? new Response('proxy unavailable', { status: 503, headers: { 'retry-after': '0' } }) : Response.json(identity), 1)
  expect(await api.identity.get()).toEqual(identity)
  expect(calls).toBe(2)
  const forbidden = client(async () => Response.json({ type: 'https://errors.zebra.dev/forbidden', title: 'No access', status: 403, instance: '/api/mcp/tools/identity' }, { status: 403 }))
  try { await forbidden.identity.get(); throw new Error('Expected a refusal') } catch (error) {
    expect(error).toBeInstanceOf(VikanApiError)
    expect((error as VikanApiError).code).toBe('forbidden')
  }
})

test('paginates with unchanged filters and a cursor from the previous page', async () => {
  const queries: URLSearchParams[] = []
  const api = client(async url => {
    queries.push(new URL(String(url)).searchParams)
    return Response.json({ dataSource: 'server-committed', readAt: '2026-09-30T12:00:00.000Z', items: [], nextCursor: queries.length === 1 ? id : null })
  })
  const items = []
  for await (const item of api.paginate('issues.list', { query: { query: 'query with spaces', limit: 10 } })) items.push(item)
  expect(items).toEqual([])
  expect(queries).toHaveLength(2)
  expect(queries[1]?.get('query')).toBe('query with spaces')
  expect(queries[1]?.get('cursor')).toBe(id)
})

test('honors a cancelled caller signal before sending', async () => {
  const api = client(async () => { throw new Error('Must not fetch') })
  const controller = new AbortController(); controller.abort()
  await expect(api.identity.get({}, { signal: controller.signal })).rejects.toMatchObject({ kind: 'aborted' })
})
