import { problemCode, problemSchema } from './generated/agent-runtime.js'
import { parseApiOutput } from './generated/agent-runtime.js'
import { healthSchema } from './generated/agent-runtime.js'
import {
  agentBindingRevokedSchema,
  agentBindingsSchema,
  linkClaimedSchema,
  linkRequestCreateSchema,
  linkRequestCreatedSchema,
} from './generated/agent-runtime.js'
import { agentCommandSchema } from './generated/agent-runtime.js'
import { agentFindingsPublishResultSchema,
  type agentFindingsPublishSchema } from './generated/agent-runtime.js'
import { createAgentDeliverableFileUpload,
  type agentDeliverableClaimSchema, type agentPublishIssueStageBodySchema,
  type agentFinishIssueStageBodySchema,
  type AgentDeliverableFileMetadata } from './generated/agent-runtime.js'
import { issueDeliverablesSummarySchema, publishIssueStageResultSchema,
  finishIssueStageResultSchema } from './generated/agent-runtime.js'
import { fileUploadResultSchema } from './generated/agent-runtime.js'
import {
  agentCommandsSchema,
  agentRunsSchema,
  agentRunSchema,
  runStatusReceiptSchema,
  commandAckSchema,
  commandCreateSchema,
  agentSubscriptionsSchema,
  commandAckedSchema,
  runClaimedSchema,
  runContextSchema,
  runStatusReceiptAckSchema,
  sessionHeartbeatAckSchema,
  sessionOpenedSchema,
  sessionOfflineSchema,
  sessionReconcileSchema,
  sessionReconciledSchema,
  subscriptionRequestSchema,
  projectDocumentResultSchema,
  projectDocumentResultAckSchema,
  type sessionOnlineSchema,
} from './generated/agent-runtime.js'
import type { z } from 'zod'
import { agentOperations } from './generated/agent-operations.js'

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>
interface AgentRequestInput { params?: Record<string, string>; query?: object; body?: unknown }

/** Device credential client. Routes and validation schemas are generated from
 * the server contract; no API-key or browser-cookie authentication is used.
 * Writes are never retried automatically: callers own operation recovery.
 */
export type LinkRequestCreateInput = z.infer<typeof linkRequestCreateSchema>
export type LinkRequestCreated = z.infer<typeof linkRequestCreatedSchema>
export type LinkClaimed = z.infer<typeof linkClaimedSchema>
export type AgentBindings = z.infer<typeof agentBindingsSchema>
export type Health = z.infer<typeof healthSchema>

export type SessionOnlineInput = z.infer<typeof sessionOnlineSchema>
export type SessionOpened = z.infer<typeof sessionOpenedSchema>
export type SessionReconcileInput = z.infer<typeof sessionReconcileSchema>
export type SessionReconciled = z.infer<typeof sessionReconciledSchema>
export type AgentRuns = z.infer<typeof agentRunsSchema>
export type AgentRun = AgentRuns['runs'][number]
export type RunClaimed = z.infer<typeof runClaimedSchema>
export type RunContext = z.infer<typeof runContextSchema>
export type RunStatusReceiptInput = z.infer<typeof runStatusReceiptSchema>
export type ProjectDocumentResultInput = z.infer<typeof projectDocumentResultSchema>
export type ProjectDocumentResultAck = z.infer<typeof projectDocumentResultAckSchema>
export type AgentCommands = z.infer<typeof agentCommandsSchema>
export type AgentCommand = AgentCommands['commands'][number]
export type CommandAckInput = z.infer<typeof commandAckSchema>
export type SubscriptionRequestInput = z.infer<typeof subscriptionRequestSchema>
export type AgentSubscriptions = z.infer<typeof agentSubscriptionsSchema>
export type ActiveSubscription = Extract<AgentSubscriptions['subscriptions'][number], { status: 'active' }>

export type ApiFailure =
  | { kind: 'network' }
  | { kind: 'timeout' }
  | { kind: 'problem'; code: string; status: number; title: string }
  | { kind: 'invalid-output' }

/** One classified API failure. `network`/`timeout` mean "unknown outcome" — never a verdict. */
export class ApiCallError extends Error {
  readonly failure: ApiFailure

  constructor(failure: ApiFailure) {
    super(apiFailureMessage(failure))
    this.name = 'ApiCallError'
    this.failure = failure
  }
}

export function apiFailureMessage(failure: ApiFailure): string {
  switch (failure.kind) {
    case 'network':
      return 'The vikan API is unreachable.'
    case 'timeout':
      return 'The vikan API did not answer in time.'
    case 'invalid-output':
      return 'The vikan API response did not match the shared contract schema.'
    case 'problem':
      return `The vikan API refused the request (${failure.code}, HTTP ${failure.status}): ${failure.title}`
  }
}

