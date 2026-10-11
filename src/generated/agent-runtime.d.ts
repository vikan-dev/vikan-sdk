// Generated from @vikan/contract. Do not edit.
import { z } from 'zod';

declare const API_ERROR_STATUS: {
	readonly github_unconfigured: 503;
	readonly github_installation_conflict: 409;
	readonly github_state_invalid: 400;
	/** Envelope/params/body/output failed the shared schema (framework 422). */
	readonly validation_failed: 422;
	/** The handler's successful output did not satisfy `.output()` (framework 500). */
	readonly output_validation_failed: 500;
	/** The transport body was not valid JSON. */
	readonly invalid_json: 400;
	/** Content-Length was not a decimal byte count. */
	readonly invalid_content_length: 400;
	/** The request body stream errored while the write policy buffered it. */
	readonly body_read_failed: 400;
	/** No session cookie and no stub identity header. */
	readonly unauthenticated: 401;
	/** Authenticated but not permitted to see/change this resource. */
	readonly forbidden: 403;
	readonly insufficient_scope: 403;
	readonly workspace_archived: 409;
	readonly last_workspace_admin: 409;
	readonly document_changed: 409;
	/** Stage publication or finish lost its expected latest version. */
	readonly issue_stage_changed: 409;
	/** A source run, stage, check or evidence reference does not belong here. */
	readonly deliverable_reference_mismatch: 409;
	/** Same authenticated identity/operationId, different canonical request. */
	readonly deliverable_operation_conflict: 409;
	/** Commit acknowledgement was lost; retry identical input/operationId. */
	readonly deliverable_result_unconfirmed: 503;
	readonly mcp_rejected: 409;
	readonly mcp_result_unconfirmed: 503;
	/** Agent runtime (03): a CLI/binding names a mutex-held execution slot. */
	readonly run_slot_conflict: 409;
	/** Agent runtime (03): optimistic version/epoch mismatch (run/claim). */
	readonly stale_version: 409;
	/** Agent runtime (03): a link request names nothing (never oracle codes). */
	readonly link_not_found: 404;
	/** Agent runtime (03): the link request is expired, rejected or claimed. */
	readonly link_gone: 410;
	/** Agent runtime (04): the link request exists but has no decision yet — keep polling. */
	readonly link_pending: 425;
	/** Agent runtime (04): the caller exceeded an endpoint's frequency limit. */
	readonly rate_limited: 429;
	/** Agent runtime (03): a command's deadline passed; it is not delivered. */
	readonly command_expired: 410;
	/** Agent runtime (03): client/server agent wire protocol mismatch. */
	readonly protocol_version_unsupported: 400;
	/** Agent runtime (03): S2 delivery is not configured on this deployment. */
	readonly agent_unconfigured: 503;
	readonly events_unconfigured: 503;
	/** Cloud machine features are not configured on this deployment. */
	readonly machine_unconfigured: 503;
	/** A deleted machine cannot accept further execution requests. */
	readonly machine_deleted: 410;
	/** The machine or project already has an operation holding its slot. */
	readonly machine_busy: 409;
	/** Resume or reconciliation must finish before this action may run. */
	readonly machine_not_ready: 409;
	/** A logical operation was retried with different canonical input. */
	readonly machine_operation_conflict: 409;
	/** Machine runtime allowance was exhausted. */
	readonly quota_exhausted: 402;
	/** The billing account requires funding before starting a machine. */
	readonly payment_required: 402;
	/** Boat could not complete the request; safe retries reuse operationId. */
	readonly provider_unavailable: 503;
	/** The referenced Boat resource is no longer present. */
	readonly provider_not_found: 404;
	/** A required machine credential has been revoked. */
	readonly credential_revoked: 409;
	/** A supplied credential failed verification against its provider. */
	readonly credential_invalid: 422;
	/** Retention removed events preceding the requested cursor. */
	readonly cursor_gap: 409;
	/** Agent runtime (07): a queued run's preconditions died at claim time (reassigned/moved/deleted/cancelled); it will not start. */
	readonly run_invalidated: 409;
	/** Request origin/referer is not a trusted write source. */
	readonly origin_forbidden: 403;
	/** A well-formed identifier names no live row. */
	readonly not_found: 404;
	/** The invite token names nothing (never oracle which token exists). */
	readonly invite_not_found: 404;
	/** The invite exists but is revoked, used, expired, or its scope is gone. */
	readonly invite_gone: 410;
	/** Transport body exceeds the endpoint's byte limit. */
	readonly body_too_large: 413;
	/** Multipart must contain exactly metadata JSON and one valid File. */
	readonly invalid_file_upload: 400;
	readonly file_too_large: 413;
	/** The file's bytes have not been confirmed ready. */
	readonly file_not_ready: 409;
	/** A file cannot be reused across owners or workspaces. */
	readonly file_owner_mismatch: 409;
	/** The operationId was already used with different upload inputs. */
	readonly file_upload_conflict: 409;
	/** Another attempt still holds this upload's lease; retry later. */
	readonly file_upload_in_progress: 409;
	/** Only server-verified supported raster images may be served inline. */
	readonly file_inline_unsupported: 415;
	/** Object storage is unconfigured or temporarily unavailable. */
	readonly storage_unavailable: 503;
	/** Content-Type is not the endpoint's accepted media type. */
	readonly unsupported_media_type: 415;
	/** Content-Encoding is not supported (e.g. compressed write bodies). */
	readonly unsupported_content_encoding: 415;
	/** The complete snapshot exceeds the supported size. */
	readonly snapshot_too_large: 503;
	/** The database is unreachable for a read that cannot answer without it. */
	readonly database_unavailable: 503;
	/** Anything unexpected. Never includes SQL, params, tokens or stack. */
	readonly internal: 500;
	/** The caller went away mid-response; preserved from the existing 499 path. */
	readonly request_cancelled: 499;
};
type ApiErrorCode = keyof typeof API_ERROR_STATUS;
/** The catalog code encoded in a Problem `type` URI, or null when unlisted. */
export declare function problemCode(type: string): ApiErrorCode | null;
/**
 * A wire-valid Problem. Beyond the field shapes it enforces that `type` names
 * a catalog code and `status` is that code's status: a bare 404 alone must
 * never be read as a business answer.
 */
