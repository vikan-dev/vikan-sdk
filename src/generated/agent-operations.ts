// Generated from @vikan/contract. Do not edit.
export const agentOperations = {
  "checkHealth": {
    "method": "GET",
    "path": "/health"
  },
  "createLinkRequest": {
    "method": "POST",
    "path": "/agent/link-requests"
  },
  "claimLinkRequest": {
    "method": "POST",
    "path": "/agent/link-requests/:requestId/claim"
  },
  "listBindings": {
    "method": "GET",
    "path": "/agent/bindings"
  },
  "revokeBinding": {
    "method": "POST",
    "path": "/agent/bindings/:bindingId/revoke"
  },
  "openRunnerSession": {
    "method": "POST",
    "path": "/agent/sessions"
  },
  "heartbeatRunnerSession": {
    "method": "POST",
    "path": "/agent/sessions/:sessionId/heartbeat"
  },
  "offlineRunnerSession": {
    "method": "POST",
    "path": "/agent/sessions/:sessionId/offline"
  },
  "reconcileRunnerSession": {
    "method": "POST",
    "path": "/agent/sessions/:sessionId/reconcile"
  },
  "listRuns": {
    "method": "GET",
    "path": "/agent/runs"
  },
  "getRun": {
    "method": "GET",
    "path": "/agent/runs/:runId"
  },
  "getRunContext": {
    "method": "GET",
    "path": "/agent/runs/:runId/context"
  },
  "claimRun": {
    "method": "POST",
    "path": "/agent/runs/:runId/claim"
  },
  "submitRunStatus": {
    "method": "POST",
    "path": "/agent/runs/:runId/status"
  },
  "submitProjectDocumentResult": {
    "method": "POST",
    "path": "/agent/runs/:runId/project-document"
  },
  "listRunCommands": {
    "method": "GET",
    "path": "/agent/runs/:runId/commands"
  },
  "createRunCommand": {
    "method": "POST",
    "path": "/agent/runs/:runId/commands"
  },
  "claimCommand": {
    "method": "POST",
    "path": "/agent/commands/:commandId/claim"
  },
  "ackCommand": {
    "method": "POST",
    "path": "/agent/commands/:commandId/ack"
  },
  "issueSubscriptions": {
    "method": "POST",
    "path": "/agent/subscriptions"
  },
  "deliverablesSummary": {
    "method": "GET",
    "path": "/agent/runs/:runId/stages"
  },
  "publishStage": {
    "method": "POST",
    "path": "/agent/runs/:runId/stages"
  },
  "finishStage": {
    "method": "POST",
    "path": "/agent/runs/:runId/stages/:stageId/finish"
  },
  "uploadDeliverableFile": {
    "method": "POST",
    "path": "/agent/runs/:runId/files"
  },
  "publishFindings": {
    "method": "POST",
    "path": "/agent/runs/:runId/findings"
  }
} as const
