export declare const agentOperations: {
    readonly checkHealth: {
        readonly method: "GET";
        readonly path: "/health";
    };
    readonly createLinkRequest: {
        readonly method: "POST";
        readonly path: "/agent/link-requests";
    };
    readonly claimLinkRequest: {
        readonly method: "POST";
        readonly path: "/agent/link-requests/:requestId/claim";
    };
    readonly listBindings: {
        readonly method: "GET";
        readonly path: "/agent/bindings";
    };
    readonly revokeBinding: {
        readonly method: "POST";
        readonly path: "/agent/bindings/:bindingId/revoke";
    };
    readonly openRunnerSession: {
        readonly method: "POST";
        readonly path: "/agent/sessions";
    };
    readonly heartbeatRunnerSession: {
        readonly method: "POST";
        readonly path: "/agent/sessions/:sessionId/heartbeat";
    };
    readonly offlineRunnerSession: {
        readonly method: "POST";
        readonly path: "/agent/sessions/:sessionId/offline";
    };
    readonly reconcileRunnerSession: {
        readonly method: "POST";
        readonly path: "/agent/sessions/:sessionId/reconcile";
    };
    readonly listRuns: {
        readonly method: "GET";
        readonly path: "/agent/runs";
    };
    readonly getRun: {
        readonly method: "GET";
        readonly path: "/agent/runs/:runId";
    };
    readonly getRunContext: {
        readonly method: "GET";
        readonly path: "/agent/runs/:runId/context";
    };
    readonly claimRun: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/claim";
    };
    readonly submitRunStatus: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/status";
    };
    readonly submitProjectDocumentResult: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/project-document";
    };
    readonly listRunCommands: {
        readonly method: "GET";
        readonly path: "/agent/runs/:runId/commands";
    };
    readonly createRunCommand: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/commands";
    };
    readonly claimCommand: {
        readonly method: "POST";
        readonly path: "/agent/commands/:commandId/claim";
    };
    readonly ackCommand: {
        readonly method: "POST";
        readonly path: "/agent/commands/:commandId/ack";
    };
    readonly issueSubscriptions: {
        readonly method: "POST";
        readonly path: "/agent/subscriptions";
    };
    readonly deliverablesSummary: {
        readonly method: "GET";
        readonly path: "/agent/runs/:runId/stages";
    };
    readonly publishStage: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/stages";
    };
    readonly finishStage: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/stages/:stageId/finish";
    };
    readonly uploadDeliverableFile: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/files";
    };
    readonly publishFindings: {
        readonly method: "POST";
        readonly path: "/agent/runs/:runId/findings";
    };
};