export declare const problemSchema: z.ZodObject<{
	type: z.ZodString;
	status: z.ZodNumber;
	title: z.ZodString;
	detail: z.ZodOptional<z.ZodUnknown>;
	instance: z.ZodString;
	errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
		path: z.ZodString;
		message: z.ZodString;
	}, z.core.$strict>>>;
}, z.core.$strict>;
interface OutputSchema<T> {
	safeParse(value: unknown): {
		success: true;
		data: T;
	} | {
		success: false;
		error: unknown;
	};
}
/** Runtime proof for the compile-time-only result of Zebra's createClient. */
export declare function parseApiOutput<T>(schema: OutputSchema<T>, value: unknown): T;
/** 独立导出，客户端健康检查无需引入管理、同步或 workspace DTO。 */
export declare const healthSchema: z.ZodObject<{
	status: z.ZodLiteral<"ok">;
	database: z.ZodLiteral<"up">;
}, z.core.$strict>;
export declare const uuidSchema: z.ZodUUID;
export declare const linkRequestCreateSchema: z.ZodObject<{
	pairingSecretHash: z.ZodString;
	deviceCredentialHash: z.ZodString;
	deviceName: z.ZodString;
	cliVersion: z.ZodString;
	protocolVersion: z.ZodNumber;
	directoryKey: z.ZodString;
	directoryLabel: z.ZodString;
}, z.core.$strict>;
export declare const linkRequestCreatedSchema: z.ZodObject<{
	requestId: z.ZodUUID;
	userCode: z.ZodString;
	verificationUrl: z.ZodURL;
	expiresAt: z.ZodString;
	pollIntervalSeconds: z.ZodNumber;
}, z.core.$strict>;
export declare const linkClaimedSchema: z.ZodObject<{
	requestId: z.ZodUUID;
	bindingId: z.ZodUUID;
	deviceId: z.ZodUUID;
	userId: z.ZodUUID;
	workspaceId: z.ZodUUID;
	projectId: z.ZodUUID;
	directoryKey: z.ZodString;
	claimedAt: z.ZodString;
	agentPageUrl: z.ZodURL;
}, z.core.$strict>;
export declare const agentBindingsSchema: z.ZodObject<{
	bindings: z.ZodArray<z.ZodObject<{
		bindingId: z.ZodUUID;
		deviceId: z.ZodUUID;
		userId: z.ZodUUID;
		workspaceId: z.ZodUUID;
		projectId: z.ZodUUID;
		directoryKey: z.ZodString;
		directoryLabel: z.ZodString;
		status: z.ZodEnum<{
			active: "active";
			revoked: "revoked";
		}>;
		connectionState: z.ZodEnum<{
			online: "online";
			degraded: "degraded";
			offline: "offline";
		}>;
		createdAt: z.ZodString;
		revokedAt: z.ZodNullable<z.ZodString>;
	}, z.core.$strict>>;
}, z.core.$strict>;
export declare const agentBindingRevokedSchema: z.ZodObject<{
	revoked: z.ZodLiteral<true>;
}, z.core.$strict>;
/**
 * S2 wire schemas for the vikan agent runtime (plan §9, evidence/01 D1–D6).
 *
 * These records travel through the S2 stream store, not the HTTP contract:
 * every record is one S2 append whose JSON body must validate exactly here.
 * CLI and web both parse records with these schemas before acting; an unknown
 * `protocolVersion` is an explicit rejection — pause the consumer and show the
 * upgrade reason, never execute a message this build does not understand.
 */
/** Wire protocol of the S2 records. Bump when a record shape changes. */
export declare const AGENT_PROTOCOL_VERSION = 1;
/**
 * Run lifecycle states (plan §10.2, evidence/01 D3). Terminal set:
 * succeeded/cancelled/failed. `needs_reconciliation` is the explicit
 * "cannot know what actually happened" state — never resolved by guessing.
 */
export declare const agentRunStatusSchema: z.ZodEnum<{
	queued: "queued";
	starting: "starting";
	running: "running";
	awaiting_review: "awaiting_review";
	blocked: "blocked";
	stopping: "stopping";
	needs_reconciliation: "needs_reconciliation";
	succeeded: "succeeded";
	cancelled: "cancelled";
	failed: "failed";
}>;
export type AgentRunStatus = z.infer<typeof agentRunStatusSchema>;
export declare const AGENT_RUN_TERMINAL_STATUSES: readonly [
	"succeeded",
	"cancelled",
	"failed"
];
/** Non-terminal statuses — the same-issue mutex set (queued included). */
export declare const AGENT_RUN_NON_TERMINAL_STATUSES: readonly [
	"queued",
	"starting",
	"running",
	"awaiting_review",
	"blocked",
	"stopping",
	"needs_reconciliation"
];
export declare function agentBindingCommandsStream(bindingId: string): string;
export declare function agentRunScreensStream(runId: string, captureEpoch: string): string;
/**
 * Binding command stream: a saved execution intent. Identity is commandId —
 * redeliveries repeat it verbatim and consumers dedupe on it. `expiresAt`
 * null means the intent persists until fulfilled (cancel is a durable
 * expectation, plan §9.2); `expectedRunVersion` pins the target round so a
 * late instruction cannot land on a different one.
 */
