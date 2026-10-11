import { healthSchema } from './generated/agent-runtime.js';
import { agentBindingsSchema, linkClaimedSchema, linkRequestCreateSchema, linkRequestCreatedSchema } from './generated/agent-runtime.js';
import { agentFindingsPublishResultSchema, type agentFindingsPublishSchema } from './generated/agent-runtime.js';
import { type agentDeliverableClaimSchema, type agentPublishIssueStageBodySchema, type agentFinishIssueStageBodySchema, type AgentDeliverableFileMetadata } from './generated/agent-runtime.js';
import { issueDeliverablesSummarySchema, publishIssueStageResultSchema, finishIssueStageResultSchema } from './generated/agent-runtime.js';
import { fileUploadResultSchema } from './generated/agent-runtime.js';
import { agentCommandsSchema, agentRunsSchema, runStatusReceiptSchema, commandAckSchema, commandCreateSchema, agentSubscriptionsSchema, runClaimedSchema, runContextSchema, sessionOpenedSchema, sessionReconcileSchema, sessionReconciledSchema, subscriptionRequestSchema, projectDocumentResultSchema, projectDocumentResultAckSchema, type sessionOnlineSchema } from './generated/agent-runtime.js';
import type { z } from 'zod';
export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;
/** Device credential client. Routes and validation schemas are generated from
 * the server contract; no API-key or browser-cookie authentication is used.
 * Writes are never retried automatically: callers own operation recovery.
 */
export type LinkRequestCreateInput = z.infer<typeof linkRequestCreateSchema>;
export type LinkRequestCreated = z.infer<typeof linkRequestCreatedSchema>;
export type LinkClaimed = z.infer<typeof linkClaimedSchema>;
export type AgentBindings = z.infer<typeof agentBindingsSchema>;
export type Health = z.infer<typeof healthSchema>;
export type SessionOnlineInput = z.infer<typeof sessionOnlineSchema>;
export type SessionOpened = z.infer<typeof sessionOpenedSchema>;
export type SessionReconcileInput = z.infer<typeof sessionReconcileSchema>;
export type SessionReconciled = z.infer<typeof sessionReconciledSchema>;
export type AgentRuns = z.infer<typeof agentRunsSchema>;
export type AgentRun = AgentRuns['runs'][number];
export type RunClaimed = z.infer<typeof runClaimedSchema>;
export type RunContext = z.infer<typeof runContextSchema>;
export type RunStatusReceiptInput = z.infer<typeof runStatusReceiptSchema>;
export type ProjectDocumentResultInput = z.infer<typeof projectDocumentResultSchema>;
export type ProjectDocumentResultAck = z.infer<typeof projectDocumentResultAckSchema>;
export type AgentCommands = z.infer<typeof agentCommandsSchema>;
export type AgentCommand = AgentCommands['commands'][number];
export type CommandAckInput = z.infer<typeof commandAckSchema>;
export type SubscriptionRequestInput = z.infer<typeof subscriptionRequestSchema>;
export type AgentSubscriptions = z.infer<typeof agentSubscriptionsSchema>;
export type ActiveSubscription = Extract<AgentSubscriptions['subscriptions'][number], {
    status: 'active';
}>;
export type ApiFailure = {
    kind: 'network';
} | {
    kind: 'timeout';
} | {
    kind: 'problem';
    code: string;
    status: number;
    title: string;
} | {
    kind: 'invalid-output';
};
/** One classified API failure. `network`/`timeout` mean "unknown outcome" — never a verdict. */
export declare class ApiCallError extends Error {
    readonly failure: ApiFailure;
    constructor(failure: ApiFailure);
}
export declare function apiFailureMessage(failure: ApiFailure): string;
/** The classified failure of any thrown error; unknown shapes become network. */
export declare function apiFailure(error: unknown): ApiFailure;
export interface VikanApiClientOptions {
    readonly apiOrigin: string;
    readonly fetch?: FetchLike;
    /** Device credential sent as the bearer for authenticated calls. */
    readonly credential?: string;
    readonly timeoutMs?: number;
}
export interface VikanApiClient {
    createLinkRequest(input: LinkRequestCreateInput): Promise<LinkRequestCreated>;
    claimLinkRequest(requestId: string, pairingSecret: string): Promise<LinkClaimed>;
    listBindings(): Promise<AgentBindings>;
    revokeBinding(bindingId: string): Promise<void>;
    checkHealth(): Promise<Health>;
    openRunnerSession(input: SessionOnlineInput): Promise<SessionOpened>;
    heartbeatRunnerSession(sessionId: string, input: {
        s2Connected: boolean;
    }): Promise<{
        leaseExpiresAt: string;
    }>;
    offlineRunnerSession(sessionId: string): Promise<void>;
    reconcileRunnerSession(sessionId: string, input: SessionReconcileInput): Promise<SessionReconciled>;
    listRuns(query: {
        bindingId?: string;
    }): Promise<AgentRuns>;
    getRun(runId: string): Promise<AgentRun>;
    getRunContext(runId: string): Promise<RunContext>;
    claimRun(runId: string, sessionId: string): Promise<RunClaimed>;
    submitRunStatus(runId: string, input: RunStatusReceiptInput): Promise<{
        runId: string;
        runVersion: number;
        status: AgentRun['status'];
    }>;
    submitProjectDocumentResult(runId: string, input: ProjectDocumentResultInput): Promise<ProjectDocumentResultAck>;
    listRunCommands(runId: string): Promise<AgentCommands>;
    claimCommand(commandId: string, sessionId: string): Promise<AgentCommand>;
    ackCommand(commandId: string, input: CommandAckInput): Promise<{
        commandId: string;
        accepted: true;
    }>;
    /** Create a continue/cancel command (the user's control intent; 09's unlink uses cancel). */
    createRunCommand(runId: string, input: z.infer<typeof commandCreateSchema>): Promise<AgentCommand>;
    issueSubscriptions(input: SubscriptionRequestInput): Promise<AgentSubscriptions>;
    deliverablesSummary(runId: string, claim: z.infer<typeof agentDeliverableClaimSchema>): Promise<z.infer<typeof issueDeliverablesSummarySchema>>;
    publishStage(runId: string, input: z.infer<typeof agentPublishIssueStageBodySchema>): Promise<z.infer<typeof publishIssueStageResultSchema>>;
    finishStage(runId: string, stageId: string, input: z.infer<typeof agentFinishIssueStageBodySchema>): Promise<z.infer<typeof finishIssueStageResultSchema>>;
    uploadDeliverableFile(runId: string, metadata: AgentDeliverableFileMetadata, file: File): Promise<z.infer<typeof fileUploadResultSchema>>;
    publishFindings(runId: string, input: z.infer<typeof agentFindingsPublishSchema>): Promise<z.infer<typeof agentFindingsPublishResultSchema>>;
}
export declare function createVikanApiClient(options: VikanApiClientOptions): VikanApiClient;