/** The classified failure of any thrown error; unknown shapes become network. */
export function apiFailure(error: unknown): ApiFailure {
  if (error instanceof ApiCallError) return error.failure
  if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return { kind: 'timeout' }
  }
  return { kind: 'network' }
}

export interface VikanApiClientOptions {
  readonly apiOrigin: string
  readonly fetch?: FetchLike
  /** Device credential sent as the bearer for authenticated calls. */
  readonly credential?: string
  readonly timeoutMs?: number
}

export interface VikanApiClient {
  createLinkRequest(input: LinkRequestCreateInput): Promise<LinkRequestCreated>
  claimLinkRequest(requestId: string, pairingSecret: string): Promise<LinkClaimed>
  listBindings(): Promise<AgentBindings>
  revokeBinding(bindingId: string): Promise<void>
  checkHealth(): Promise<Health>

  openRunnerSession(input: SessionOnlineInput): Promise<SessionOpened>
  heartbeatRunnerSession(sessionId: string, input: { s2Connected: boolean }): Promise<{ leaseExpiresAt: string }>
  offlineRunnerSession(sessionId: string): Promise<void>
  reconcileRunnerSession(sessionId: string, input: SessionReconcileInput): Promise<SessionReconciled>

  listRuns(query: { bindingId?: string }): Promise<AgentRuns>
  getRun(runId: string): Promise<AgentRun>
  getRunContext(runId: string): Promise<RunContext>
  claimRun(runId: string, sessionId: string): Promise<RunClaimed>
  submitRunStatus(runId: string, input: RunStatusReceiptInput): Promise<{ runId: string; runVersion: number; status: AgentRun['status'] }>
  submitProjectDocumentResult(runId: string, input: ProjectDocumentResultInput): Promise<ProjectDocumentResultAck>

  listRunCommands(runId: string): Promise<AgentCommands>
  claimCommand(commandId: string, sessionId: string): Promise<AgentCommand>
  ackCommand(commandId: string, input: CommandAckInput): Promise<{ commandId: string; accepted: true }>
  /** Create a continue/cancel command (the user's control intent; 09's unlink uses cancel). */
  createRunCommand(runId: string, input: z.infer<typeof commandCreateSchema>): Promise<AgentCommand>

  issueSubscriptions(input: SubscriptionRequestInput): Promise<AgentSubscriptions>

  deliverablesSummary(runId: string, claim: z.infer<typeof agentDeliverableClaimSchema>): Promise<z.infer<typeof issueDeliverablesSummarySchema>>
  publishStage(runId: string, input: z.infer<typeof agentPublishIssueStageBodySchema>): Promise<z.infer<typeof publishIssueStageResultSchema>>
  finishStage(runId: string, stageId: string, input: z.infer<typeof agentFinishIssueStageBodySchema>): Promise<z.infer<typeof finishIssueStageResultSchema>>
  uploadDeliverableFile(runId: string, metadata: AgentDeliverableFileMetadata, file: File): Promise<z.infer<typeof fileUploadResultSchema>>
  publishFindings(runId: string, input: z.infer<typeof agentFindingsPublishSchema>): Promise<z.infer<typeof agentFindingsPublishResultSchema>>
}

const DEFAULT_TIMEOUT_MS = 15_000