export declare const agentCommandSchema: z.ZodObject<{
	protocolVersion: z.ZodNumber;
	type: z.ZodLiteral<"run.command">;
	commandId: z.ZodUUID;
	operationId: z.ZodUUID;
	workspaceId: z.ZodUUID;
	projectId: z.ZodUUID;
	bindingId: z.ZodUUID;
	runId: z.ZodUUID;
	commandSeq: z.ZodNumber;
	kind: z.ZodEnum<{
		continue: "continue";
		start: "start";
		cancel: "cancel";
	}>;
	status: z.ZodEnum<{
		pending: "pending";
		dispatched: "dispatched";
		claimed: "claimed";
		acked: "acked";
		expired: "expired";
		rejected: "rejected";
	}>;
	prompt: z.ZodNullable<z.ZodString>;
	expectedRunVersion: z.ZodNullable<z.ZodNumber>;
	issuedBy: z.ZodUUID;
	issuedAt: z.ZodString;
	expiresAt: z.ZodNullable<z.ZodString>;
	claim: z.ZodNullable<z.ZodObject<{
		sessionId: z.ZodUUID;
		claimEpoch: z.ZodNumber;
	}, z.core.$strict>>;
}, z.core.$strict>;
/**
 * Full ANSI screen frame (evidence/01 D1 — the structure is frozen by the
 * probe). One frame is ONE S2 record; `content` is the `pane read
 * --source visible --format ansi` text verbatim (CRLF line endings + SGR,
 * no cursor positioning). rows/cols are the PTY content area from
 * `pane get` scroll.viewport_rows / tty stty size — never the layout rect,
 * which includes skin chrome. `frameId` is the append-retry dedup key
 * (globally unique and stable across retries); `revision` only gates
 * change detection, never dedup.
 */
