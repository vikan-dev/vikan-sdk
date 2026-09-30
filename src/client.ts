import { operations, parseInput, parseOutput, parseProblem } from './generated/runtime.js'
import type { ApiOperation, Operations } from './generated/types.js'
import { VikanApiError, VikanConnectionError, VikanValidationError, type ApiProblem } from './errors.js'

export interface RequestOptions { signal?: AbortSignal; timeoutMs?: number }
export type FetchImplementation = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
export interface VikanClientOptions {
  apiKey: string
  /** Full API base, including /api. Defaults to https://app.vikan.dev/api. */
  baseUrl?: string
  fetch?: FetchImplementation
  timeoutMs?: number
  /** Retry transient GET failures only. Writes must be retried explicitly with the same operationId. */
  maxRetries?: number
}
export type Input<K extends ApiOperation> = Operations[K]['input']
export type Output<K extends ApiOperation> = Operations[K]['output']
type Group = ApiOperation extends `${infer G}.${string}` ? G : never
type Method<K extends ApiOperation> = {} extends Input<K>
  ? (input?: Input<K>, options?: RequestOptions) => Promise<Output<K>>
  : (input: Input<K>, options?: RequestOptions) => Promise<Output<K>>
export type PaginatedOperation = { [K in ApiOperation]: Output<K> extends { items: unknown[]; nextCursor: string | null } ? K : never }[ApiOperation]
type PageItem<K extends PaginatedOperation> = Output<K> extends { items: Array<infer Item> } ? Item : never
export type VikanClient = {
  [G in Group]: { [K in ApiOperation as K extends `${G}.${infer Name}` ? Name : never]: Method<K> }
} & {
  request<K extends ApiOperation>(operation: K, input: Input<K>, options?: RequestOptions): Promise<Output<K>>
  paginate<K extends PaginatedOperation>(operation: K, input: Input<K>, options?: RequestOptions): AsyncGenerator<PageItem<K>>
}

function positiveTimeout(value: number) {
  if (!Number.isSafeInteger(value) || value <= 0 || value > 2_147_483_647) throw new TypeError('timeoutMs must be a positive integer below 2^31.')
  return value
}
function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new VikanConnectionError('aborted', signal.reason)); return }
    const abort = () => { clearTimeout(timer); reject(new VikanConnectionError('aborted', signal?.reason)) }
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve() }, ms)
    signal?.addEventListener('abort', abort, { once: true })
  })
}

export function createVikanClient(options: VikanClientOptions): VikanClient {
  if (!options.apiKey || /\s/.test(options.apiKey)) throw new TypeError('Pass a nonempty API key without whitespace.')
  const base = new URL(options.baseUrl ?? 'https://app.vikan.dev/api')
  if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new TypeError('baseUrl must be an HTTP(S) API base without credentials, query or fragment.')
  const baseUrl = base.href.replace(/\/+$/, '')
  const fetchFn = options.fetch ?? globalThis.fetch
  const timeoutMs = positiveTimeout(options.timeoutMs ?? 15_000)
  const retries = options.maxRetries ?? 2
  if (!Number.isInteger(retries) || retries < 0 || retries > 5) throw new TypeError('maxRetries must be between 0 and 5.')

  async function invoke<K extends ApiOperation>(operation: K, input: Input<K>, request: RequestOptions = {}): Promise<Output<K>> {
    const definition = operations[operation]
    if (!definition) throw new TypeError(`Unknown operation: ${operation}`)
    let parsed: Record<string, Record<string, unknown>>
    try { parsed = parseInput(operation, input) } catch (error) { throw new VikanValidationError('input', error) }
    const path = definition.path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
      const value = String(parsed.params?.[key] ?? '')
      if (!value || value === '.' || value === '..') throw new TypeError(`Invalid path parameter: ${key}`)
      return encodeURIComponent(value)
    })
    const url = new URL(baseUrl + path)
    for (const [key, value] of Object.entries(parsed.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value))
    const body = parsed.body === undefined ? undefined : JSON.stringify(parsed.body)
    const attempts = definition.method === 'GET' ? retries + 1 : 1
    for (let attempt = 0; attempt < attempts; attempt++) {
      const timeout = AbortSignal.timeout(positiveTimeout(request.timeoutMs ?? timeoutMs))
      const signal = request.signal ? AbortSignal.any([request.signal, timeout]) : timeout
      let response: Response, text: string
      try {
        signal.throwIfAborted()
        response = await fetchFn(url, {
          method: definition.method, redirect: 'error', signal,
          headers: { authorization: `Bearer ${options.apiKey}`, accept: 'application/json', ...(body === undefined ? {} : { 'content-type': 'application/json' }) },
          ...(body === undefined ? {} : { body }),
        })
        text = await response.text()
      } catch (error) {
        const kind = request.signal?.aborted ? 'aborted' : timeout.aborted ? 'timeout' : 'network'
        if (kind !== 'aborted' && attempt + 1 < attempts) { await wait(200 * 2 ** attempt, request.signal); continue }
        throw new VikanConnectionError(kind, error)
      }
      let value: unknown
      try { value = JSON.parse(text) } catch { value = undefined }
      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && attempt + 1 < attempts) {
          const header = response.headers.get('retry-after')
          const retryAfter = header === null ? NaN : /^\d+$/.test(header) ? Number(header) * 1000 : Date.parse(header) - Date.now()
          await wait(Number.isFinite(retryAfter) ? Math.min(30_000, Math.max(0, retryAfter)) : 200 * 2 ** attempt, request.signal)
          continue
        }
        let problem: ApiProblem | undefined
        try {
          const candidate = parseProblem(value) as ApiProblem
          if (candidate.status === response.status) problem = candidate
        } catch { /* A proxy error or future error code is still an HTTP failure. */ }
        throw new VikanApiError(response.status, problem)
      }
      try { return parseOutput(operation, value) as Output<K> } catch (error) { throw new VikanValidationError('output', error) }
    }
    throw new Error('Unreachable request state')
  }

  const client: Record<string, unknown> = { request: invoke }
  for (const operation of Object.keys(operations) as ApiOperation[]) {
    const [group, method] = operation.split('.') as [string, string]
    const resource = (client[group] ??= {}) as Record<string, unknown>
    resource[method] = (input: unknown = {}, request?: RequestOptions) => invoke(operation, input as Input<typeof operation>, request)
  }
  client.paginate = async function* <K extends PaginatedOperation>(operation: K, input: Input<K>, request?: RequestOptions): AsyncGenerator<PageItem<K>> {
    let current = input
    const seen = new Set<string>()
    while (true) {
      const page = await invoke(operation, current, request) as { items: PageItem<K>[]; nextCursor: string | null }
      for (const item of page.items) yield item
      if (page.nextCursor === null) return
      if (seen.has(page.nextCursor)) throw new VikanValidationError('output', new Error('The server repeated a pagination cursor.'))
      seen.add(page.nextCursor)
      current = { ...input, query: { ...('query' in input ? input.query : {}), cursor: page.nextCursor } } as Input<K>
    }
  }
  return client as VikanClient
}