export function createVikanApiClient(options: VikanApiClientOptions): VikanApiClient {
  const fetchFn: FetchLike = options.fetch ?? ((url, init) => fetch(url, init))
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const headers: Record<string, string> =
    options.credential === undefined ? {} : { authorization: `Bearer ${options.credential}` }

  // Bound every call: a hung socket must not wedge the pairing loop.
  const doFetch: FetchLike = async (url, init = {}) => {
    const signal = init.signal ?? AbortSignal.timeout(timeoutMs)
    try {
      return await fetchFn(url, { ...init, signal })
    } catch (error) {
      throw new ApiCallError(apiFailure(error))
    }
  }

  const request = async (operation: keyof typeof agentOperations, input: AgentRequestInput): Promise<Response> => {
    const definition = agentOperations[operation]
    const path = definition.path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
      const value = input.params?.[key]
      if (!value || value === '.' || value === '..') throw new TypeError(`Invalid path parameter: ${key}`)
      return encodeURIComponent(value)
    })
    const url = new URL(`${options.apiOrigin.replace(/\/+$/, '')}/api${path}`)
    for (const [key, value] of Object.entries(input.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
    const multipart = input.body instanceof FormData
    const body = input.body === undefined ? undefined : multipart ? input.body as FormData : JSON.stringify(input.body)
    return doFetch(url.href, {
      method: definition.method, redirect: 'error',
      headers: { ...headers, accept: 'application/json', ...(body !== undefined && !multipart ? { 'content-type': 'application/json' } : {}) },
      ...(body === undefined ? {} : { body }),
    })
  }

  const call = async <T>(operation: keyof typeof agentOperations, input: AgentRequestInput, schema: {
    safeParse(value: unknown): { success: true; data: T } | { success: false; error: unknown }
  }): Promise<T> => {
    const response = await request(operation, input)
    let raw: unknown
    try { raw = await response.json() } catch (error) {
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        throw new ApiCallError({ kind: 'timeout' })
      }
      throw new ApiCallError({ kind: 'invalid-output' })
    }
    if (!response.ok) {
      const parsed = problemSchema.safeParse(raw)
      if (!parsed.success || parsed.data.status !== response.status) throw new ApiCallError({ kind: 'invalid-output' })
      throw new ApiCallError({ kind: 'problem', code: problemCode(parsed.data.type)!, status: response.status, title: parsed.data.title })
    }
    try { return parseApiOutput(schema, raw) }
    catch { throw new ApiCallError({ kind: 'invalid-output' }) }
  }

  return {
    createLinkRequest: (input) => call('createLinkRequest', { body: input }, linkRequestCreatedSchema),
    claimLinkRequest: (requestId, pairingSecret) =>
      call('claimLinkRequest', { params: { requestId }, body: { pairingSecret } }, linkClaimedSchema),
    listBindings: () => call('listBindings', {}, agentBindingsSchema),
    revokeBinding: async (bindingId) => {
      await call('revokeBinding', { params: { bindingId }, body: {} }, agentBindingRevokedSchema)
    },
    checkHealth: async () => {
      let response: Response
      try {
        response = await request('checkHealth', {})
      } catch (error) {
        throw error instanceof ApiCallError ? error : new ApiCallError(apiFailure(error))
      }
      if (!response.ok) throw new ApiCallError({ kind: 'problem', code: 'http', status: response.status, title: `health check failed with HTTP ${response.status}` })
      let body: unknown
      try {
        body = await response.json()
      } catch {
        throw new ApiCallError({ kind: 'invalid-output' })
      }
      try {
        return parseApiOutput(healthSchema, body)
      } catch {
        throw new ApiCallError({ kind: 'invalid-output' })
      }
    },

    openRunnerSession: (input) => call('openRunnerSession', { body: input }, sessionOpenedSchema),
    heartbeatRunnerSession: (sessionId, input) =>
      call('heartbeatRunnerSession', { params: { sessionId }, body: input }, sessionHeartbeatAckSchema),
    offlineRunnerSession: async (sessionId) => {
      await call('offlineRunnerSession', { params: { sessionId }, body: {} }, sessionOfflineSchema)
    },
    reconcileRunnerSession: (sessionId, input) =>
      call('reconcileRunnerSession', { params: { sessionId }, body: input }, sessionReconciledSchema),

    listRuns: (query) => call('listRuns', { query }, agentRunsSchema),
    getRun: (runId) => call('getRun', { params: { runId } }, agentRunSchema),
    getRunContext: (runId) => call('getRunContext', { params: { runId } }, runContextSchema),
    claimRun: (runId, sessionId) =>
      call('claimRun', { params: { runId }, body: { sessionId } }, runClaimedSchema),
    submitRunStatus: (runId, input) =>
      call('submitRunStatus', { params: { runId }, body: input }, runStatusReceiptAckSchema),
    submitProjectDocumentResult: (runId, input) =>
      call('submitProjectDocumentResult', { params: { runId }, body: input }, projectDocumentResultAckSchema),

    listRunCommands: (runId) => call('listRunCommands', { params: { runId } }, agentCommandsSchema),
    createRunCommand: (runId, input) =>
      call('createRunCommand', { params: { runId }, body: input }, agentCommandSchema),
    claimCommand: (commandId, sessionId) =>
      call('claimCommand', { params: { commandId }, body: { sessionId } }, agentCommandSchema),
    ackCommand: (commandId, input) =>
      call('ackCommand', { params: { commandId }, body: input }, commandAckedSchema),

    issueSubscriptions: (input) => call('issueSubscriptions', { body: input }, agentSubscriptionsSchema),
    deliverablesSummary: (runId, claim) => call('deliverablesSummary', { params: { runId }, query: claim }, issueDeliverablesSummarySchema),
    publishStage: (runId, input) => call('publishStage', { params: { runId }, body: input }, publishIssueStageResultSchema),
    finishStage: (runId, stageId, input) => call('finishStage', { params: { runId, stageId }, body: input }, finishIssueStageResultSchema),
    uploadDeliverableFile: (runId, metadata, file) => call('uploadDeliverableFile', { params: { runId },
      body: createAgentDeliverableFileUpload(metadata, file) }, fileUploadResultSchema),
    publishFindings: (runId, input) => call('publishFindings', { params: { runId }, body: input }, agentFindingsPublishResultSchema),
  }
}