export declare const SCREEN_FRAME_MAX_BYTES: number;
export declare const screenFrameSchema: z.ZodObject<{
	protocolVersion: z.ZodNumber;
	type: z.ZodLiteral<"screen.frame">;
	runId: z.ZodUUID;
	captureEpoch: z.ZodString;
	frameId: z.ZodString;
	paneId: z.ZodString;
	revision: z.ZodNumber;
	rows: z.ZodNumber;
	cols: z.ZodNumber;
	capturedAt: z.ZodString;
	format: z.ZodLiteral<"ansi">;
	truncated: z.ZodBoolean;
	content: z.ZodString;
}, z.core.$strict>;
export type ScreenFrame = z.infer<typeof screenFrameSchema>;
/** True when a raw record carries an integer protocolVersion this build rejects. */
export declare function isUnsupportedAgentProtocolVersion(value: unknown): boolean;
/** The manifest the agent's CLI submits: one UUID per logical batch. */
export declare const agentFindingsManifestSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	findings: z.ZodArray<z.ZodObject<{
		title: z.ZodString;
		body: z.ZodString;
	}, z.core.$strict>>;
}, z.core.$strict>;
/** Device write: session/claim authority, exactly like a stage submission. */
export declare const agentFindingsPublishSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	findings: z.ZodArray<z.ZodObject<{
		title: z.ZodString;
		body: z.ZodString;
	}, z.core.$strict>>;
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
}, z.core.$strict>;
export declare const agentFindingsPublishResultSchema: z.ZodObject<{
	runId: z.ZodUUID;
	workspaceId: z.ZodUUID;
	operationId: z.ZodUUID;
	outcome: z.ZodLiteral<"committed">;
	committedAt: z.ZodString;
	replayed: z.ZodBoolean;
	count: z.ZodNumber;
}, z.core.$strict>;
declare const DOCUMENT_NODES: readonly [
	"doc",
	"paragraph",
	"text",
	"heading",
	"blockquote",
	"bulletList",
	"orderedList",
	"listItem",
	"taskList",
	"taskItem",
	"codeBlock",
	"hardBreak",
	"horizontalRule",
	"issueReference",
	"file"
];
declare const markSchema: z.ZodUnion<readonly [
	z.ZodObject<{
		type: z.ZodEnum<{
			code: "code";
			bold: "bold";
			italic: "italic";
			strike: "strike";
			underline: "underline";
		}>;
		attrs: z.ZodOptional<z.ZodObject<{}, z.core.$strict>>;
	}, z.core.$strict>,
	z.ZodObject<{
		type: z.ZodLiteral<"link">;
		attrs: z.ZodObject<{
			href: z.ZodString;
			target: z.ZodOptional<z.ZodNullable<z.ZodString>>;
			rel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
			class: z.ZodOptional<z.ZodNullable<z.ZodString>>;
			title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
		}, z.core.$strict>;
	}, z.core.$strict>
]>;
type DocumentMark = z.infer<typeof markSchema>;
type DocumentNode = {
	type: (typeof DOCUMENT_NODES)[number];
	text?: string;
	attrs?: {
		[key: string]: string | number | boolean | null;
	};
	marks?: DocumentMark[];
	content?: DocumentNode[];
};
type DocumentContent = DocumentNode & {
	type: "doc";
	content: DocumentNode[];
};
/** Device credential remains in Authorization; owner/author/source derive from the authorized run. */
export declare const agentDeliverableClaimSchema: z.ZodObject<{
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
}, z.core.$strict>;
export declare const agentPublishIssueStageBodySchema: z.ZodObject<{
	operationId: z.ZodUUID;
	stage: z.ZodString;
	expectedLatestStageId: z.ZodNullable<z.ZodUUID>;
	basedOnStageId: z.ZodDefault<z.ZodNullable<z.ZodUUID>>;
	title: z.ZodString;
	summary: z.ZodString;
	document: z.ZodDiscriminatedUnion<[
		z.ZodObject<{
			format: z.ZodLiteral<"json">;
			content: z.ZodPipe<z.ZodUnknown, z.ZodTransform<DocumentContent, unknown>>;
		}, z.core.$strict>,
		z.ZodObject<{
			format: z.ZodLiteral<"text">;
			text: z.ZodString;
		}, z.core.$strict>
	], "format">;
	status: z.ZodDefault<z.ZodEnum<{
		running: "running";
		completed: "completed";
	}>>;
	checks: z.ZodDefault<z.ZodArray<z.ZodObject<{
		id: z.ZodString;
		title: z.ZodString;
		status: z.ZodEnum<{
			running: "running";
			failed: "failed";
			pending: "pending";
			passed: "passed";
			skipped: "skipped";
		}>;
		command: z.ZodNullable<z.ZodString>;
		detail: z.ZodNullable<z.ZodString>;
	}, z.core.$strict>>>;
	files: z.ZodDefault<z.ZodArray<z.ZodObject<{
		fileId: z.ZodUUID;
		posterFileId: z.ZodNullable<z.ZodUUID>;
		caption: z.ZodString;
		checkIds: z.ZodArray<z.ZodString>;
	}, z.core.$strict>>>;
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
}, z.core.$strict>;
export declare const agentFinishIssueStageBodySchema: z.ZodObject<{
	operationId: z.ZodUUID;
	expectedVersion: z.ZodNumber;
	status: z.ZodEnum<{
		failed: "failed";
		completed: "completed";
	}>;
	summary: z.ZodString;
	document: z.ZodDiscriminatedUnion<[
		z.ZodObject<{
			format: z.ZodLiteral<"json">;
			content: z.ZodPipe<z.ZodUnknown, z.ZodTransform<DocumentContent, unknown>>;
		}, z.core.$strict>,
		z.ZodObject<{
			format: z.ZodLiteral<"text">;
			text: z.ZodString;
		}, z.core.$strict>
	], "format">;
	checks: z.ZodArray<z.ZodObject<{
		id: z.ZodString;
		title: z.ZodString;
		status: z.ZodEnum<{
			running: "running";
			failed: "failed";
			pending: "pending";
			passed: "passed";
			skipped: "skipped";
		}>;
		command: z.ZodNullable<z.ZodString>;
		detail: z.ZodNullable<z.ZodString>;
	}, z.core.$strict>>;
	files: z.ZodArray<z.ZodObject<{
		fileId: z.ZodUUID;
		posterFileId: z.ZodNullable<z.ZodUUID>;
		caption: z.ZodString;
		checkIds: z.ZodArray<z.ZodString>;
	}, z.core.$strict>>;
	failureReason: z.ZodNullable<z.ZodString>;
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
}, z.core.$strict>;
declare const agentDeliverableFileMetadataSchema: z.ZodObject<{
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
	operationId: z.ZodUUID;
}, z.core.$strict>;
export type AgentDeliverableFileMetadata = z.infer<typeof agentDeliverableFileMetadataSchema>;
export declare function createAgentDeliverableFileUpload(metadata: AgentDeliverableFileMetadata, file: File): FormData;
export declare const DELIVERABLE_BODY_MAX_BYTES: number;
export declare const DELIVERABLE_TEXT_MAX_LENGTH = 100000;
export declare const deliverableDocumentInputSchema: z.ZodDiscriminatedUnion<[
	z.ZodObject<{
		format: z.ZodLiteral<"json">;
		content: z.ZodPipe<z.ZodUnknown, z.ZodTransform<DocumentContent, unknown>>;
	}, z.core.$strict>,
	z.ZodObject<{
		format: z.ZodLiteral<"text">;
		text: z.ZodString;
	}, z.core.$strict>
], "format">;
/** Publish a finished artifact, or start one to finish later. CAS is per issue + stage. */
export declare const publishIssueStageSubmissionSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	stage: z.ZodString;
	expectedLatestStageId: z.ZodNullable<z.ZodUUID>;
	basedOnStageId: z.ZodDefault<z.ZodNullable<z.ZodUUID>>;
	title: z.ZodString;
	summary: z.ZodString;
	document: z.ZodDiscriminatedUnion<[
		z.ZodObject<{
			format: z.ZodLiteral<"json">;
			content: z.ZodPipe<z.ZodUnknown, z.ZodTransform<DocumentContent, unknown>>;
		}, z.core.$strict>,
		z.ZodObject<{
			format: z.ZodLiteral<"text">;
			text: z.ZodString;
		}, z.core.$strict>
	], "format">;
	status: z.ZodDefault<z.ZodEnum<{
		running: "running";
		completed: "completed";
	}>>;
	checks: z.ZodDefault<z.ZodArray<z.ZodObject<{
		id: z.ZodString;
		title: z.ZodString;
		status: z.ZodEnum<{
			running: "running";
			failed: "failed";
			pending: "pending";
			passed: "passed";
			skipped: "skipped";
		}>;
		command: z.ZodNullable<z.ZodString>;
		detail: z.ZodNullable<z.ZodString>;
	}, z.core.$strict>>>;
	files: z.ZodDefault<z.ZodArray<z.ZodObject<{
		fileId: z.ZodUUID;
		posterFileId: z.ZodNullable<z.ZodUUID>;
		caption: z.ZodString;
		checkIds: z.ZodArray<z.ZodString>;
	}, z.core.$strict>>>;
}, z.core.$strict>;
/** Finished versions are immutable. Reruns publish a new revision. */
export declare const finishIssueStageSubmissionSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	expectedVersion: z.ZodNumber;
	status: z.ZodEnum<{
		failed: "failed";
		completed: "completed";
	}>;
	summary: z.ZodString;
	document: z.ZodDiscriminatedUnion<[
		z.ZodObject<{
			format: z.ZodLiteral<"json">;
			content: z.ZodPipe<z.ZodUnknown, z.ZodTransform<DocumentContent, unknown>>;
		}, z.core.$strict>,
		z.ZodObject<{
			format: z.ZodLiteral<"text">;
			text: z.ZodString;
		}, z.core.$strict>
	], "format">;
	checks: z.ZodArray<z.ZodObject<{
		id: z.ZodString;
		title: z.ZodString;
		status: z.ZodEnum<{
			running: "running";
			failed: "failed";
			pending: "pending";
			passed: "passed";
			skipped: "skipped";
		}>;
		command: z.ZodNullable<z.ZodString>;
		detail: z.ZodNullable<z.ZodString>;
	}, z.core.$strict>>;
	files: z.ZodArray<z.ZodObject<{
		fileId: z.ZodUUID;
		posterFileId: z.ZodNullable<z.ZodUUID>;
		caption: z.ZodString;
		checkIds: z.ZodArray<z.ZodString>;
	}, z.core.$strict>>;
	failureReason: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const publishIssueStageResultSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	outcome: z.ZodLiteral<"committed">;
	committedAt: z.ZodString;
	replayed: z.ZodBoolean;
	result: z.ZodObject<{
		stageId: z.ZodUUID;
		stage: z.ZodString;
		revision: z.ZodNumber;
		workspaceId: z.ZodUUID;
		issueId: z.ZodUUID;
		status: z.ZodEnum<{
			running: "running";
			completed: "completed";
		}>;
		version: z.ZodLiteral<1>;
	}, z.core.$strict>;
}, z.core.$strict>;
export declare const finishIssueStageResultSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	outcome: z.ZodLiteral<"committed">;
	committedAt: z.ZodString;
	replayed: z.ZodBoolean;
	result: z.ZodObject<{
		stageId: z.ZodUUID;
		stage: z.ZodString;
		revision: z.ZodNumber;
		workspaceId: z.ZodUUID;
		issueId: z.ZodUUID;
		status: z.ZodEnum<{
			failed: "failed";
			completed: "completed";
		}>;
		version: z.ZodLiteral<2>;
	}, z.core.$strict>;
}, z.core.$strict>;
export declare const issueDeliverablesSummarySchema: z.ZodObject<{
	latestRun: z.ZodNullable<z.ZodObject<{
		runId: z.ZodUUID;
		workspaceId: z.ZodUUID;
		projectId: z.ZodUUID;
		issueId: z.ZodUUID;
		status: z.ZodEnum<{
			queued: "queued";
			starting: "starting";
			running: "running";
			awaiting_review: "awaiting_review";
			blocked: "blocked";
			stopping: "stopping";
			needs_reconciliation: "needs_reconciliation";
			succeeded: "succeeded";
			cancelled: "cancelled";
			failed: "failed";
		}>;
		createdAt: z.ZodString;
		startedAt: z.ZodNullable<z.ZodString>;
		endedAt: z.ZodNullable<z.ZodString>;
	}, z.core.$strict>>;
	stages: z.ZodArray<z.ZodObject<{
		stage: z.ZodString;
		latest: z.ZodObject<{
			stage: z.ZodString;
			revision: z.ZodNumber;
			basedOn: z.ZodNullable<z.ZodObject<{
				stageId: z.ZodUUID;
				stage: z.ZodString;
				revision: z.ZodNumber;
			}, z.core.$strict>>;
			source: z.ZodObject<{
				author: z.ZodObject<{
					userId: z.ZodUUID;
					name: z.ZodString;
				}, z.core.$strict>;
				run: z.ZodNullable<z.ZodObject<{
					runId: z.ZodUUID;
					workspaceId: z.ZodUUID;
					projectId: z.ZodUUID;
					issueId: z.ZodUUID;
					status: z.ZodEnum<{
						queued: "queued";
						starting: "starting";
						running: "running";
						awaiting_review: "awaiting_review";
						blocked: "blocked";
						stopping: "stopping";
						needs_reconciliation: "needs_reconciliation";
						succeeded: "succeeded";
						cancelled: "cancelled";
						failed: "failed";
					}>;
					createdAt: z.ZodString;
					startedAt: z.ZodNullable<z.ZodString>;
					endedAt: z.ZodNullable<z.ZodString>;
				}, z.core.$strict>>;
			}, z.core.$strict>;
			title: z.ZodString;
			summary: z.ZodString;
			status: z.ZodEnum<{
				running: "running";
				failed: "failed";
				completed: "completed";
			}>;
			version: z.ZodNumber;
			failureReason: z.ZodNullable<z.ZodString>;
			checkSummary: z.ZodObject<{
				total: z.ZodNumber;
				pending: z.ZodNumber;
				running: z.ZodNumber;
				passed: z.ZodNumber;
				failed: z.ZodNumber;
				skipped: z.ZodNumber;
				outcome: z.ZodEnum<{
					failed: "failed";
					pending: "pending";
					passed: "passed";
					not_submitted: "not_submitted";
					incomplete: "incomplete";
				}>;
			}, z.core.$strict>;
			fileCounts: z.ZodObject<{
				total: z.ZodNumber;
				images: z.ZodNumber;
				videos: z.ZodNumber;
				attachments: z.ZodNumber;
			}, z.core.$strict>;
			previewFiles: z.ZodArray<z.ZodObject<{
				fileId: z.ZodUUID;
				posterFileId: z.ZodNullable<z.ZodUUID>;
				caption: z.ZodString;
				checkIds: z.ZodArray<z.ZodString>;
				position: z.ZodNumber;
				previewKind: z.ZodNullable<z.ZodEnum<{
					image: "image";
					video: "video";
				}>>;
			}, z.core.$strict>>;
			startedAt: z.ZodString;
			updatedAt: z.ZodString;
			completedAt: z.ZodNullable<z.ZodString>;
			workspaceId: z.ZodUUID;
			issueId: z.ZodUUID;
			stageId: z.ZodUUID;
		}, z.core.$strict>;
		currentRun: z.ZodNullable<z.ZodObject<{
			stage: z.ZodString;
			revision: z.ZodNumber;
			basedOn: z.ZodNullable<z.ZodObject<{
				stageId: z.ZodUUID;
				stage: z.ZodString;
				revision: z.ZodNumber;
			}, z.core.$strict>>;
			source: z.ZodObject<{
				author: z.ZodObject<{
					userId: z.ZodUUID;
					name: z.ZodString;
				}, z.core.$strict>;
				run: z.ZodNullable<z.ZodObject<{
					runId: z.ZodUUID;
					workspaceId: z.ZodUUID;
					projectId: z.ZodUUID;
					issueId: z.ZodUUID;
					status: z.ZodEnum<{
						queued: "queued";
						starting: "starting";
						running: "running";
						awaiting_review: "awaiting_review";
						blocked: "blocked";
						stopping: "stopping";
						needs_reconciliation: "needs_reconciliation";
						succeeded: "succeeded";
						cancelled: "cancelled";
						failed: "failed";
					}>;
					createdAt: z.ZodString;
					startedAt: z.ZodNullable<z.ZodString>;
					endedAt: z.ZodNullable<z.ZodString>;
				}, z.core.$strict>>;
			}, z.core.$strict>;
			title: z.ZodString;
			summary: z.ZodString;
			status: z.ZodEnum<{
				running: "running";
				failed: "failed";
				completed: "completed";
			}>;
			version: z.ZodNumber;
			failureReason: z.ZodNullable<z.ZodString>;
			checkSummary: z.ZodObject<{
				total: z.ZodNumber;
				pending: z.ZodNumber;
				running: z.ZodNumber;
				passed: z.ZodNumber;
				failed: z.ZodNumber;
				skipped: z.ZodNumber;
				outcome: z.ZodEnum<{
					failed: "failed";
					pending: "pending";
					passed: "passed";
					not_submitted: "not_submitted";
					incomplete: "incomplete";
				}>;
			}, z.core.$strict>;
			fileCounts: z.ZodObject<{
				total: z.ZodNumber;
				images: z.ZodNumber;
				videos: z.ZodNumber;
				attachments: z.ZodNumber;
			}, z.core.$strict>;
			previewFiles: z.ZodArray<z.ZodObject<{
				fileId: z.ZodUUID;
				posterFileId: z.ZodNullable<z.ZodUUID>;
				caption: z.ZodString;
				checkIds: z.ZodArray<z.ZodString>;
				position: z.ZodNumber;
				previewKind: z.ZodNullable<z.ZodEnum<{
					image: "image";
					video: "video";
				}>>;
			}, z.core.$strict>>;
			startedAt: z.ZodString;
			updatedAt: z.ZodString;
			completedAt: z.ZodNullable<z.ZodString>;
			workspaceId: z.ZodUUID;
			issueId: z.ZodUUID;
			stageId: z.ZodUUID;
		}, z.core.$strict>>;
	}, z.core.$strict>>;
	workspaceId: z.ZodUUID;
	issueId: z.ZodUUID;
	protocolVersion: z.ZodLiteral<1>;
	userId: z.ZodUUID;
}, z.core.$strict>;
type IssueDeliverablesSummary = z.infer<typeof issueDeliverablesSummarySchema>;
interface DeliverableReadContext {
	userId: string;
	workspaceId: string;
	issueId: string;
}
export declare function parseIssueDeliverablesSummary(raw: unknown, context: DeliverableReadContext): IssueDeliverablesSummary;
export declare const FILE_MAX_BYTES: number;
export declare const MCP_FILE_MAX_BYTES: number;
/** Reject path syntax rather than silently renaming an idempotent upload. */
export declare const fileNameSchema: z.ZodString;
export declare const fileByteSizeSchema: z.ZodNumber;
export declare const fileMimeTypeSchema: z.ZodString;
/** A declaration only. The file service must verify bytes before permitting inline media. */
export declare function normalizeFileMimeType(value: string): string;
export declare const fileUploadResultSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	replayed: z.ZodBoolean;
	file: z.ZodObject<{
		fileId: z.ZodUUID;
		workspaceId: z.ZodUUID;
		uploaderId: z.ZodUUID;
		owner: z.ZodNullable<z.ZodObject<{
			type: z.ZodEnum<{
				issue: "issue";
				project_document: "project_document";
			}>;
			externalId: z.ZodUUID;
		}, z.core.$strict>>;
		filename: z.ZodString;
		mimeType: z.ZodString;
		previewKind: z.ZodNullable<z.ZodEnum<{
			image: "image";
			video: "video";
		}>>;
		byteSize: z.ZodNumber;
		status: z.ZodLiteral<"ready">;
		createdAt: z.ZodString;
		updatedAt: z.ZodString;
		readyAt: z.ZodString;
	}, z.core.$strict>;
}, z.core.$strict>;
export declare const sessionOnlineSchema: z.ZodObject<{
	bindingId: z.ZodUUID;
	protocolVersion: z.ZodNumber;
	cliVersion: z.ZodString;
	herdr: z.ZodObject<{
		version: z.ZodString;
		protocolVersion: z.ZodNumber;
		sessionId: z.ZodString;
		workspaceId: z.ZodString;
		tabId: z.ZodString;
		paneId: z.ZodString;
	}, z.core.$strict>;
	agentKinds: z.ZodArray<z.ZodEnum<{
		codex: "codex";
	}>>;
}, z.core.$strict>;
export declare const sessionOpenedSchema: z.ZodObject<{
	sessionId: z.ZodUUID;
	epoch: z.ZodNumber;
	heartbeatIntervalSeconds: z.ZodNumber;
	leaseExpiresAt: z.ZodString;
	connectionState: z.ZodEnum<{
		online: "online";
		degraded: "degraded";
	}>;
}, z.core.$strict>;
export declare const sessionHeartbeatAckSchema: z.ZodObject<{
	leaseExpiresAt: z.ZodString;
}, z.core.$strict>;
export declare const sessionOfflineSchema: z.ZodObject<{
	offline: z.ZodLiteral<true>;
}, z.core.$strict>;
export declare const sessionReconcileSchema: z.ZodObject<{
	activeRuns: z.ZodArray<z.ZodObject<{
		runId: z.ZodUUID;
		paneId: z.ZodString;
		agentName: z.ZodString;
		phase: z.ZodEnum<{
			unknown: "unknown";
			prepared: "prepared";
			pane_created: "pane_created";
			agent_started: "agent_started";
			prompt_dispatching: "prompt_dispatching";
			prompt_acknowledged: "prompt_acknowledged";
		}>;
	}, z.core.$strict>>;
}, z.core.$strict>;
export declare const sessionReconciledSchema: z.ZodObject<{
	decisions: z.ZodArray<z.ZodObject<{
		runId: z.ZodUUID;
		action: z.ZodEnum<{
			needs_reconciliation: "needs_reconciliation";
			resume: "resume";
			stop: "stop";
		}>;
		runVersion: z.ZodNumber;
	}, z.core.$strict>>;
}, z.core.$strict>;
/** ─── Runs ────────────────────────────────────────────────────────────── */
export declare const agentRunSchema: z.ZodObject<{
	runId: z.ZodUUID;
	workspaceId: z.ZodUUID;
	projectId: z.ZodUUID;
	bindingId: z.ZodUUID;
	issueId: z.ZodNullable<z.ZodUUID>;
	projectDocumentId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
	projectDocumentVersion: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
	trigger: z.ZodEnum<{
		manual: "manual";
		automation: "automation";
	}>;
	status: z.ZodEnum<{
		queued: "queued";
		starting: "starting";
		running: "running";
		awaiting_review: "awaiting_review";
		blocked: "blocked";
		stopping: "stopping";
		needs_reconciliation: "needs_reconciliation";
		succeeded: "succeeded";
		cancelled: "cancelled";
		failed: "failed";
	}>;
	runVersion: z.ZodNumber;
	claimEpoch: z.ZodNullable<z.ZodNumber>;
	captureEpoch: z.ZodNullable<z.ZodString>;
	paneId: z.ZodNullable<z.ZodString>;
	agentName: z.ZodNullable<z.ZodString>;
	prompt: z.ZodString;
	cancelRequested: z.ZodBoolean;
	cancelReason: z.ZodNullable<z.ZodString>;
	failureReason: z.ZodNullable<z.ZodString>;
	queuedAt: z.ZodString;
	startedAt: z.ZodNullable<z.ZodString>;
	endedAt: z.ZodNullable<z.ZodString>;
	retryOfRunId: z.ZodNullable<z.ZodUUID>;
}, z.core.$strict>;
export declare const agentRunsSchema: z.ZodObject<{
	runs: z.ZodArray<z.ZodObject<{
		runId: z.ZodUUID;
		workspaceId: z.ZodUUID;
		projectId: z.ZodUUID;
		bindingId: z.ZodUUID;
		issueId: z.ZodNullable<z.ZodUUID>;
		projectDocumentId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
		projectDocumentVersion: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
		trigger: z.ZodEnum<{
			manual: "manual";
			automation: "automation";
		}>;
		status: z.ZodEnum<{
			queued: "queued";
			starting: "starting";
			running: "running";
			awaiting_review: "awaiting_review";
			blocked: "blocked";
			stopping: "stopping";
			needs_reconciliation: "needs_reconciliation";
			succeeded: "succeeded";
			cancelled: "cancelled";
			failed: "failed";
		}>;
		runVersion: z.ZodNumber;
		claimEpoch: z.ZodNullable<z.ZodNumber>;
		captureEpoch: z.ZodNullable<z.ZodString>;
		paneId: z.ZodNullable<z.ZodString>;
		agentName: z.ZodNullable<z.ZodString>;
		prompt: z.ZodString;
		cancelRequested: z.ZodBoolean;
		cancelReason: z.ZodNullable<z.ZodString>;
		failureReason: z.ZodNullable<z.ZodString>;
		queuedAt: z.ZodString;
		startedAt: z.ZodNullable<z.ZodString>;
		endedAt: z.ZodNullable<z.ZodString>;
		retryOfRunId: z.ZodNullable<z.ZodUUID>;
	}, z.core.$strict>>;
}, z.core.$strict>;
export declare const runClaimedSchema: z.ZodObject<{
	runId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
	runVersion: z.ZodNumber;
	captureEpoch: z.ZodString;
}, z.core.$strict>;
export declare const runStatusReceiptSchema: z.ZodObject<{
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
	expectedRunVersion: z.ZodNumber;
	status: z.ZodEnum<{
		queued: "queued";
		starting: "starting";
		running: "running";
		awaiting_review: "awaiting_review";
		blocked: "blocked";
		stopping: "stopping";
		needs_reconciliation: "needs_reconciliation";
		succeeded: "succeeded";
		cancelled: "cancelled";
		failed: "failed";
	}>;
	reason: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const runStatusReceiptAckSchema: z.ZodObject<{
	runId: z.ZodUUID;
	runVersion: z.ZodNumber;
	status: z.ZodEnum<{
		queued: "queued";
		starting: "starting";
		running: "running";
		awaiting_review: "awaiting_review";
		blocked: "blocked";
		stopping: "stopping";
		needs_reconciliation: "needs_reconciliation";
		succeeded: "succeeded";
		cancelled: "cancelled";
		failed: "failed";
	}>;
}, z.core.$strict>;
/** The saved manifest excludes runner authority; the API adds it at submit time. */
export declare const projectDocumentResultManifestSchema: z.ZodObject<{
	expectedVersion: z.ZodNumber;
	format: z.ZodEnum<{
		markdown: "markdown";
		html: "html";
	}>;
	source: z.ZodString;
	operationId: z.ZodUUID;
}, z.core.$strict>;
/** Protected source handoff from the runner for a project-document run. */
export declare const projectDocumentResultSchema: z.ZodObject<{
	expectedVersion: z.ZodNumber;
	format: z.ZodEnum<{
		markdown: "markdown";
		html: "html";
	}>;
	source: z.ZodString;
	operationId: z.ZodUUID;
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
}, z.core.$strict>;
export declare const projectDocumentResultAckSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	documentId: z.ZodUUID;
	version: z.ZodNumber;
	format: z.ZodEnum<{
		markdown: "markdown";
		html: "html";
	}>;
}, z.core.$strict>;
export declare const runContextSchema: z.ZodObject<{
	runId: z.ZodUUID;
	prompt: z.ZodString;
	project: z.ZodObject<{
		id: z.ZodUUID;
		workspaceId: z.ZodUUID;
		name: z.ZodString;
	}, z.core.$strict>;
	issue: z.ZodNullable<z.ZodObject<{
		id: z.ZodUUID;
		identifier: z.ZodString;
		title: z.ZodString;
		descriptionText: z.ZodString;
		comments: z.ZodArray<z.ZodObject<{
			id: z.ZodUUID;
			authorName: z.ZodString;
			body: z.ZodString;
			createdAt: z.ZodString;
		}, z.core.$strict>>;
	}, z.core.$strict>>;
	projectDocument: z.ZodOptional<z.ZodNullable<z.ZodObject<{
		id: z.ZodUUID;
		title: z.ZodString;
		version: z.ZodNumber;
		format: z.ZodEnum<{
			json: "json";
			markdown: "markdown";
			html: "html";
		}>;
		source: z.ZodString;
		content: z.ZodUnknown;
		annotations: z.ZodArray<z.ZodObject<{
			id: z.ZodUUID;
			authorId: z.ZodUUID;
			createdAt: z.ZodString;
			start: z.ZodNumber;
			end: z.ZodNumber;
			selectedText: z.ZodString;
			prefix: z.ZodString;
			suffix: z.ZodString;
			body: z.ZodString;
		}, z.core.$strict>>;
	}, z.core.$strict>>>;
}, z.core.$strict>;
/** ─── Commands ────────────────────────────────────────────────────────── */
export declare const commandCreateSchema: z.ZodObject<{
	operationId: z.ZodUUID;
	kind: z.ZodEnum<{
		continue: "continue";
		cancel: "cancel";
	}>;
	prompt: z.ZodOptional<z.ZodString>;
	expectedRunVersion: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const commandAckSchema: z.ZodObject<{
	sessionId: z.ZodUUID;
	claimEpoch: z.ZodNumber;
	outcome: z.ZodEnum<{
		failed: "failed";
		rejected: "rejected";
		accepted: "accepted";
		stalled: "stalled";
	}>;
	phase: z.ZodOptional<z.ZodEnum<{
		unknown: "unknown";
		prepared: "prepared";
		pane_created: "pane_created";
		agent_started: "agent_started";
		prompt_dispatching: "prompt_dispatching";
		prompt_acknowledged: "prompt_acknowledged";
	}>>;
	detail: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const commandAckedSchema: z.ZodObject<{
	commandId: z.ZodUUID;
	accepted: z.ZodLiteral<true>;
}, z.core.$strict>;
export declare const agentCommandsSchema: z.ZodObject<{
	commands: z.ZodArray<z.ZodObject<{
		protocolVersion: z.ZodNumber;
		type: z.ZodLiteral<"run.command">;
		commandId: z.ZodUUID;
		operationId: z.ZodUUID;
		workspaceId: z.ZodUUID;
		projectId: z.ZodUUID;
		bindingId: z.ZodUUID;
		runId: z.ZodUUID;
		commandSeq: z.ZodNumber;
		kind: z.ZodEnum<{
			continue: "continue";
			start: "start";
			cancel: "cancel";
		}>;
		status: z.ZodEnum<{
			pending: "pending";
			dispatched: "dispatched";
			claimed: "claimed";
			acked: "acked";
			expired: "expired";
			rejected: "rejected";
		}>;
		prompt: z.ZodNullable<z.ZodString>;
		expectedRunVersion: z.ZodNullable<z.ZodNumber>;
		issuedBy: z.ZodUUID;
		issuedAt: z.ZodString;
		expiresAt: z.ZodNullable<z.ZodString>;
		claim: z.ZodNullable<z.ZodObject<{
			sessionId: z.ZodUUID;
			claimEpoch: z.ZodNumber;
		}, z.core.$strict>>;
	}, z.core.$strict>>;
}, z.core.$strict>;
export declare const subscriptionRequestSchema: z.ZodObject<{
	protocolVersion: z.ZodNumber;
	sessionId: z.ZodOptional<z.ZodUUID>;
	scopes: z.ZodArray<z.ZodDiscriminatedUnion<[
		z.ZodObject<{
			kind: z.ZodLiteral<"project-events">;
			projectId: z.ZodUUID;
		}, z.core.$strict>,
		z.ZodObject<{
			kind: z.ZodLiteral<"binding-commands">;
			bindingId: z.ZodUUID;
		}, z.core.$strict>,
		z.ZodObject<{
			kind: z.ZodLiteral<"run-events">;
			runId: z.ZodUUID;
		}, z.core.$strict>,
		z.ZodObject<{
			kind: z.ZodLiteral<"run-screens">;
			runId: z.ZodUUID;
		}, z.core.$strict>
	], "kind">>;
}, z.core.$strict>;
export declare const agentSubscriptionsSchema: z.ZodObject<{
	subscriptions: z.ZodArray<z.ZodDiscriminatedUnion<[
		z.ZodObject<{
			status: z.ZodLiteral<"active">;
			kind: z.ZodEnum<{
				"project-events": "project-events";
				"binding-commands": "binding-commands";
				"run-events": "run-events";
				"run-screens": "run-screens";
			}>;
			stream: z.ZodString;
			basin: z.ZodString;
			token: z.ZodString;
			tokenExpiresAt: z.ZodString;
			operations: z.ZodArray<z.ZodEnum<{
				read: "read";
				append: "append";
				"check-tail": "check-tail";
			}>>;
			nextSeqNum: z.ZodString;
			onGap: z.ZodLiteral<"refetch-authority">;
			captureEpoch: z.ZodNullable<z.ZodString>;
			screenState: z.ZodNullable<z.ZodEnum<{
				expired: "expired";
				live: "live";
				"awaiting-frame": "awaiting-frame";
			}>>;
		}, z.core.$strict>,
		z.ZodObject<{
			status: z.ZodLiteral<"screens-pending">;
			kind: z.ZodLiteral<"run-screens">;
			runId: z.ZodUUID;
			captureEpoch: z.ZodNull;
			screenState: z.ZodEnum<{
				expired: "expired";
				live: "live";
				"awaiting-frame": "awaiting-frame";
			}>;
		}, z.core.$strict>
	], "status">>;
}, z.core.$strict>;

export {};
