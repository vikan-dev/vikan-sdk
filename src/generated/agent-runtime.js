// Generated from @vikan/contract. Do not edit.
// packages/contract/src/api-errors.ts
import { z } from "zod";
var API_PROBLEM_TYPE_BASE = "https://errors.zebra.dev/";
var API_ERROR_STATUS = {
  github_unconfigured: 503,
  github_installation_conflict: 409,
  github_state_invalid: 400,
  validation_failed: 422,
  output_validation_failed: 500,
  invalid_json: 400,
  invalid_content_length: 400,
  body_read_failed: 400,
  unauthenticated: 401,
  forbidden: 403,
  insufficient_scope: 403,
  workspace_archived: 409,
  last_workspace_admin: 409,
  document_changed: 409,
  issue_stage_changed: 409,
  deliverable_reference_mismatch: 409,
  deliverable_operation_conflict: 409,
  deliverable_result_unconfirmed: 503,
  mcp_rejected: 409,
  mcp_result_unconfirmed: 503,
  run_slot_conflict: 409,
  stale_version: 409,
  link_not_found: 404,
  link_gone: 410,
  link_pending: 425,
  rate_limited: 429,
  command_expired: 410,
  protocol_version_unsupported: 400,
  agent_unconfigured: 503,
  events_unconfigured: 503,
  machine_unconfigured: 503,
  machine_deleted: 410,
  machine_busy: 409,
  machine_not_ready: 409,
  machine_operation_conflict: 409,
  quota_exhausted: 402,
  payment_required: 402,
  provider_unavailable: 503,
  provider_not_found: 404,
  credential_revoked: 409,
  credential_invalid: 422,
  cursor_gap: 409,
  run_invalidated: 409,
  origin_forbidden: 403,
  not_found: 404,
  invite_not_found: 404,
  invite_gone: 410,
  body_too_large: 413,
  invalid_file_upload: 400,
  file_too_large: 413,
  file_not_ready: 409,
  file_owner_mismatch: 409,
  file_upload_conflict: 409,
  file_upload_in_progress: 409,
  file_inline_unsupported: 415,
  storage_unavailable: 503,
  unsupported_media_type: 415,
  unsupported_content_encoding: 415,
  snapshot_too_large: 503,
  database_unavailable: 503,
  internal: 500,
  request_cancelled: 499
};
var API_ERROR_CODES = Object.keys(API_ERROR_STATUS);
var apiErrorCodeSchema = z.enum(API_ERROR_CODES);
function problemCode(type) {
  if (!type.startsWith(API_PROBLEM_TYPE_BASE))
    return null;
  const code = type.slice(API_PROBLEM_TYPE_BASE.length);
  return code in API_ERROR_STATUS ? code : null;
}
function errorSpecs(...codes) {
  return Object.fromEntries(codes.map((code) => [code, { status: API_ERROR_STATUS[code] }]));
}
var problemValidationIssueSchema = z.strictObject({
  path: z.string(),
  message: z.string()
});
var problemSchema = z.strictObject({
  type: z.string().min(1),
  status: z.number().int().min(400).max(599),
  title: z.string(),
  detail: z.unknown().optional(),
  instance: z.string().min(1),
  errors: z.array(problemValidationIssueSchema).optional()
}).superRefine((problem, ctx) => {
  const code = problemCode(problem.type);
  if (code === null) {
    ctx.addIssue({ code: "custom", path: ["type"], message: "Unknown problem code" });
    return;
  }
  if (API_ERROR_STATUS[code] !== problem.status) {
    ctx.addIssue({ code: "custom", path: ["status"], message: `Status does not match code ${code}` });
  }
});
// packages/contract/src/api-output.ts
class ApiOutputError extends Error {
  issues;
  constructor(issues) {
    super("API response did not match the shared contract schema");
    this.name = "ApiOutputError";
    this.issues = issues;
  }
}
function parseApiOutput(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success)
    throw new ApiOutputError(result.error);
  return result.data;
}
// packages/contract/src/api-health.ts
import { z as z2 } from "zod";
var healthSchema = z2.strictObject({
  status: z2.literal("ok"),
  database: z2.literal("up")
});
// packages/contract/src/http-values.ts
import { z as z3 } from "zod";
var LIMITS = {
  snapshotBytes: 32 * 1024 * 1024,
  collectionRows: 1e5,
  totalRows: 300000,
  workspaces: 1000,
  jsonBytes: 1024 * 1024,
  jsonDepth: 4096,
  documentBytes: 1024 * 1024,
  documentDepth: 32,
  documentNodes: 50000,
  mutationBytes: 64 * 1024 * 1024,
  mutationOps: 500
};

class ContractError extends Error {
  code;
  constructor(code) {
    super(code);
    this.code = code;
    this.name = "ContractError";
  }
}
var utf8Bytes = (text) => new TextEncoder().encode(text).byteLength;
function assertJson(value, maxDepth = LIMITS.jsonDepth) {
  const ancestors = new Set;
  const stack = [{ item: value, depth: 0 }];
  while (stack.length) {
    const { item, depth, leaving } = stack.pop();
    if (leaving) {
      ancestors.delete(item);
      continue;
    }
    if (depth > maxDepth)
      throw new ContractError("JSON_DEPTH");
    if (item === null || typeof item === "string" || typeof item === "boolean")
      continue;
    if (typeof item === "number" && Number.isFinite(item))
      continue;
    if (typeof item !== "object" || item === null || ancestors.has(item))
      throw new ContractError("INVALID_JSON");
    if (!Array.isArray(item) && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) {
      throw new ContractError("INVALID_JSON");
    }
    ancestors.add(item);
    stack.push({ item, depth, leaving: true });
    for (const child of Array.isArray(item) ? item : Object.values(item))
      stack.push({ item: child, depth: depth + 1 });
  }
}
function assertJsonSize(value, maxBytes, maxDepth) {
  assertJson(value, maxDepth);
  if (utf8Bytes(JSON.stringify(value)) > maxBytes)
    throw new ContractError("BODY_TOO_LARGE");
}
var jsonObjectSchema = z3.custom((value) => {
  try {
    assertJsonSize(value, LIMITS.jsonBytes);
    return value !== null && typeof value === "object" && !Array.isArray(value);
  } catch {
    return false;
  }
}, "Expected bounded JSON object");
var uuidSchema = z3.uuid();
var timestampSchema = z3.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/).refine((value) => Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value, "Expected canonical UTC milliseconds");
var dateOnlySchema = z3.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Expected calendar date");
var int32Schema = z3.number().int().min(-2147483648).max(2147483647);
var documentVersionSchema = int32Schema.nonnegative();
// packages/contract/src/cli-link.ts
import { z as z5 } from "zod";
// packages/contract/src/agent-events.ts
import { z as z4 } from "zod";
var AGENT_PROTOCOL_VERSION = 1;
var AGENT_SUPPORTED_PROTOCOL_VERSIONS = [AGENT_PROTOCOL_VERSION];
var S2_SEQ_NUM_MAX = "18446744073709551615";
var s2SeqNumSchema = z4.string().regex(/^(?:0|[1-9][0-9]{0,19})$/, "Expected a decimal u64 sequence string").refine((value) => {
  try {
    return BigInt(value) <= BigInt(S2_SEQ_NUM_MAX);
  } catch {
    return false;
  }
}, "Sequence number exceeds u64");
var s2NextReadPositionSchema = s2SeqNumSchema;
var captureEpochSchema = z4.string().min(8).max(128);
var frameIdSchema = z4.string().min(8).max(160);
var herdrIdSchema = z4.string().min(1).max(256);
var agentRunStatusSchema = z4.enum([
  "queued",
  "starting",
  "running",
  "awaiting_review",
  "blocked",
  "stopping",
  "needs_reconciliation",
  "succeeded",
  "cancelled",
  "failed"
]);
var AGENT_RUN_TERMINAL_STATUSES = ["succeeded", "cancelled", "failed"];
var AGENT_RUN_SLOT_STATUSES = ["starting", "running", "awaiting_review", "blocked", "stopping", "needs_reconciliation"];
var AGENT_RUN_NON_TERMINAL_STATUSES = ["queued", ...AGENT_RUN_SLOT_STATUSES];
var agentConnectionStateSchema = z4.enum(["online", "degraded", "offline"]);
var agentCommandKindSchema = z4.enum(["start", "continue", "cancel"]);
var agentCommandStatusSchema = z4.enum([
  "pending",
  "dispatched",
  "claimed",
  "acked",
  "expired",
  "rejected"
]);
function agentBindingCommandsStream(bindingId) {
  return `bindings/${bindingId}/commands`;
}
function agentRunScreensStream(runId, captureEpoch) {
  return `runs/${runId}/screens/${captureEpoch}`;
}
var agentCommandClaimSchema = z4.strictObject({
  sessionId: uuidSchema,
  claimEpoch: int32Schema.min(1)
});
var protocolVersionField = z4.number().int().nonnegative();
var occurredAtField = timestampSchema;
var agentIssueChangedEventSchema = z4.strictObject({
  protocolVersion: protocolVersionField,
  type: z4.literal("issue.changed"),
  eventId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  issueId: uuidSchema,
  change: z4.enum(["assignee", "state", "project", "deleted", "archived", "other"]),
  mutationIds: z4.array(uuidSchema).min(1).max(50).optional(),
  actorId: uuidSchema.optional(),
  assigneeFrom: uuidSchema.nullable().optional(),
  assigneeTo: uuidSchema.nullable().optional(),
  stateFrom: uuidSchema.optional(),
  stateTo: uuidSchema.optional(),
  occurredAt: occurredAtField
});
var agentRunStatusEventSchema = z4.strictObject({
  protocolVersion: protocolVersionField,
  type: z4.literal("run.status"),
  eventId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  bindingId: uuidSchema,
  runId: uuidSchema,
  runVersion: int32Schema.min(1),
  status: agentRunStatusSchema,
  reason: z4.string().max(2000).nullable(),
  occurredAt: occurredAtField
});
var agentCommandSchema = z4.strictObject({
  protocolVersion: protocolVersionField,
  type: z4.literal("run.command"),
  commandId: uuidSchema,
  operationId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  bindingId: uuidSchema,
  runId: uuidSchema,
  commandSeq: int32Schema.min(1),
  kind: agentCommandKindSchema,
  status: agentCommandStatusSchema,
  prompt: z4.string().max(65536).nullable(),
  expectedRunVersion: int32Schema.min(1).nullable(),
  issuedBy: uuidSchema,
  issuedAt: occurredAtField,
  expiresAt: timestampSchema.nullable(),
  claim: agentCommandClaimSchema.nullable()
});
var SCREEN_FRAME_MAX_BYTES = 256 * 1024;
var screenFrameSchema = z4.strictObject({
  protocolVersion: protocolVersionField,
  type: z4.literal("screen.frame"),
  runId: uuidSchema,
  captureEpoch: captureEpochSchema,
  frameId: frameIdSchema,
  paneId: herdrIdSchema,
  revision: int32Schema.min(0),
  rows: int32Schema.min(1).max(1000),
  cols: int32Schema.min(1).max(1000),
  capturedAt: occurredAtField,
  format: z4.literal("ansi"),
  truncated: z4.boolean(),
  content: z4.string().max(SCREEN_FRAME_MAX_BYTES)
});
var agentEventSchema = z4.discriminatedUnion("type", [
  agentIssueChangedEventSchema,
  agentRunStatusEventSchema,
  agentCommandSchema,
  screenFrameSchema
]).superRefine((event, ctx) => {
  if (!AGENT_SUPPORTED_PROTOCOL_VERSIONS.includes(event.protocolVersion)) {
    ctx.addIssue({
      code: "custom",
      path: ["protocolVersion"],
      message: `Unsupported agent protocol version ${event.protocolVersion}; this build supports ${AGENT_SUPPORTED_PROTOCOL_VERSIONS.join(", ")}. Pause and upgrade instead of executing unknown records.`
    });
  }
});
function isUnsupportedAgentProtocolVersion(value) {
  if (typeof value !== "object" || value === null)
    return false;
  const version = value.protocolVersion;
  if (typeof version !== "number" || !Number.isInteger(version))
    return false;
  return !AGENT_SUPPORTED_PROTOCOL_VERSIONS.includes(version);
}

// packages/contract/src/cli-link.ts
var agentHashSchema = z5.string().regex(/^[0-9a-f]{64}$/);
var linkRequestCreateSchema = z5.strictObject({
  pairingSecretHash: agentHashSchema,
  deviceCredentialHash: agentHashSchema,
  deviceName: z5.string().trim().min(1).max(120),
  cliVersion: z5.string().trim().min(1).max(40),
  protocolVersion: int32Schema.min(1),
  directoryKey: z5.string().min(1).max(1024),
  directoryLabel: z5.string().trim().min(1).max(512)
});
var linkRequestCreatedSchema = z5.strictObject({
  requestId: uuidSchema,
  userCode: z5.string().regex(/^[A-Z0-9]{4,12}$/),
  verificationUrl: z5.url(),
  expiresAt: timestampSchema,
  pollIntervalSeconds: int32Schema.min(1).max(60)
});
var linkRequestStatusSchema = z5.enum(["pending", "approved", "rejected", "claimed", "expired"]);
var linkProjectOptionSchema = z5.strictObject({
  id: uuidSchema,
  name: z5.string().min(1),
  archived: z5.boolean()
});
var linkWorkspaceOptionSchema = z5.strictObject({
  id: uuidSchema,
  name: z5.string().min(1),
  role: z5.enum(["admin", "member", "guest"]),
  archived: z5.boolean(),
  projects: z5.array(linkProjectOptionSchema).max(200)
});
var linkRequestViewSchema = z5.strictObject({
  requestId: uuidSchema,
  status: linkRequestStatusSchema,
  userCode: z5.string().regex(/^[A-Z0-9]{4,12}$/),
  deviceName: z5.string().min(1),
  cliVersion: z5.string().min(1),
  directoryKey: z5.string().min(1),
  directoryLabel: z5.string().min(1),
  createdAt: timestampSchema,
  expiresAt: timestampSchema,
  workspaces: z5.array(linkWorkspaceOptionSchema).max(100)
});
var linkApproveSchema = z5.strictObject({
  workspaceId: uuidSchema,
  projectId: uuidSchema
});
var linkApprovedSchema = z5.strictObject({
  requestId: uuidSchema,
  status: z5.literal("approved"),
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  approvedAt: timestampSchema
});
var linkRejectedSchema = z5.strictObject({
  requestId: uuidSchema,
  status: z5.literal("rejected")
});
var linkClaimSchema = z5.strictObject({
  pairingSecret: z5.string().min(32).max(256)
});
var linkClaimedSchema = z5.strictObject({
  requestId: uuidSchema,
  bindingId: uuidSchema,
  deviceId: uuidSchema,
  userId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  directoryKey: z5.string().min(1),
  claimedAt: timestampSchema,
  agentPageUrl: z5.url()
});
var agentBindingSchema = z5.strictObject({
  bindingId: uuidSchema,
  deviceId: uuidSchema,
  userId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  directoryKey: z5.string().min(1),
  directoryLabel: z5.string().min(1),
  status: z5.enum(["active", "revoked"]),
  connectionState: agentConnectionStateSchema,
  createdAt: timestampSchema,
  revokedAt: timestampSchema.nullable()
});
var agentBindingsSchema = z5.strictObject({ bindings: z5.array(agentBindingSchema) });
var agentBindingRevokedSchema = z5.strictObject({ revoked: z5.literal(true) });
var bodyErrors = errorSpecs("unsupported_media_type", "unsupported_content_encoding", "body_too_large", "invalid_json", "validation_failed", "internal");
var linkErrors = errorSpecs("unsupported_media_type", "unsupported_content_encoding", "body_too_large", "invalid_json", "validation_failed", "link_not_found", "link_gone", "link_pending", "rate_limited", "internal");
var browserWriteErrors = { ...bodyErrors, ...errorSpecs("unauthenticated", "forbidden", "not_found", "origin_forbidden", "rate_limited") };
// packages/contract/src/agent-findings.ts
import { z as z12 } from "zod";

// packages/contract/src/agent-deliverables.ts
import { z as z11 } from "zod";

// packages/contract/src/files.ts
import { z as z6 } from "zod";
var FILE_MAX_BYTES = 50 * 1024 * 1024;
var FILE_MULTIPART_MAX_BYTES = 51 * 1024 * 1024;
var MCP_FILE_MAX_BYTES = 5 * 1024 * 1024;
var MCP_FILE_BODY_MAX_BYTES = 8 * 1024 * 1024;
var FILE_NAME_MAX_LENGTH = 255;
var FILE_LIST_DEFAULT_LIMIT = 25;
var FILE_LIST_MAX_LIMIT = 50;
var FILE_FALLBACK_MIME_TYPE = "application/octet-stream";
var filePreviewKindSchema = z6.enum(["image", "video"]).nullable();
var fileOwnerTypeSchema = z6.enum(["issue", "project_document"]);
var fileOwnerSchema = z6.strictObject({ type: fileOwnerTypeSchema, externalId: uuidSchema });
var fileNameSchema = z6.string().min(1).max(FILE_NAME_MAX_LENGTH).refine((name) => name.trim().length > 0 && name !== "." && name !== ".." && !/[\\/:\u0000-\u001f\u007f-\u009f]/u.test(name), "Expected a filename without paths or control characters");
var fileByteSizeSchema = z6.number().int().nonnegative().max(FILE_MAX_BYTES);
var fileMimeTypeSchema = z6.string().max(255).regex(/^[a-z0-9!#$%&'*+.^_`|~-]+\/[a-z0-9!#$%&'*+.^_`|~-]+$/);
function normalizeFileMimeType(value) {
  const parsed = fileMimeTypeSchema.safeParse(value.split(";", 1)[0].trim().toLowerCase());
  return parsed.success ? parsed.data : FILE_FALLBACK_MIME_TYPE;
}
var fileMetadataSchema = z6.strictObject({
  fileId: uuidSchema,
  workspaceId: uuidSchema,
  uploaderId: uuidSchema,
  owner: fileOwnerSchema.nullable(),
  filename: fileNameSchema,
  mimeType: fileMimeTypeSchema,
  previewKind: filePreviewKindSchema,
  byteSize: fileByteSizeSchema,
  status: z6.literal("ready"),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  readyAt: timestampSchema
}).refine((file) => file.previewKind === null || (file.previewKind === "image" ? ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.mimeType) : ["video/mp4", "video/webm"].includes(file.mimeType)), "Inconsistent preview capability");
var fileUploadMetadataSchema = z6.strictObject({
  operationId: uuidSchema,
  owner: fileOwnerSchema.nullable()
});
function isFormData(value) {
  return Object.prototype.toString.call(value) === "[object FormData]" && typeof value.entries === "function";
}
function isFile(value) {
  const brand = Object.prototype.toString.call(value);
  return (brand === "[object File]" || brand === "[object Blob]") && typeof value.name === "string" && typeof value.type === "string" && typeof value.arrayBuffer === "function";
}
function validateFile(file) {
  if (!isFile(file) || !fileNameSchema.safeParse(file.name).success)
    throw new ContractError("INVALID_FILE_UPLOAD");
  if (!fileByteSizeSchema.safeParse(file.size).success) {
    throw new ContractError(Number.isSafeInteger(file.size) && file.size > FILE_MAX_BYTES ? "FILE_TOO_LARGE" : "INVALID_FILE_UPLOAD");
  }
}
function parseFileUploadFormData(raw) {
  if (!isFormData(raw))
    throw new ContractError("INVALID_FILE_UPLOAD");
  const seen = new Set;
  let metadata;
  let file;
  for (const [name, value] of raw.entries()) {
    if (seen.has(name))
      throw new ContractError("INVALID_FILE_UPLOAD");
    seen.add(name);
    if (name === "metadata" && typeof value === "string") {
      try {
        metadata = fileUploadMetadataSchema.parse(JSON.parse(value));
      } catch {
        throw new ContractError("INVALID_FILE_UPLOAD");
      }
    } else if (name === "file") {
      validateFile(value);
      file = value;
    } else
      throw new ContractError("INVALID_FILE_UPLOAD");
  }
  if (!metadata || !file)
    throw new ContractError("INVALID_FILE_UPLOAD");
  return { metadata, file };
}
var fileUploadBodySchema = z6.custom(isFormData, "Expected multipart FormData").superRefine((value, ctx) => {
  try {
    parseFileUploadFormData(value);
  } catch (error) {
    ctx.addIssue({ code: "custom", message: error instanceof ContractError ? error.code : "INVALID_FILE_UPLOAD" });
  }
});
function createFileUploadFormData(metadata, file) {
  const parsed = fileUploadMetadataSchema.parse(metadata);
  validateFile(file);
  const form = new FormData;
  form.append("metadata", JSON.stringify(parsed));
  form.append("file", file);
  return form;
}
var fileUploadResultSchema = z6.strictObject({
  operationId: uuidSchema,
  replayed: z6.boolean(),
  file: fileMetadataSchema
});
var fileListQuerySchema = fileOwnerSchema.extend({
  limit: z6.coerce.number().int().min(1).max(FILE_LIST_MAX_LIMIT).default(FILE_LIST_DEFAULT_LIMIT),
  cursor: uuidSchema.optional().describe("Last fileId from the previous page with the same owner; ascending UUID order.")
});
var fileListResultSchema = z6.strictObject({
  files: z6.array(fileMetadataSchema).max(FILE_LIST_MAX_LIMIT),
  nextCursor: uuidSchema.nullable()
});
var fileDispositionSchema = z6.enum(["inline", "attachment"]);
var fileContentQuerySchema = z6.strictObject({ disposition: fileDispositionSchema.default("attachment") });
var fileContentResultSchema = z6.strictObject({
  fileId: uuidSchema,
  url: z6.url({ protocol: /^https?$/ }),
  expiresAt: timestampSchema,
  disposition: fileDispositionSchema
});
var fileNodeAttrsSchema = z6.strictObject({
  fileId: uuidSchema,
  display: z6.enum(["auto", "attachment"]).optional(),
  alt: z6.string().max(2048).nullable().optional()
});

// packages/contract/src/issue-deliverables-contract.ts
import { z as z10 } from "zod";

// packages/contract/src/issue-deliverables.ts
import { z as z9 } from "zod";

// packages/contract/src/http-document.ts
import { z as z8 } from "zod";

// node_modules/parse5/dist/common/unicode.js
var UNDEFINED_CODE_POINTS = new Set([
  65534,
  65535,
  131070,
  131071,
  196606,
  196607,
  262142,
  262143,
  327678,
  327679,
  393214,
  393215,
  458750,
  458751,
  524286,
  524287,
  589822,
  589823,
  655358,
  655359,
  720894,
  720895,
  786430,
  786431,
  851966,
  851967,
  917502,
  917503,
  983038,
  983039,
  1048574,
  1048575,
  1114110,
  1114111
]);
var CODE_POINTS;
(function(CODE_POINTS) {
  CODE_POINTS[CODE_POINTS["EOF"] = -1] = "EOF";
  CODE_POINTS[CODE_POINTS["NULL"] = 0] = "NULL";
  CODE_POINTS[CODE_POINTS["TABULATION"] = 9] = "TABULATION";
  CODE_POINTS[CODE_POINTS["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
  CODE_POINTS[CODE_POINTS["LINE_FEED"] = 10] = "LINE_FEED";
  CODE_POINTS[CODE_POINTS["FORM_FEED"] = 12] = "FORM_FEED";
  CODE_POINTS[CODE_POINTS["SPACE"] = 32] = "SPACE";
  CODE_POINTS[CODE_POINTS["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
  CODE_POINTS[CODE_POINTS["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
  CODE_POINTS[CODE_POINTS["AMPERSAND"] = 38] = "AMPERSAND";
  CODE_POINTS[CODE_POINTS["APOSTROPHE"] = 39] = "APOSTROPHE";
  CODE_POINTS[CODE_POINTS["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
  CODE_POINTS[CODE_POINTS["SOLIDUS"] = 47] = "SOLIDUS";
  CODE_POINTS[CODE_POINTS["DIGIT_0"] = 48] = "DIGIT_0";
  CODE_POINTS[CODE_POINTS["DIGIT_9"] = 57] = "DIGIT_9";
  CODE_POINTS[CODE_POINTS["SEMICOLON"] = 59] = "SEMICOLON";
  CODE_POINTS[CODE_POINTS["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
  CODE_POINTS[CODE_POINTS["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
  CODE_POINTS[CODE_POINTS["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
  CODE_POINTS[CODE_POINTS["QUESTION_MARK"] = 63] = "QUESTION_MARK";
  CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
  CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
  CODE_POINTS[CODE_POINTS["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
  CODE_POINTS[CODE_POINTS["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
  CODE_POINTS[CODE_POINTS["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
  CODE_POINTS[CODE_POINTS["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
})(CODE_POINTS || (CODE_POINTS = {}));

// node_modules/parse5/dist/common/error-codes.js
var ERR;
(function(ERR) {
  ERR["controlCharacterInInputStream"] = "control-character-in-input-stream";
  ERR["noncharacterInInputStream"] = "noncharacter-in-input-stream";
  ERR["surrogateInInputStream"] = "surrogate-in-input-stream";
  ERR["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
  ERR["endTagWithAttributes"] = "end-tag-with-attributes";
  ERR["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
  ERR["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
  ERR["unexpectedNullCharacter"] = "unexpected-null-character";
  ERR["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
  ERR["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
  ERR["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
  ERR["missingEndTagName"] = "missing-end-tag-name";
  ERR["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
  ERR["unknownNamedCharacterReference"] = "unknown-named-character-reference";
  ERR["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
  ERR["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
  ERR["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
  ERR["eofBeforeTagName"] = "eof-before-tag-name";
  ERR["eofInTag"] = "eof-in-tag";
  ERR["missingAttributeValue"] = "missing-attribute-value";
  ERR["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
  ERR["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
  ERR["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
  ERR["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
  ERR["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
  ERR["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
  ERR["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
  ERR["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
  ERR["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
  ERR["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
  ERR["cdataInHtmlContent"] = "cdata-in-html-content";
  ERR["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
  ERR["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
  ERR["eofInDoctype"] = "eof-in-doctype";
  ERR["nestedComment"] = "nested-comment";
  ERR["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
  ERR["eofInComment"] = "eof-in-comment";
  ERR["incorrectlyClosedComment"] = "incorrectly-closed-comment";
  ERR["eofInCdata"] = "eof-in-cdata";
  ERR["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
  ERR["nullCharacterReference"] = "null-character-reference";
  ERR["surrogateCharacterReference"] = "surrogate-character-reference";
  ERR["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
  ERR["controlCharacterReference"] = "control-character-reference";
  ERR["noncharacterCharacterReference"] = "noncharacter-character-reference";
  ERR["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
  ERR["missingDoctypeName"] = "missing-doctype-name";
  ERR["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
  ERR["duplicateAttribute"] = "duplicate-attribute";
  ERR["nonConformingDoctype"] = "non-conforming-doctype";
  ERR["missingDoctype"] = "missing-doctype";
  ERR["misplacedDoctype"] = "misplaced-doctype";
  ERR["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
  ERR["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
  ERR["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
  ERR["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
  ERR["abandonedHeadElementChild"] = "abandoned-head-element-child";
  ERR["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
  ERR["nestedNoscriptInHead"] = "nested-noscript-in-head";
  ERR["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));

// node_modules/parse5/dist/tokenizer/preprocessor.js
var DEFAULT_BUFFER_WATERLINE = 1 << 16;

// node_modules/parse5/dist/common/token.js
var TokenType;
(function(TokenType) {
  TokenType[TokenType["CHARACTER"] = 0] = "CHARACTER";
  TokenType[TokenType["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
  TokenType[TokenType["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
  TokenType[TokenType["START_TAG"] = 3] = "START_TAG";
  TokenType[TokenType["END_TAG"] = 4] = "END_TAG";
  TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
  TokenType[TokenType["DOCTYPE"] = 6] = "DOCTYPE";
  TokenType[TokenType["EOF"] = 7] = "EOF";
  TokenType[TokenType["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));

// node_modules/parse5/dist/common/html.js
var NS;
(function(NS) {
  NS["HTML"] = "http://www.w3.org/1999/xhtml";
  NS["MATHML"] = "http://www.w3.org/1998/Math/MathML";
  NS["SVG"] = "http://www.w3.org/2000/svg";
  NS["XLINK"] = "http://www.w3.org/1999/xlink";
  NS["XML"] = "http://www.w3.org/XML/1998/namespace";
  NS["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS || (NS = {}));
var ATTRS;
(function(ATTRS) {
  ATTRS["TYPE"] = "type";
  ATTRS["ACTION"] = "action";
  ATTRS["ENCODING"] = "encoding";
  ATTRS["PROMPT"] = "prompt";
  ATTRS["NAME"] = "name";
  ATTRS["COLOR"] = "color";
  ATTRS["FACE"] = "face";
  ATTRS["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
var DOCUMENT_MODE;
(function(DOCUMENT_MODE) {
  DOCUMENT_MODE["NO_QUIRKS"] = "no-quirks";
  DOCUMENT_MODE["QUIRKS"] = "quirks";
  DOCUMENT_MODE["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function(TAG_NAMES) {
  TAG_NAMES["A"] = "a";
  TAG_NAMES["ADDRESS"] = "address";
  TAG_NAMES["ANNOTATION_XML"] = "annotation-xml";
  TAG_NAMES["APPLET"] = "applet";
  TAG_NAMES["AREA"] = "area";
  TAG_NAMES["ARTICLE"] = "article";
  TAG_NAMES["ASIDE"] = "aside";
  TAG_NAMES["B"] = "b";
  TAG_NAMES["BASE"] = "base";
  TAG_NAMES["BASEFONT"] = "basefont";
  TAG_NAMES["BGSOUND"] = "bgsound";
  TAG_NAMES["BIG"] = "big";
  TAG_NAMES["BLOCKQUOTE"] = "blockquote";
  TAG_NAMES["BODY"] = "body";
  TAG_NAMES["BR"] = "br";
  TAG_NAMES["BUTTON"] = "button";
  TAG_NAMES["CAPTION"] = "caption";
  TAG_NAMES["CENTER"] = "center";
  TAG_NAMES["CODE"] = "code";
  TAG_NAMES["COL"] = "col";
  TAG_NAMES["COLGROUP"] = "colgroup";
  TAG_NAMES["DD"] = "dd";
  TAG_NAMES["DESC"] = "desc";
  TAG_NAMES["DETAILS"] = "details";
  TAG_NAMES["DIALOG"] = "dialog";
  TAG_NAMES["DIR"] = "dir";
  TAG_NAMES["DIV"] = "div";
  TAG_NAMES["DL"] = "dl";
  TAG_NAMES["DT"] = "dt";
  TAG_NAMES["EM"] = "em";
  TAG_NAMES["EMBED"] = "embed";
  TAG_NAMES["FIELDSET"] = "fieldset";
  TAG_NAMES["FIGCAPTION"] = "figcaption";
  TAG_NAMES["FIGURE"] = "figure";
  TAG_NAMES["FONT"] = "font";
  TAG_NAMES["FOOTER"] = "footer";
  TAG_NAMES["FOREIGN_OBJECT"] = "foreignObject";
  TAG_NAMES["FORM"] = "form";
  TAG_NAMES["FRAME"] = "frame";
  TAG_NAMES["FRAMESET"] = "frameset";
  TAG_NAMES["H1"] = "h1";
  TAG_NAMES["H2"] = "h2";
  TAG_NAMES["H3"] = "h3";
  TAG_NAMES["H4"] = "h4";
  TAG_NAMES["H5"] = "h5";
  TAG_NAMES["H6"] = "h6";
  TAG_NAMES["HEAD"] = "head";
  TAG_NAMES["HEADER"] = "header";
  TAG_NAMES["HGROUP"] = "hgroup";
  TAG_NAMES["HR"] = "hr";
  TAG_NAMES["HTML"] = "html";
  TAG_NAMES["I"] = "i";
  TAG_NAMES["IMG"] = "img";
  TAG_NAMES["IMAGE"] = "image";
  TAG_NAMES["INPUT"] = "input";
  TAG_NAMES["IFRAME"] = "iframe";
  TAG_NAMES["KEYGEN"] = "keygen";
  TAG_NAMES["LABEL"] = "label";
  TAG_NAMES["LI"] = "li";
  TAG_NAMES["LINK"] = "link";
  TAG_NAMES["LISTING"] = "listing";
  TAG_NAMES["MAIN"] = "main";
  TAG_NAMES["MALIGNMARK"] = "malignmark";
  TAG_NAMES["MARQUEE"] = "marquee";
  TAG_NAMES["MATH"] = "math";
  TAG_NAMES["MENU"] = "menu";
  TAG_NAMES["META"] = "meta";
  TAG_NAMES["MGLYPH"] = "mglyph";
  TAG_NAMES["MI"] = "mi";
  TAG_NAMES["MO"] = "mo";
  TAG_NAMES["MN"] = "mn";
  TAG_NAMES["MS"] = "ms";
  TAG_NAMES["MTEXT"] = "mtext";
  TAG_NAMES["NAV"] = "nav";
  TAG_NAMES["NOBR"] = "nobr";
  TAG_NAMES["NOFRAMES"] = "noframes";
  TAG_NAMES["NOEMBED"] = "noembed";
  TAG_NAMES["NOSCRIPT"] = "noscript";
  TAG_NAMES["OBJECT"] = "object";
  TAG_NAMES["OL"] = "ol";
  TAG_NAMES["OPTGROUP"] = "optgroup";
  TAG_NAMES["OPTION"] = "option";
  TAG_NAMES["P"] = "p";
  TAG_NAMES["PARAM"] = "param";
  TAG_NAMES["PLAINTEXT"] = "plaintext";
  TAG_NAMES["PRE"] = "pre";
  TAG_NAMES["RB"] = "rb";
  TAG_NAMES["RP"] = "rp";
  TAG_NAMES["RT"] = "rt";
  TAG_NAMES["RTC"] = "rtc";
  TAG_NAMES["RUBY"] = "ruby";
  TAG_NAMES["S"] = "s";
  TAG_NAMES["SCRIPT"] = "script";
  TAG_NAMES["SEARCH"] = "search";
  TAG_NAMES["SECTION"] = "section";
  TAG_NAMES["SELECT"] = "select";
  TAG_NAMES["SOURCE"] = "source";
  TAG_NAMES["SMALL"] = "small";
  TAG_NAMES["SPAN"] = "span";
  TAG_NAMES["STRIKE"] = "strike";
  TAG_NAMES["STRONG"] = "strong";
  TAG_NAMES["STYLE"] = "style";
  TAG_NAMES["SUB"] = "sub";
  TAG_NAMES["SUMMARY"] = "summary";
  TAG_NAMES["SUP"] = "sup";
  TAG_NAMES["TABLE"] = "table";
  TAG_NAMES["TBODY"] = "tbody";
  TAG_NAMES["TEMPLATE"] = "template";
  TAG_NAMES["TEXTAREA"] = "textarea";
  TAG_NAMES["TFOOT"] = "tfoot";
  TAG_NAMES["TD"] = "td";
  TAG_NAMES["TH"] = "th";
  TAG_NAMES["THEAD"] = "thead";
  TAG_NAMES["TITLE"] = "title";
  TAG_NAMES["TR"] = "tr";
  TAG_NAMES["TRACK"] = "track";
  TAG_NAMES["TT"] = "tt";
  TAG_NAMES["U"] = "u";
  TAG_NAMES["UL"] = "ul";
  TAG_NAMES["SVG"] = "svg";
  TAG_NAMES["VAR"] = "var";
  TAG_NAMES["WBR"] = "wbr";
  TAG_NAMES["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
var TAG_ID;
(function(TAG_ID) {
  TAG_ID[TAG_ID["UNKNOWN"] = 0] = "UNKNOWN";
  TAG_ID[TAG_ID["A"] = 1] = "A";
  TAG_ID[TAG_ID["ADDRESS"] = 2] = "ADDRESS";
  TAG_ID[TAG_ID["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
  TAG_ID[TAG_ID["APPLET"] = 4] = "APPLET";
  TAG_ID[TAG_ID["AREA"] = 5] = "AREA";
  TAG_ID[TAG_ID["ARTICLE"] = 6] = "ARTICLE";
  TAG_ID[TAG_ID["ASIDE"] = 7] = "ASIDE";
  TAG_ID[TAG_ID["B"] = 8] = "B";
  TAG_ID[TAG_ID["BASE"] = 9] = "BASE";
  TAG_ID[TAG_ID["BASEFONT"] = 10] = "BASEFONT";
  TAG_ID[TAG_ID["BGSOUND"] = 11] = "BGSOUND";
  TAG_ID[TAG_ID["BIG"] = 12] = "BIG";
  TAG_ID[TAG_ID["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
  TAG_ID[TAG_ID["BODY"] = 14] = "BODY";
  TAG_ID[TAG_ID["BR"] = 15] = "BR";
  TAG_ID[TAG_ID["BUTTON"] = 16] = "BUTTON";
  TAG_ID[TAG_ID["CAPTION"] = 17] = "CAPTION";
  TAG_ID[TAG_ID["CENTER"] = 18] = "CENTER";
  TAG_ID[TAG_ID["CODE"] = 19] = "CODE";
  TAG_ID[TAG_ID["COL"] = 20] = "COL";
  TAG_ID[TAG_ID["COLGROUP"] = 21] = "COLGROUP";
  TAG_ID[TAG_ID["DD"] = 22] = "DD";
  TAG_ID[TAG_ID["DESC"] = 23] = "DESC";
  TAG_ID[TAG_ID["DETAILS"] = 24] = "DETAILS";
  TAG_ID[TAG_ID["DIALOG"] = 25] = "DIALOG";
  TAG_ID[TAG_ID["DIR"] = 26] = "DIR";
  TAG_ID[TAG_ID["DIV"] = 27] = "DIV";
  TAG_ID[TAG_ID["DL"] = 28] = "DL";
  TAG_ID[TAG_ID["DT"] = 29] = "DT";
  TAG_ID[TAG_ID["EM"] = 30] = "EM";
  TAG_ID[TAG_ID["EMBED"] = 31] = "EMBED";
  TAG_ID[TAG_ID["FIELDSET"] = 32] = "FIELDSET";
  TAG_ID[TAG_ID["FIGCAPTION"] = 33] = "FIGCAPTION";
  TAG_ID[TAG_ID["FIGURE"] = 34] = "FIGURE";
  TAG_ID[TAG_ID["FONT"] = 35] = "FONT";
  TAG_ID[TAG_ID["FOOTER"] = 36] = "FOOTER";
  TAG_ID[TAG_ID["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
  TAG_ID[TAG_ID["FORM"] = 38] = "FORM";
  TAG_ID[TAG_ID["FRAME"] = 39] = "FRAME";
  TAG_ID[TAG_ID["FRAMESET"] = 40] = "FRAMESET";
  TAG_ID[TAG_ID["H1"] = 41] = "H1";
  TAG_ID[TAG_ID["H2"] = 42] = "H2";
  TAG_ID[TAG_ID["H3"] = 43] = "H3";
  TAG_ID[TAG_ID["H4"] = 44] = "H4";
  TAG_ID[TAG_ID["H5"] = 45] = "H5";
  TAG_ID[TAG_ID["H6"] = 46] = "H6";
  TAG_ID[TAG_ID["HEAD"] = 47] = "HEAD";
  TAG_ID[TAG_ID["HEADER"] = 48] = "HEADER";
  TAG_ID[TAG_ID["HGROUP"] = 49] = "HGROUP";
  TAG_ID[TAG_ID["HR"] = 50] = "HR";
  TAG_ID[TAG_ID["HTML"] = 51] = "HTML";
  TAG_ID[TAG_ID["I"] = 52] = "I";
  TAG_ID[TAG_ID["IMG"] = 53] = "IMG";
  TAG_ID[TAG_ID["IMAGE"] = 54] = "IMAGE";
  TAG_ID[TAG_ID["INPUT"] = 55] = "INPUT";
  TAG_ID[TAG_ID["IFRAME"] = 56] = "IFRAME";
  TAG_ID[TAG_ID["KEYGEN"] = 57] = "KEYGEN";
  TAG_ID[TAG_ID["LABEL"] = 58] = "LABEL";
  TAG_ID[TAG_ID["LI"] = 59] = "LI";
  TAG_ID[TAG_ID["LINK"] = 60] = "LINK";
  TAG_ID[TAG_ID["LISTING"] = 61] = "LISTING";
  TAG_ID[TAG_ID["MAIN"] = 62] = "MAIN";
  TAG_ID[TAG_ID["MALIGNMARK"] = 63] = "MALIGNMARK";
  TAG_ID[TAG_ID["MARQUEE"] = 64] = "MARQUEE";
  TAG_ID[TAG_ID["MATH"] = 65] = "MATH";
  TAG_ID[TAG_ID["MENU"] = 66] = "MENU";
  TAG_ID[TAG_ID["META"] = 67] = "META";
  TAG_ID[TAG_ID["MGLYPH"] = 68] = "MGLYPH";
  TAG_ID[TAG_ID["MI"] = 69] = "MI";
  TAG_ID[TAG_ID["MO"] = 70] = "MO";
  TAG_ID[TAG_ID["MN"] = 71] = "MN";
  TAG_ID[TAG_ID["MS"] = 72] = "MS";
  TAG_ID[TAG_ID["MTEXT"] = 73] = "MTEXT";
  TAG_ID[TAG_ID["NAV"] = 74] = "NAV";
  TAG_ID[TAG_ID["NOBR"] = 75] = "NOBR";
  TAG_ID[TAG_ID["NOFRAMES"] = 76] = "NOFRAMES";
  TAG_ID[TAG_ID["NOEMBED"] = 77] = "NOEMBED";
  TAG_ID[TAG_ID["NOSCRIPT"] = 78] = "NOSCRIPT";
  TAG_ID[TAG_ID["OBJECT"] = 79] = "OBJECT";
  TAG_ID[TAG_ID["OL"] = 80] = "OL";
  TAG_ID[TAG_ID["OPTGROUP"] = 81] = "OPTGROUP";
  TAG_ID[TAG_ID["OPTION"] = 82] = "OPTION";
  TAG_ID[TAG_ID["P"] = 83] = "P";
  TAG_ID[TAG_ID["PARAM"] = 84] = "PARAM";
  TAG_ID[TAG_ID["PLAINTEXT"] = 85] = "PLAINTEXT";
  TAG_ID[TAG_ID["PRE"] = 86] = "PRE";
  TAG_ID[TAG_ID["RB"] = 87] = "RB";
  TAG_ID[TAG_ID["RP"] = 88] = "RP";
  TAG_ID[TAG_ID["RT"] = 89] = "RT";
  TAG_ID[TAG_ID["RTC"] = 90] = "RTC";
  TAG_ID[TAG_ID["RUBY"] = 91] = "RUBY";
  TAG_ID[TAG_ID["S"] = 92] = "S";
  TAG_ID[TAG_ID["SCRIPT"] = 93] = "SCRIPT";
  TAG_ID[TAG_ID["SEARCH"] = 94] = "SEARCH";
  TAG_ID[TAG_ID["SECTION"] = 95] = "SECTION";
  TAG_ID[TAG_ID["SELECT"] = 96] = "SELECT";
  TAG_ID[TAG_ID["SOURCE"] = 97] = "SOURCE";
  TAG_ID[TAG_ID["SMALL"] = 98] = "SMALL";
  TAG_ID[TAG_ID["SPAN"] = 99] = "SPAN";
  TAG_ID[TAG_ID["STRIKE"] = 100] = "STRIKE";
  TAG_ID[TAG_ID["STRONG"] = 101] = "STRONG";
  TAG_ID[TAG_ID["STYLE"] = 102] = "STYLE";
  TAG_ID[TAG_ID["SUB"] = 103] = "SUB";
  TAG_ID[TAG_ID["SUMMARY"] = 104] = "SUMMARY";
  TAG_ID[TAG_ID["SUP"] = 105] = "SUP";
  TAG_ID[TAG_ID["TABLE"] = 106] = "TABLE";
  TAG_ID[TAG_ID["TBODY"] = 107] = "TBODY";
  TAG_ID[TAG_ID["TEMPLATE"] = 108] = "TEMPLATE";
  TAG_ID[TAG_ID["TEXTAREA"] = 109] = "TEXTAREA";
  TAG_ID[TAG_ID["TFOOT"] = 110] = "TFOOT";
  TAG_ID[TAG_ID["TD"] = 111] = "TD";
  TAG_ID[TAG_ID["TH"] = 112] = "TH";
  TAG_ID[TAG_ID["THEAD"] = 113] = "THEAD";
  TAG_ID[TAG_ID["TITLE"] = 114] = "TITLE";
  TAG_ID[TAG_ID["TR"] = 115] = "TR";
  TAG_ID[TAG_ID["TRACK"] = 116] = "TRACK";
  TAG_ID[TAG_ID["TT"] = 117] = "TT";
  TAG_ID[TAG_ID["U"] = 118] = "U";
  TAG_ID[TAG_ID["UL"] = 119] = "UL";
  TAG_ID[TAG_ID["SVG"] = 120] = "SVG";
  TAG_ID[TAG_ID["VAR"] = 121] = "VAR";
  TAG_ID[TAG_ID["WBR"] = 122] = "WBR";
  TAG_ID[TAG_ID["XMP"] = 123] = "XMP";
})(TAG_ID || (TAG_ID = {}));
var TAG_NAME_TO_ID = new Map([
  [TAG_NAMES.A, TAG_ID.A],
  [TAG_NAMES.ADDRESS, TAG_ID.ADDRESS],
  [TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML],
  [TAG_NAMES.APPLET, TAG_ID.APPLET],
  [TAG_NAMES.AREA, TAG_ID.AREA],
  [TAG_NAMES.ARTICLE, TAG_ID.ARTICLE],
  [TAG_NAMES.ASIDE, TAG_ID.ASIDE],
  [TAG_NAMES.B, TAG_ID.B],
  [TAG_NAMES.BASE, TAG_ID.BASE],
  [TAG_NAMES.BASEFONT, TAG_ID.BASEFONT],
  [TAG_NAMES.BGSOUND, TAG_ID.BGSOUND],
  [TAG_NAMES.BIG, TAG_ID.BIG],
  [TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE],
  [TAG_NAMES.BODY, TAG_ID.BODY],
  [TAG_NAMES.BR, TAG_ID.BR],
  [TAG_NAMES.BUTTON, TAG_ID.BUTTON],
  [TAG_NAMES.CAPTION, TAG_ID.CAPTION],
  [TAG_NAMES.CENTER, TAG_ID.CENTER],
  [TAG_NAMES.CODE, TAG_ID.CODE],
  [TAG_NAMES.COL, TAG_ID.COL],
  [TAG_NAMES.COLGROUP, TAG_ID.COLGROUP],
  [TAG_NAMES.DD, TAG_ID.DD],
  [TAG_NAMES.DESC, TAG_ID.DESC],
  [TAG_NAMES.DETAILS, TAG_ID.DETAILS],
  [TAG_NAMES.DIALOG, TAG_ID.DIALOG],
  [TAG_NAMES.DIR, TAG_ID.DIR],
  [TAG_NAMES.DIV, TAG_ID.DIV],
  [TAG_NAMES.DL, TAG_ID.DL],
  [TAG_NAMES.DT, TAG_ID.DT],
  [TAG_NAMES.EM, TAG_ID.EM],
  [TAG_NAMES.EMBED, TAG_ID.EMBED],
  [TAG_NAMES.FIELDSET, TAG_ID.FIELDSET],
  [TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION],
  [TAG_NAMES.FIGURE, TAG_ID.FIGURE],
  [TAG_NAMES.FONT, TAG_ID.FONT],
  [TAG_NAMES.FOOTER, TAG_ID.FOOTER],
  [TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT],
  [TAG_NAMES.FORM, TAG_ID.FORM],
  [TAG_NAMES.FRAME, TAG_ID.FRAME],
  [TAG_NAMES.FRAMESET, TAG_ID.FRAMESET],
  [TAG_NAMES.H1, TAG_ID.H1],
  [TAG_NAMES.H2, TAG_ID.H2],
  [TAG_NAMES.H3, TAG_ID.H3],
  [TAG_NAMES.H4, TAG_ID.H4],
  [TAG_NAMES.H5, TAG_ID.H5],
  [TAG_NAMES.H6, TAG_ID.H6],
  [TAG_NAMES.HEAD, TAG_ID.HEAD],
  [TAG_NAMES.HEADER, TAG_ID.HEADER],
  [TAG_NAMES.HGROUP, TAG_ID.HGROUP],
  [TAG_NAMES.HR, TAG_ID.HR],
  [TAG_NAMES.HTML, TAG_ID.HTML],
  [TAG_NAMES.I, TAG_ID.I],
  [TAG_NAMES.IMG, TAG_ID.IMG],
  [TAG_NAMES.IMAGE, TAG_ID.IMAGE],
  [TAG_NAMES.INPUT, TAG_ID.INPUT],
  [TAG_NAMES.IFRAME, TAG_ID.IFRAME],
  [TAG_NAMES.KEYGEN, TAG_ID.KEYGEN],
  [TAG_NAMES.LABEL, TAG_ID.LABEL],
  [TAG_NAMES.LI, TAG_ID.LI],
  [TAG_NAMES.LINK, TAG_ID.LINK],
  [TAG_NAMES.LISTING, TAG_ID.LISTING],
  [TAG_NAMES.MAIN, TAG_ID.MAIN],
  [TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK],
  [TAG_NAMES.MARQUEE, TAG_ID.MARQUEE],
  [TAG_NAMES.MATH, TAG_ID.MATH],
  [TAG_NAMES.MENU, TAG_ID.MENU],
  [TAG_NAMES.META, TAG_ID.META],
  [TAG_NAMES.MGLYPH, TAG_ID.MGLYPH],
  [TAG_NAMES.MI, TAG_ID.MI],
  [TAG_NAMES.MO, TAG_ID.MO],
  [TAG_NAMES.MN, TAG_ID.MN],
  [TAG_NAMES.MS, TAG_ID.MS],
  [TAG_NAMES.MTEXT, TAG_ID.MTEXT],
  [TAG_NAMES.NAV, TAG_ID.NAV],
  [TAG_NAMES.NOBR, TAG_ID.NOBR],
  [TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES],
  [TAG_NAMES.NOEMBED, TAG_ID.NOEMBED],
  [TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT],
  [TAG_NAMES.OBJECT, TAG_ID.OBJECT],
  [TAG_NAMES.OL, TAG_ID.OL],
  [TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP],
  [TAG_NAMES.OPTION, TAG_ID.OPTION],
  [TAG_NAMES.P, TAG_ID.P],
  [TAG_NAMES.PARAM, TAG_ID.PARAM],
  [TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT],
  [TAG_NAMES.PRE, TAG_ID.PRE],
  [TAG_NAMES.RB, TAG_ID.RB],
  [TAG_NAMES.RP, TAG_ID.RP],
  [TAG_NAMES.RT, TAG_ID.RT],
  [TAG_NAMES.RTC, TAG_ID.RTC],
  [TAG_NAMES.RUBY, TAG_ID.RUBY],
  [TAG_NAMES.S, TAG_ID.S],
  [TAG_NAMES.SCRIPT, TAG_ID.SCRIPT],
  [TAG_NAMES.SEARCH, TAG_ID.SEARCH],
  [TAG_NAMES.SECTION, TAG_ID.SECTION],
  [TAG_NAMES.SELECT, TAG_ID.SELECT],
  [TAG_NAMES.SOURCE, TAG_ID.SOURCE],
  [TAG_NAMES.SMALL, TAG_ID.SMALL],
  [TAG_NAMES.SPAN, TAG_ID.SPAN],
  [TAG_NAMES.STRIKE, TAG_ID.STRIKE],
  [TAG_NAMES.STRONG, TAG_ID.STRONG],
  [TAG_NAMES.STYLE, TAG_ID.STYLE],
  [TAG_NAMES.SUB, TAG_ID.SUB],
  [TAG_NAMES.SUMMARY, TAG_ID.SUMMARY],
  [TAG_NAMES.SUP, TAG_ID.SUP],
  [TAG_NAMES.TABLE, TAG_ID.TABLE],
  [TAG_NAMES.TBODY, TAG_ID.TBODY],
  [TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE],
  [TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA],
  [TAG_NAMES.TFOOT, TAG_ID.TFOOT],
  [TAG_NAMES.TD, TAG_ID.TD],
  [TAG_NAMES.TH, TAG_ID.TH],
  [TAG_NAMES.THEAD, TAG_ID.THEAD],
  [TAG_NAMES.TITLE, TAG_ID.TITLE],
  [TAG_NAMES.TR, TAG_ID.TR],
  [TAG_NAMES.TRACK, TAG_ID.TRACK],
  [TAG_NAMES.TT, TAG_ID.TT],
  [TAG_NAMES.U, TAG_ID.U],
  [TAG_NAMES.UL, TAG_ID.UL],
  [TAG_NAMES.SVG, TAG_ID.SVG],
  [TAG_NAMES.VAR, TAG_ID.VAR],
  [TAG_NAMES.WBR, TAG_ID.WBR],
  [TAG_NAMES.XMP, TAG_ID.XMP]
]);
var $ = TAG_ID;
var SPECIAL_ELEMENTS = {
  [NS.HTML]: new Set([
    $.ADDRESS,
    $.APPLET,
    $.AREA,
    $.ARTICLE,
    $.ASIDE,
    $.BASE,
    $.BASEFONT,
    $.BGSOUND,
    $.BLOCKQUOTE,
    $.BODY,
    $.BR,
    $.BUTTON,
    $.CAPTION,
    $.CENTER,
    $.COL,
    $.COLGROUP,
    $.DD,
    $.DETAILS,
    $.DIR,
    $.DIV,
    $.DL,
    $.DT,
    $.EMBED,
    $.FIELDSET,
    $.FIGCAPTION,
    $.FIGURE,
    $.FOOTER,
    $.FORM,
    $.FRAME,
    $.FRAMESET,
    $.H1,
    $.H2,
    $.H3,
    $.H4,
    $.H5,
    $.H6,
    $.HEAD,
    $.HEADER,
    $.HGROUP,
    $.HR,
    $.HTML,
    $.IFRAME,
    $.IMG,
    $.INPUT,
    $.LI,
    $.LINK,
    $.LISTING,
    $.MAIN,
    $.MARQUEE,
    $.MENU,
    $.META,
    $.NAV,
    $.NOEMBED,
    $.NOFRAMES,
    $.NOSCRIPT,
    $.OBJECT,
    $.OL,
    $.P,
    $.PARAM,
    $.PLAINTEXT,
    $.PRE,
    $.SCRIPT,
    $.SECTION,
    $.SELECT,
    $.SOURCE,
    $.STYLE,
    $.SUMMARY,
    $.TABLE,
    $.TBODY,
    $.TD,
    $.TEMPLATE,
    $.TEXTAREA,
    $.TFOOT,
    $.TH,
    $.THEAD,
    $.TITLE,
    $.TR,
    $.TRACK,
    $.UL,
    $.WBR,
    $.XMP
  ]),
  [NS.MATHML]: new Set([$.MI, $.MO, $.MN, $.MS, $.MTEXT, $.ANNOTATION_XML]),
  [NS.SVG]: new Set([$.TITLE, $.FOREIGN_OBJECT, $.DESC]),
  [NS.XLINK]: new Set,
  [NS.XML]: new Set,
  [NS.XMLNS]: new Set
};
var NUMBERED_HEADERS = new Set([$.H1, $.H2, $.H3, $.H4, $.H5, $.H6]);
var UNESCAPED_TEXT = new Set([
  TAG_NAMES.STYLE,
  TAG_NAMES.SCRIPT,
  TAG_NAMES.XMP,
  TAG_NAMES.IFRAME,
  TAG_NAMES.NOEMBED,
  TAG_NAMES.NOFRAMES,
  TAG_NAMES.PLAINTEXT
]);

// node_modules/parse5/dist/tokenizer/index.js
var State;
(function(State) {
  State[State["DATA"] = 0] = "DATA";
  State[State["RCDATA"] = 1] = "RCDATA";
  State[State["RAWTEXT"] = 2] = "RAWTEXT";
  State[State["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
  State[State["PLAINTEXT"] = 4] = "PLAINTEXT";
  State[State["TAG_OPEN"] = 5] = "TAG_OPEN";
  State[State["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
  State[State["TAG_NAME"] = 7] = "TAG_NAME";
  State[State["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
  State[State["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
  State[State["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
  State[State["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
  State[State["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
  State[State["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
  State[State["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
  State[State["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
  State[State["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
  State[State["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
  State[State["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
  State[State["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
  State[State["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
  State[State["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
  State[State["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
  State[State["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
  State[State["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
  State[State["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
  State[State["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
  State[State["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
  State[State["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
  State[State["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
  State[State["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
  State[State["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
  State[State["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
  State[State["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
  State[State["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
  State[State["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
  State[State["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
  State[State["COMMENT_START"] = 42] = "COMMENT_START";
  State[State["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
  State[State["COMMENT"] = 44] = "COMMENT";
  State[State["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
  State[State["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
  State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
  State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
  State[State["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
  State[State["COMMENT_END"] = 50] = "COMMENT_END";
  State[State["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
  State[State["DOCTYPE"] = 52] = "DOCTYPE";
  State[State["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
  State[State["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
  State[State["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
  State[State["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
  State[State["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
  State[State["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
  State[State["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
  State[State["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
  State[State["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
  State[State["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
  State[State["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
  State[State["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
  State[State["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
  State[State["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
  State[State["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
  State[State["CDATA_SECTION"] = 68] = "CDATA_SECTION";
  State[State["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
  State[State["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
  State[State["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
  State[State["AMBIGUOUS_AMPERSAND"] = 72] = "AMBIGUOUS_AMPERSAND";
})(State || (State = {}));
var TokenizerMode = {
  DATA: State.DATA,
  RCDATA: State.RCDATA,
  RAWTEXT: State.RAWTEXT,
  SCRIPT_DATA: State.SCRIPT_DATA,
  PLAINTEXT: State.PLAINTEXT,
  CDATA_SECTION: State.CDATA_SECTION
};

// node_modules/parse5/dist/parser/open-element-stack.js
var IMPLICIT_END_TAG_REQUIRED = new Set([TAG_ID.DD, TAG_ID.DT, TAG_ID.LI, TAG_ID.OPTGROUP, TAG_ID.OPTION, TAG_ID.P, TAG_ID.RB, TAG_ID.RP, TAG_ID.RT, TAG_ID.RTC]);
var IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = new Set([
  ...IMPLICIT_END_TAG_REQUIRED,
  TAG_ID.CAPTION,
  TAG_ID.COLGROUP,
  TAG_ID.TBODY,
  TAG_ID.TD,
  TAG_ID.TFOOT,
  TAG_ID.TH,
  TAG_ID.THEAD,
  TAG_ID.TR
]);
var SCOPING_ELEMENTS_HTML = new Set([
  TAG_ID.APPLET,
  TAG_ID.CAPTION,
  TAG_ID.HTML,
  TAG_ID.MARQUEE,
  TAG_ID.OBJECT,
  TAG_ID.TABLE,
  TAG_ID.TD,
  TAG_ID.TEMPLATE,
  TAG_ID.TH
]);
var SCOPING_ELEMENTS_HTML_LIST = new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.OL, TAG_ID.UL]);
var SCOPING_ELEMENTS_HTML_BUTTON = new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.BUTTON]);
var SCOPING_ELEMENTS_MATHML = new Set([TAG_ID.ANNOTATION_XML, TAG_ID.MI, TAG_ID.MN, TAG_ID.MO, TAG_ID.MS, TAG_ID.MTEXT]);
var SCOPING_ELEMENTS_SVG = new Set([TAG_ID.DESC, TAG_ID.FOREIGN_OBJECT, TAG_ID.TITLE]);
var TABLE_ROW_CONTEXT = new Set([TAG_ID.TR, TAG_ID.TEMPLATE, TAG_ID.HTML]);
var TABLE_BODY_CONTEXT = new Set([TAG_ID.TBODY, TAG_ID.TFOOT, TAG_ID.THEAD, TAG_ID.TEMPLATE, TAG_ID.HTML]);
var TABLE_CONTEXT = new Set([TAG_ID.TABLE, TAG_ID.TEMPLATE, TAG_ID.HTML]);
var TABLE_CELLS = new Set([TAG_ID.TD, TAG_ID.TH]);

// node_modules/parse5/dist/parser/formatting-element-list.js
var EntryType;
(function(EntryType) {
  EntryType[EntryType["Marker"] = 0] = "Marker";
  EntryType[EntryType["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
var MARKER = { type: EntryType.Marker };

// node_modules/parse5/dist/common/doctype.js
var QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
  "+//silmaril//dtd html pro v0r11 19970101//",
  "-//as//dtd html 3.0 aswedit + extensions//",
  "-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
  "-//ietf//dtd html 2.0 level 1//",
  "-//ietf//dtd html 2.0 level 2//",
  "-//ietf//dtd html 2.0 strict level 1//",
  "-//ietf//dtd html 2.0 strict level 2//",
  "-//ietf//dtd html 2.0 strict//",
  "-//ietf//dtd html 2.0//",
  "-//ietf//dtd html 2.1e//",
  "-//ietf//dtd html 3.0//",
  "-//ietf//dtd html 3.2 final//",
  "-//ietf//dtd html 3.2//",
  "-//ietf//dtd html 3//",
  "-//ietf//dtd html level 0//",
  "-//ietf//dtd html level 1//",
  "-//ietf//dtd html level 2//",
  "-//ietf//dtd html level 3//",
  "-//ietf//dtd html strict level 0//",
  "-//ietf//dtd html strict level 1//",
  "-//ietf//dtd html strict level 2//",
  "-//ietf//dtd html strict level 3//",
  "-//ietf//dtd html strict//",
  "-//ietf//dtd html//",
  "-//metrius//dtd metrius presentational//",
  "-//microsoft//dtd internet explorer 2.0 html strict//",
  "-//microsoft//dtd internet explorer 2.0 html//",
  "-//microsoft//dtd internet explorer 2.0 tables//",
  "-//microsoft//dtd internet explorer 3.0 html strict//",
  "-//microsoft//dtd internet explorer 3.0 html//",
  "-//microsoft//dtd internet explorer 3.0 tables//",
  "-//netscape comm. corp.//dtd html//",
  "-//netscape comm. corp.//dtd strict html//",
  "-//o'reilly and associates//dtd html 2.0//",
  "-//o'reilly and associates//dtd html extended 1.0//",
  "-//o'reilly and associates//dtd html extended relaxed 1.0//",
  "-//sq//dtd html 2.0 hotmetal + extensions//",
  "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
  "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
  "-//spyglass//dtd html 2.0 extended//",
  "-//sun microsystems corp.//dtd hotjava html//",
  "-//sun microsystems corp.//dtd hotjava strict html//",
  "-//w3c//dtd html 3 1995-03-24//",
  "-//w3c//dtd html 3.2 draft//",
  "-//w3c//dtd html 3.2 final//",
  "-//w3c//dtd html 3.2//",
  "-//w3c//dtd html 3.2s draft//",
  "-//w3c//dtd html 4.0 frameset//",
  "-//w3c//dtd html 4.0 transitional//",
  "-//w3c//dtd html experimental 19960712//",
  "-//w3c//dtd html experimental 970421//",
  "-//w3c//dtd w3 html//",
  "-//w3o//dtd w3 html 3.0//",
  "-//webtechs//dtd mozilla html 2.0//",
  "-//webtechs//dtd mozilla html//"
];
var QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
  ...QUIRKS_MODE_PUBLIC_ID_PREFIXES,
  "-//w3c//dtd html 4.01 frameset//",
  "-//w3c//dtd html 4.01 transitional//"
];
var QUIRKS_MODE_PUBLIC_IDS = new Set([
  "-//w3o//dtd w3 html strict 3.0//en//",
  "-/w3c/dtd html 4.0 transitional/en",
  "html"
]);
var LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"];
var LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
  ...LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
  "-//w3c//dtd html 4.01 frameset//",
  "-//w3c//dtd html 4.01 transitional//"
];

// node_modules/parse5/dist/common/foreign-content.js
var SVG_ATTRS_ADJUSTMENT_MAP = new Map([
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((attr) => [attr.toLowerCase(), attr]));
var XML_ATTRS_ADJUSTMENT_MAP = new Map([
  ["xlink:actuate", { prefix: "xlink", name: "actuate", namespace: NS.XLINK }],
  ["xlink:arcrole", { prefix: "xlink", name: "arcrole", namespace: NS.XLINK }],
  ["xlink:href", { prefix: "xlink", name: "href", namespace: NS.XLINK }],
  ["xlink:role", { prefix: "xlink", name: "role", namespace: NS.XLINK }],
  ["xlink:show", { prefix: "xlink", name: "show", namespace: NS.XLINK }],
  ["xlink:title", { prefix: "xlink", name: "title", namespace: NS.XLINK }],
  ["xlink:type", { prefix: "xlink", name: "type", namespace: NS.XLINK }],
  ["xml:lang", { prefix: "xml", name: "lang", namespace: NS.XML }],
  ["xml:space", { prefix: "xml", name: "space", namespace: NS.XML }],
  ["xmlns", { prefix: "", name: "xmlns", namespace: NS.XMLNS }],
  ["xmlns:xlink", { prefix: "xmlns", name: "xlink", namespace: NS.XMLNS }]
]);
var SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((tn) => [tn.toLowerCase(), tn]));
var EXITS_FOREIGN_CONTENT = new Set([
  TAG_ID.B,
  TAG_ID.BIG,
  TAG_ID.BLOCKQUOTE,
  TAG_ID.BODY,
  TAG_ID.BR,
  TAG_ID.CENTER,
  TAG_ID.CODE,
  TAG_ID.DD,
  TAG_ID.DIV,
  TAG_ID.DL,
  TAG_ID.DT,
  TAG_ID.EM,
  TAG_ID.EMBED,
  TAG_ID.H1,
  TAG_ID.H2,
  TAG_ID.H3,
  TAG_ID.H4,
  TAG_ID.H5,
  TAG_ID.H6,
  TAG_ID.HEAD,
  TAG_ID.HR,
  TAG_ID.I,
  TAG_ID.IMG,
  TAG_ID.LI,
  TAG_ID.LISTING,
  TAG_ID.MENU,
  TAG_ID.META,
  TAG_ID.NOBR,
  TAG_ID.OL,
  TAG_ID.P,
  TAG_ID.PRE,
  TAG_ID.RUBY,
  TAG_ID.S,
  TAG_ID.SMALL,
  TAG_ID.SPAN,
  TAG_ID.STRONG,
  TAG_ID.STRIKE,
  TAG_ID.SUB,
  TAG_ID.SUP,
  TAG_ID.TABLE,
  TAG_ID.TT,
  TAG_ID.U,
  TAG_ID.UL,
  TAG_ID.VAR
]);

// node_modules/parse5/dist/parser/index.js
var InsertionMode;
(function(InsertionMode) {
  InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
  InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
  InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
  InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
  InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
  InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
  InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
  InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
  InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
  InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
  InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
  InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
  InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
  InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
  InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
  InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
  InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
  InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
  InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
  InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
  InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
  InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
  InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
var TABLE_STRUCTURE_TAGS = new Set([TAG_ID.TABLE, TAG_ID.TBODY, TAG_ID.TFOOT, TAG_ID.THEAD, TAG_ID.TR]);
var TABLE_VOID_ELEMENTS = new Set([TAG_ID.CAPTION, TAG_ID.COL, TAG_ID.COLGROUP, TAG_ID.TBODY, TAG_ID.TD, TAG_ID.TFOOT, TAG_ID.TH, TAG_ID.THEAD, TAG_ID.TR]);
// node_modules/parse5/dist/serializer/index.js
var VOID_ELEMENTS = new Set([
  TAG_NAMES.AREA,
  TAG_NAMES.BASE,
  TAG_NAMES.BASEFONT,
  TAG_NAMES.BGSOUND,
  TAG_NAMES.BR,
  TAG_NAMES.COL,
  TAG_NAMES.EMBED,
  TAG_NAMES.FRAME,
  TAG_NAMES.HR,
  TAG_NAMES.IMG,
  TAG_NAMES.INPUT,
  TAG_NAMES.KEYGEN,
  TAG_NAMES.LINK,
  TAG_NAMES.META,
  TAG_NAMES.PARAM,
  TAG_NAMES.SOURCE,
  TAG_NAMES.TRACK,
  TAG_NAMES.WBR
]);
// packages/contract/src/issue-references.ts
import { z as z7 } from "zod";
var issueReferenceIdentifierSchema = z7.string().regex(/^[A-Z0-9]{1,10}-[1-9][0-9]{0,9}$/, "Expected workspace prefix and number, such as VIK-123").refine((value) => Number(value.slice(value.indexOf("-") + 1)) <= 2147483647, "Issue number out of range");
var issueReferenceAttrsSchema = z7.strictObject({
  issueId: uuidSchema,
  identifier: issueReferenceIdentifierSchema
});

// packages/contract/src/http-document.ts
var DOCUMENT_PROTOCOL_VERSION = 1;
var DOCUMENT_NODES = ["doc", "paragraph", "text", "heading", "blockquote", "bulletList", "orderedList", "listItem", "taskList", "taskItem", "codeBlock", "hardBreak", "horizontalRule", "issueReference", "file"];
var DOCUMENT_MARKS = ["bold", "italic", "strike", "underline", "code", "link"];
var linkAttrs = z8.strictObject({
  href: z8.string().max(8192).refine((value) => {
    const clean = value.replace(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g, "");
    return !clean || /^(?:(?:https?|ftps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z0-9+.\-]+(?:[^a-z+.\-:]|$))/i.test(clean);
  }, "Unsafe link"),
  target: z8.string().nullable().optional(),
  rel: z8.string().nullable().optional(),
  class: z8.string().nullable().optional(),
  title: z8.string().nullable().optional()
});
var markSchema = z8.union([
  z8.strictObject({ type: z8.enum(["bold", "italic", "strike", "underline", "code"]), attrs: z8.strictObject({}).optional() }),
  z8.strictObject({ type: z8.literal("link"), attrs: linkAttrs })
]);
var EMPTY_DOCUMENT = { type: "doc", content: [{ type: "paragraph" }] };
var nodeSchema = z8.lazy(() => z8.strictObject({
  type: z8.enum(DOCUMENT_NODES),
  text: z8.string().min(1).optional(),
  attrs: z8.record(z8.string(), z8.union([z8.string(), z8.number(), z8.boolean(), z8.null()])).optional(),
  marks: z8.array(markSchema).max(DOCUMENT_MARKS.length).optional(),
  content: z8.array(nodeSchema).optional()
}));
var block = new Set(["paragraph", "heading", "blockquote", "bulletList", "orderedList", "taskList", "codeBlock", "horizontalRule", "file"]);
var inline = new Set(["text", "hardBreak", "issueReference"]);
function parseDocumentContent(raw) {
  assertJsonSize(raw, LIMITS.documentBytes, LIMITS.documentDepth * 2 + 4);
  const root = nodeSchema.parse(raw);
  let count = 0;
  function visit(node, depth) {
    if (++count > LIMITS.documentNodes || depth > LIMITS.documentDepth)
      throw new ContractError("DOCUMENT_COMPLEXITY");
    const children = node.content ?? [];
    const types = children.map((child) => child.type);
    const attrs = node.attrs ?? {};
    let allowedAttrs = [];
    switch (node.type) {
      case "doc":
        if (depth !== 0 || !children.length || types.some((type) => !block.has(type)))
          throw new ContractError("DOCUMENT_STRUCTURE");
        break;
      case "paragraph":
      case "heading":
        if (types.some((type) => !inline.has(type)))
          throw new ContractError("DOCUMENT_STRUCTURE");
        if (node.type === "heading") {
          allowedAttrs = ["level"];
          if (!Number.isInteger(attrs.level) || Number(attrs.level) < 1 || Number(attrs.level) > 6)
            throw new ContractError("HEADING_LEVEL");
        }
        break;
      case "blockquote":
        if (!children.length || types.some((type) => !block.has(type)))
          throw new ContractError("DOCUMENT_STRUCTURE");
        break;
      case "listItem":
      case "taskItem":
        if (types[0] !== "paragraph" || types.some((type) => !block.has(type)))
          throw new ContractError("DOCUMENT_STRUCTURE");
        if (node.type === "taskItem") {
          allowedAttrs = ["checked"];
          if (typeof attrs.checked !== "boolean")
            throw new ContractError("TASK_CHECKED");
        }
        break;
      case "taskList":
        if (!children.length || types.some((type) => type !== "taskItem"))
          throw new ContractError("DOCUMENT_STRUCTURE");
        break;
      case "orderedList":
      case "bulletList":
        if (!children.length || types.some((type) => type !== "listItem"))
          throw new ContractError("DOCUMENT_STRUCTURE");
        if (node.type === "orderedList") {
          allowedAttrs = ["start", "type"];
          if (attrs.start !== undefined && (!Number.isSafeInteger(attrs.start) || Number(attrs.start) < -2147483648 || Number(attrs.start) > 2147483647))
            throw new ContractError("LIST_START");
          if (attrs.type != null && typeof attrs.type !== "string")
            throw new ContractError("LIST_TYPE");
        }
        break;
      case "codeBlock":
        allowedAttrs = ["language"];
        if (attrs.language != null && typeof attrs.language !== "string")
          throw new ContractError("CODE_LANGUAGE");
        if (types.some((type) => type !== "text") || children.some((child) => child.marks?.length))
          throw new ContractError("DOCUMENT_STRUCTURE");
        break;
      case "text":
        if (!node.text || children.length || node.content)
          throw new ContractError("DOCUMENT_STRUCTURE");
        break;
      case "issueReference":
        allowedAttrs = ["issueId", "identifier"];
        if (node.content || node.text !== undefined)
          throw new ContractError("DOCUMENT_STRUCTURE");
        if (node.marks?.length)
          throw new ContractError("DOCUMENT_MARKS");
        if (!issueReferenceAttrsSchema.safeParse(attrs).success)
          throw new ContractError("DOCUMENT_REFERENCE");
        break;
      case "file":
        allowedAttrs = ["fileId", "display", "alt"];
        if (node.content || node.text !== undefined)
          throw new ContractError("DOCUMENT_STRUCTURE");
        if (!fileNodeAttrsSchema.safeParse(attrs).success)
          throw new ContractError("DOCUMENT_FILE");
        break;
      case "horizontalRule":
      case "hardBreak":
        if (node.content || node.text)
          throw new ContractError("DOCUMENT_STRUCTURE");
        break;
    }
    if (Object.keys(attrs).some((key) => !allowedAttrs.includes(key)))
      throw new ContractError("DOCUMENT_ATTRIBUTES");
    if (node.type !== "text" && node.text !== undefined)
      throw new ContractError("DOCUMENT_STRUCTURE");
    if (node.marks?.length && !inline.has(node.type))
      throw new ContractError("DOCUMENT_MARKS");
    if (new Set(node.marks?.map((mark) => mark.type)).size !== (node.marks?.length ?? 0))
      throw new ContractError("DOCUMENT_MARKS");
    if (node.marks?.some((mark) => mark.type === "code") && node.marks.length > 1)
      throw new ContractError("DOCUMENT_MARKS");
    for (const child of children)
      visit(child, depth + 1);
  }
  if (root.type !== "doc" || !root.content)
    throw new ContractError("DOCUMENT_ROOT");
  visit(root, 0);
  return root;
}
var documentContentSchema = z8.unknown().transform((raw, ctx) => {
  try {
    return parseDocumentContent(raw);
  } catch {
    ctx.addIssue({ code: "custom", message: "Invalid document JSON" });
    return z8.NEVER;
  }
});
var documentSchema = z8.strictObject({
  protocolVersion: z8.literal(DOCUMENT_PROTOCOL_VERSION),
  userId: uuidSchema,
  issueId: uuidSchema,
  content: documentContentSchema,
  version: documentVersionSchema,
  updatedAt: timestampSchema.nullable()
}).superRefine((value, ctx) => {
  if (value.version === 0 !== (value.updatedAt === null) || value.version === 0 && JSON.stringify(value.content) !== JSON.stringify(EMPTY_DOCUMENT)) {
    ctx.addIssue({ code: "custom", message: "Missing document must be empty at version zero" });
  }
});
var updateIssueDescriptionArgsSchema = z8.strictObject({
  id: uuidSchema,
  content: documentContentSchema,
  expectedVersion: documentVersionSchema.max(2147483646)
});
var documentDraftSchema = z8.strictObject({
  formatVersion: z8.literal(1),
  userId: uuidSchema,
  issueId: uuidSchema,
  content: documentContentSchema,
  baseVersion: documentVersionSchema.nullable(),
  localRevision: z8.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  updatedAt: timestampSchema,
  recovery: z8.enum(["none", "unbased", "conflict"])
}).refine((value) => value.baseVersion !== null || value.recovery === "unbased", "Unknown base requires explicit recovery");
var PROJECT_DOCUMENT_PROTOCOL_VERSION = 1;
var PROJECT_DOCUMENT_TITLE_MAX_LENGTH = 512;
var projectDocumentTitleSchema = z8.string().trim().min(1).max(PROJECT_DOCUMENT_TITLE_MAX_LENGTH);
var projectDocumentFormatSchema = z8.enum(["json", "markdown", "html"]);
var projectDocumentSourceSchema = z8.string().max(LIMITS.documentBytes).refine((value) => new TextEncoder().encode(value).byteLength <= LIMITS.documentBytes, "Document source exceeds the byte limit");
var projectDocumentVersionSchema = z8.strictObject({
  id: uuidSchema,
  documentId: uuidSchema,
  version: documentVersionSchema.positive(),
  format: projectDocumentFormatSchema,
  source: projectDocumentSourceSchema,
  content: documentContentSchema,
  createdBy: uuidSchema.nullable(),
  createdAt: timestampSchema,
  provenance: z8.strictObject({
    kind: z8.enum(["initial", "agent", "restore"]),
    runId: uuidSchema.nullable(),
    restoredFromVersion: documentVersionSchema.positive().nullable()
  })
});
var projectDocumentAnnotationSchema = z8.strictObject({
  id: uuidSchema,
  documentId: uuidSchema,
  version: documentVersionSchema.positive(),
  start: z8.number().int().nonnegative(),
  end: z8.number().int().positive(),
  selectedText: z8.string().min(1).max(20000),
  prefix: z8.string().max(2000),
  suffix: z8.string().max(2000),
  body: z8.string().trim().min(1).max(20000),
  authorId: uuidSchema,
  createdAt: timestampSchema
});
var projectDocumentAnnotationInputSchema = z8.strictObject({
  version: documentVersionSchema.positive(),
  start: z8.number().int().nonnegative(),
  end: z8.number().int().positive(),
  selectedText: z8.string().min(1).max(20000),
  prefix: z8.string().max(2000).default(""),
  suffix: z8.string().max(2000).default(""),
  body: z8.string().trim().min(1).max(20000)
});
var projectDocumentHistorySchema = z8.strictObject({
  documentId: uuidSchema,
  currentVersion: documentVersionSchema.positive(),
  versions: z8.array(projectDocumentVersionSchema).max(1e4),
  annotationVersions: z8.array(documentVersionSchema.positive()).max(1e4)
});
var projectDocumentAnnotationsSchema = z8.strictObject({
  documentId: uuidSchema,
  version: documentVersionSchema.positive(),
  annotations: z8.array(projectDocumentAnnotationSchema).max(1000)
});
var projectDocumentDiffSegmentSchema = z8.strictObject({
  type: z8.enum(["equal", "insert", "delete"]),
  text: z8.string()
});
var projectDocumentDiffSchema = z8.strictObject({
  documentId: uuidSchema,
  fromVersion: documentVersionSchema.positive(),
  toVersion: documentVersionSchema.positive(),
  fromFormat: projectDocumentFormatSchema,
  toFormat: projectDocumentFormatSchema,
  segments: z8.array(projectDocumentDiffSegmentSchema).max(1e4)
});
var projectDocumentRestoreResultSchema = z8.strictObject({
  documentId: uuidSchema,
  version: documentVersionSchema.positive(),
  restoredFromVersion: documentVersionSchema.positive()
});
var projectDocumentRestoreInputSchema = z8.strictObject({
  version: documentVersionSchema.positive(),
  expectedVersion: documentVersionSchema.positive(),
  operationId: uuidSchema
});
var projectDocumentAgentInputSchema = z8.strictObject({
  expectedVersion: documentVersionSchema.positive(),
  format: z8.enum(["markdown", "html"]),
  source: projectDocumentSourceSchema.min(1),
  operationId: uuidSchema,
  runId: uuidSchema.nullable().optional()
});
var projectDocumentSchema = z8.strictObject({
  protocolVersion: z8.literal(PROJECT_DOCUMENT_PROTOCOL_VERSION),
  userId: uuidSchema,
  documentId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  title: projectDocumentTitleSchema,
  content: documentContentSchema,
  version: documentVersionSchema.positive(),
  updatedAt: timestampSchema,
  format: projectDocumentFormatSchema.optional(),
  source: projectDocumentSourceSchema.optional()
});
var dangerousHtml = new Set(["script", "style", "iframe", "object", "embed", "template", "base", "form"]);
var blockHtml = new Set(["address", "article", "aside", "div", "dl", "dt", "dd", "figure", "figcaption", "footer", "header", "main", "nav", "ol", "p", "pre", "section", "table", "ul", "blockquote", "hr"]);

// packages/contract/src/issue-deliverables.ts
var ISSUE_DELIVERABLES_PROTOCOL_VERSION = 1;
var DELIVERABLE_BODY_MAX_BYTES = 2 * 1024 * 1024;
var DELIVERABLE_TITLE_MAX_LENGTH = 256;
var DELIVERABLE_SUMMARY_MAX_LENGTH = 2000;
var DELIVERABLE_TEXT_MAX_LENGTH = 1e5;
var STAGE_MAX_CHECKS = 50;
var STAGE_MAX_FILES = 50;
var DELIVERABLE_PAGE_DEFAULT_LIMIT = 20;
var DELIVERABLE_PAGE_MAX_LIMIT = 50;
var DELIVERABLE_PREVIEW_LIMIT = 3;
var titleSchema = z9.string().trim().min(1).max(DELIVERABLE_TITLE_MAX_LENGTH);
var summarySchema = z9.string().max(DELIVERABLE_SUMMARY_MAX_LENGTH);
var positiveVersion = int32Schema.positive();
var checkIdSchema = z9.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
var failureReasonSchema = z9.string().trim().min(1).max(4000).nullable();
var deliverableOperationIdSchema = uuidSchema.describe("One UUID per logical action. Persist it and the exact input; retry unchanged after a lost response. Changed input requires a new UUID.");
function textDocument(text) {
  return parseDocumentContent({
    type: "doc",
    content: text.split(/\r\n|\r|\n/).map((line) => ({
      type: "paragraph",
      ...line ? { content: [{ type: "text", text: line }] } : {}
    }))
  });
}
var deliverableDocumentInputSchema = z9.discriminatedUnion("format", [
  z9.strictObject({ format: z9.literal("json"), content: documentContentSchema }),
  z9.strictObject({
    format: z9.literal("text"),
    text: z9.string().max(DELIVERABLE_TEXT_MAX_LENGTH).describe("Plain text, including literal Markdown syntax. Newlines become paragraphs.")
  }).superRefine((value, ctx) => {
    try {
      textDocument(value.text);
    } catch {
      ctx.addIssue({ code: "custom", path: ["text"], message: "Text exceeds document size or complexity limits" });
    }
  })
]);
var deliverableRunSchema = z9.strictObject({
  runId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  issueId: uuidSchema,
  status: agentRunStatusSchema,
  createdAt: timestampSchema,
  startedAt: timestampSchema.nullable(),
  endedAt: timestampSchema.nullable()
});
var deliverableSourceSchema = z9.strictObject({
  author: z9.strictObject({ userId: uuidSchema, name: z9.string().min(1).max(512) }),
  run: deliverableRunSchema.nullable().describe("Explicit null for external submissions without a vikan run; never invent a run number.")
});
var stageCheckStatusSchema = z9.enum(["pending", "running", "passed", "failed", "skipped"]);
var stageCheckSchema = z9.strictObject({
  id: checkIdSchema,
  title: titleSchema,
  status: stageCheckStatusSchema,
  command: z9.string().max(2000).nullable(),
  detail: z9.string().max(4000).nullable()
});
var stageChecksSchema = z9.array(stageCheckSchema).max(STAGE_MAX_CHECKS).refine((checks) => new Set(checks.map((check) => check.id)).size === checks.length, "Check IDs must be unique within a batch");
var stageFileInputSchema = z9.strictObject({
  fileId: uuidSchema,
  posterFileId: uuidSchema.nullable(),
  caption: z9.string().max(2048),
  checkIds: z9.array(checkIdSchema).max(STAGE_MAX_CHECKS).refine((ids) => new Set(ids).size === ids.length, "Check references must be unique")
}).refine((file) => file.posterFileId?.toLowerCase() !== file.fileId.toLowerCase(), "A file cannot be its own poster");
var stageFileInputsSchema = z9.array(stageFileInputSchema).max(STAGE_MAX_FILES).refine((files) => new Set(files.map((file) => file.fileId.toLowerCase())).size === files.length, "Evidence file IDs must be unique");
var stageFileSchema = stageFileInputSchema.safeExtend({
  position: int32Schema.min(0).max(STAGE_MAX_FILES - 1),
  previewKind: filePreviewKindSchema
}).refine((file) => file.posterFileId === null || file.previewKind === "video", "Only a verified video may have a poster");
var stageStatusSchema = z9.enum(["running", "completed", "failed"]);
var stageCheckOutcomeSchema = z9.enum(["not_submitted", "pending", "passed", "failed", "incomplete"]);
function checkOutcome(counts) {
  if (counts.total === 0)
    return "not_submitted";
  if (counts.failed > 0)
    return "failed";
  if (counts.pending + counts.running > 0)
    return "pending";
  return counts.passed === counts.total ? "passed" : "incomplete";
}
var countSchema = int32Schema.min(0).max(STAGE_MAX_CHECKS);
var stageCheckSummarySchema = z9.strictObject({
  total: countSchema,
  pending: countSchema,
  running: countSchema,
  passed: countSchema,
  failed: countSchema,
  skipped: countSchema,
  outcome: stageCheckOutcomeSchema
}).refine((counts) => counts.total === counts.pending + counts.running + counts.passed + counts.failed + counts.skipped && counts.outcome === checkOutcome(counts), "Check counts and outcome must agree; zero checks never pass");
function summarizeStageChecks(checks) {
  const counts = { total: checks.length, pending: 0, running: 0, passed: 0, failed: 0, skipped: 0 };
  for (const check of checks)
    counts[check.status]++;
  return stageCheckSummarySchema.parse({ ...counts, outcome: checkOutcome(counts) });
}
var fileCountSchema = int32Schema.min(0).max(STAGE_MAX_FILES);
var stageFileCountsSchema = z9.strictObject({
  total: fileCountSchema,
  images: fileCountSchema,
  videos: fileCountSchema,
  attachments: fileCountSchema
}).refine((counts) => counts.total === counts.images + counts.videos + counts.attachments, "File counts must agree");
function summarizeStageFiles(files) {
  return stageFileCountsSchema.parse({
    total: files.length,
    images: files.filter((file) => file.previewKind === "image").length,
    videos: files.filter((file) => file.previewKind === "video").length,
    attachments: files.filter((file) => file.previewKind === null).length
  });
}
var issueStageKeySchema = z9.string().regex(/^[a-z][a-z0-9_-]{0,63}$/).describe("Artifact stage, for example plan, design, validation or review. No configuration is required.");
var scopeShape = { workspaceId: uuidSchema, issueId: uuidSchema };
var sourceInScope = (value) => value.source.run === null || sameId(value.source.run.workspaceId, value.workspaceId) && sameId(value.source.run.issueId, value.issueId);
var issueStageReferenceSchema = z9.strictObject({ stageId: uuidSchema, stage: issueStageKeySchema, revision: positiveVersion });
var issueStageSummarySchema = z9.strictObject({
  stageId: uuidSchema,
  ...scopeShape,
  stage: issueStageKeySchema,
  revision: positiveVersion,
  basedOn: issueStageReferenceSchema.nullable(),
  source: deliverableSourceSchema,
  title: titleSchema,
  summary: summarySchema,
  status: stageStatusSchema,
  version: positiveVersion,
  failureReason: failureReasonSchema,
  checkSummary: stageCheckSummarySchema,
  fileCounts: stageFileCountsSchema,
  previewFiles: z9.array(stageFileSchema).max(DELIVERABLE_PREVIEW_LIMIT),
  startedAt: timestampSchema,
  updatedAt: timestampSchema,
  completedAt: timestampSchema.nullable()
}).superRefine((value, ctx) => {
  if (!sourceInScope(value))
    ctx.addIssue({ code: "custom", path: ["source"], message: "Stage source run must belong to this issue and workspace" });
  const running = value.status === "running";
  if (value.completedAt === null !== running || value.failureReason !== null !== (value.status === "failed") || (running ? value.version !== 1 : value.status === "failed" ? value.version !== 2 : ![1, 2].includes(value.version)) || value.updatedAt < value.startedAt || value.completedAt !== null && (value.completedAt < value.startedAt || value.updatedAt !== value.completedAt)) {
    ctx.addIssue({ code: "custom", message: "A stage is published at version 1 and a running stage finishes once at version 2 with coherent timestamps and failure reason" });
  }
  if (value.status === "completed" && value.checkSummary.pending + value.checkSummary.running > 0) {
    ctx.addIssue({ code: "custom", path: ["checkSummary"], message: "Completed execution cannot contain unfinished checks; skipped checks remain explicit" });
  }
  if (value.previewFiles.length > value.fileCounts.total || new Set(value.previewFiles.map((file) => file.fileId.toLowerCase())).size !== value.previewFiles.length || value.previewFiles.some((file, index) => file.position >= value.fileCounts.total || index > 0 && file.position <= value.previewFiles[index - 1].position) || value.previewFiles.filter((file) => file.previewKind === "image").length > value.fileCounts.images || value.previewFiles.filter((file) => file.previewKind === "video").length > value.fileCounts.videos || value.previewFiles.filter((file) => file.previewKind === null).length > value.fileCounts.attachments) {
    ctx.addIssue({ code: "custom", path: ["previewFiles"], message: "Preview references must be an ordered subset of batch files" });
  }
});
function checkFileReferences(value, ctx) {
  const ids = new Set(value.checks.map((check) => check.id));
  value.files.forEach((file, index) => {
    if (file.checkIds.some((id) => !ids.has(id)))
      ctx.addIssue({ code: "custom", path: ["files", index, "checkIds"], message: "Evidence names a check outside this batch" });
  });
}
function boundedSubmission(value, ctx) {
  try {
    assertJsonSize(value, DELIVERABLE_BODY_MAX_BYTES, LIMITS.documentDepth * 2 + 12);
  } catch {
    ctx.addIssue({ code: "custom", message: "Deliverable submission exceeds the JSON envelope limit" });
  }
}
var issueStageSchema = issueStageSummarySchema.safeExtend({
  content: documentContentSchema,
  checks: stageChecksSchema,
  files: z9.array(stageFileSchema).max(STAGE_MAX_FILES)
}).superRefine((value, ctx) => {
  if (value.checks.length > STAGE_MAX_CHECKS || value.files.length > STAGE_MAX_FILES)
    return;
  checkFileReferences(value, ctx);
  const counts = summarizeStageChecks(value.checks);
  const files = summarizeStageFiles(value.files);
  if (Object.keys(counts).some((key) => counts[key] !== value.checkSummary[key]) || Object.keys(files).some((key) => files[key] !== value.fileCounts[key]) || new Set(value.files.map((file) => file.fileId.toLowerCase())).size !== value.files.length || value.files.some((file, index) => file.position !== index) || value.previewFiles.some((file) => JSON.stringify(file) !== JSON.stringify(value.files[file.position]))) {
    ctx.addIssue({ code: "custom", message: "Detail checks/files must agree with the summary and server ordering" });
  }
});
function completedChecks(value, ctx) {
  if (value.status === "completed" && value.checks.some((check) => check.status === "pending" || check.status === "running")) {
    ctx.addIssue({ code: "custom", path: ["checks"], message: "Completed execution requires terminal check results" });
  }
}
var publishIssueStageSubmissionSchema = z9.strictObject({
  operationId: deliverableOperationIdSchema,
  stage: issueStageKeySchema,
  expectedLatestStageId: uuidSchema.nullable().describe("Latest version of this stage, or explicit null for its first publication."),
  basedOnStageId: uuidSchema.nullable().default(null).describe("Optional explicit reference to a plan, design or other stage version in this issue."),
  title: titleSchema,
  summary: summarySchema,
  document: deliverableDocumentInputSchema,
  status: z9.enum(["running", "completed"]).default("completed"),
  checks: stageChecksSchema.default([]),
  files: stageFileInputsSchema.default([])
}).superRefine(checkFileReferences).superRefine(boundedSubmission).superRefine(completedChecks);
var publishIssueStageBodySchema = publishIssueStageSubmissionSchema.safeExtend({ sourceRunId: uuidSchema.nullable() });
var finishIssueStageSubmissionSchema = z9.strictObject({
  operationId: deliverableOperationIdSchema,
  expectedVersion: positiveVersion.max(2147483646),
  status: z9.enum(["completed", "failed"]),
  summary: summarySchema,
  document: deliverableDocumentInputSchema,
  checks: stageChecksSchema,
  files: stageFileInputsSchema,
  failureReason: failureReasonSchema
}).superRefine(checkFileReferences).superRefine(boundedSubmission).superRefine(completedChecks).superRefine((value, ctx) => {
  if (value.failureReason !== null !== (value.status === "failed")) {
    ctx.addIssue({ code: "custom", path: ["failureReason"], message: "Only execution failure requires a failure reason; check failures belong in checks" });
  }
});
var deliverableOperationResultSchema = issueStageReferenceSchema.extend({
  ...scopeShape,
  version: positiveVersion.max(2),
  status: stageStatusSchema
}).refine((value) => value.status === "running" ? value.version === 1 : value.status !== "failed" || value.version === 2, "Receipt records the committed stage version");
var deliverableOperationOutputSchema = (result) => z9.strictObject({
  operationId: uuidSchema,
  outcome: z9.literal("committed"),
  committedAt: timestampSchema,
  replayed: z9.boolean(),
  result
});
var publishIssueStageResultSchema = deliverableOperationOutputSchema(deliverableOperationResultSchema.safeExtend({
  status: z9.enum(["running", "completed"]),
  version: z9.literal(1)
}));
var finishIssueStageResultSchema = deliverableOperationOutputSchema(deliverableOperationResultSchema.safeExtend({
  status: z9.enum(["completed", "failed"]),
  version: z9.literal(2)
}));
var readShape = { protocolVersion: z9.literal(ISSUE_DELIVERABLES_PROTOCOL_VERSION), userId: uuidSchema, ...scopeShape };
function sameId(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}
function inScope(a, b) {
  return sameId(a.workspaceId, b.workspaceId) && sameId(a.issueId, b.issueId);
}
var issueStageEntrySchema = z9.strictObject({
  stage: issueStageKeySchema,
  latest: issueStageSummarySchema,
  currentRun: issueStageSummarySchema.nullable()
});
var issueDeliverablesSummarySchema = z9.strictObject({
  ...readShape,
  latestRun: deliverableRunSchema.nullable(),
  stages: z9.array(issueStageEntrySchema)
}).superRefine((value, ctx) => {
  if (value.latestRun !== null && !inScope(value.latestRun, value) || new Set(value.stages.map((entry) => entry.stage)).size !== value.stages.length) {
    ctx.addIssue({ code: "custom", message: "Summary must contain unique stages and an in-scope run" });
  }
  for (const { stage, latest, currentRun: current } of value.stages) {
    const latestIsCurrent = latest.source.run !== null && value.latestRun !== null && sameId(latest.source.run.runId, value.latestRun.runId);
    if ([latest, current].some((item) => item && (!inScope(item, value) || item.stage !== stage)) || current !== null && (!current.source.run || !value.latestRun || !sameId(current.source.run.runId, value.latestRun.runId) || current.revision > latest.revision) || latestIsCurrent && (current === null || !sameId(latest.stageId, current.stageId)) || current !== null && sameId(latest.stageId, current.stageId) && JSON.stringify(latest) !== JSON.stringify(current)) {
      ctx.addIssue({ code: "custom", path: ["stages"], message: "Historical/external stages cannot stand in for the latest run; scope and current versions must agree" });
    }
  }
});
var deliverablePageQuerySchema = z9.strictObject({
  limit: z9.coerce.number().int().min(1).max(DELIVERABLE_PAGE_MAX_LIMIT).default(DELIVERABLE_PAGE_DEFAULT_LIMIT),
  before: z9.coerce.number().int().positive().max(2147483647).optional().describe("Exclusive server-assigned revision from nextBefore, descending within this issue and stage.")
});
var issueStageVersionsSchema = z9.strictObject({
  ...readShape,
  stage: issueStageKeySchema,
  versions: z9.array(issueStageSummarySchema).max(DELIVERABLE_PAGE_MAX_LIMIT),
  nextBefore: positiveVersion.nullable()
}).refine((value) => value.versions.every((item, i) => inScope(item, value) && item.stage === value.stage && (i === 0 || item.revision < value.versions[i - 1].revision)) && (value.nextBefore === null || value.nextBefore === value.versions.at(-1)?.revision), "Stage page must have descending revisions and a matching cursor");
var issueStageDocumentSchema = z9.strictObject({ ...readShape, stage: issueStageSchema }).refine((value) => inScope(value.stage, value), "Stage document must belong to the requested scope");
function assertContext(value, context) {
  if (!sameId(value.userId, context.userId) || !inScope(value, context))
    throw new ContractError("IDENTITY_MISMATCH");
}
function parseIssueDeliverablesSummary(raw, context) {
  const value = issueDeliverablesSummarySchema.parse(raw);
  assertContext(value, context);
  return value;
}

// packages/contract/src/issue-deliverables-contract.ts
var issueDeliverableParamsSchema = z10.strictObject({ issueId: uuidSchema });
var issueStageParamsSchema = issueDeliverableParamsSchema.extend({ stage: issueStageKeySchema });
var issueStageVersionParamsSchema = issueStageParamsSchema.extend({ stageId: uuidSchema });
var deliverableReadErrors = errorSpecs("unauthenticated", "forbidden", "insufficient_scope", "not_found", "validation_failed", "output_validation_failed", "database_unavailable", "internal");
var deliverableWriteErrors = {
  ...deliverableReadErrors,
  ...errorSpecs("workspace_archived", "origin_forbidden", "invalid_content_length", "body_read_failed", "body_too_large", "unsupported_media_type", "unsupported_content_encoding", "invalid_json", "issue_stage_changed", "deliverable_reference_mismatch", "deliverable_operation_conflict", "deliverable_result_unconfirmed", "file_not_ready", "file_owner_mismatch", "stale_version", "run_invalidated")
};

// packages/contract/src/agent-deliverables.ts
var agentDeliverableClaimSchema = z11.strictObject({ sessionId: uuidSchema, claimEpoch: int32Schema.positive() });
var agentDeliverableReadQuerySchema = agentDeliverableClaimSchema.extend({ claimEpoch: z11.coerce.number().int().positive().max(2147483647) });
var agentDeliverableRunParamsSchema = z11.strictObject({ runId: uuidSchema });
var agentPublishIssueStageBodySchema = publishIssueStageSubmissionSchema.safeExtend(agentDeliverableClaimSchema.shape);
var agentFinishIssueStageBodySchema = finishIssueStageSubmissionSchema.safeExtend(agentDeliverableClaimSchema.shape);
var agentDeliverableFileMetadataSchema = agentDeliverableClaimSchema.extend({ operationId: deliverableOperationIdSchema });
function parseAgentDeliverableFileUpload(raw) {
  if (Object.prototype.toString.call(raw) !== "[object FormData]" || typeof raw.entries !== "function") {
    throw new ContractError("INVALID_FILE_UPLOAD");
  }
  const form = raw;
  const metadataFields = form.getAll("metadata");
  if (metadataFields.length !== 1 || typeof metadataFields[0] !== "string")
    throw new ContractError("INVALID_FILE_UPLOAD");
  let metadata;
  try {
    metadata = agentDeliverableFileMetadataSchema.parse(JSON.parse(metadataFields[0]));
  } catch {
    throw new ContractError("INVALID_FILE_UPLOAD");
  }
  const shared = new FormData;
  for (const [key, value] of form.entries()) {
    shared.append(key, key === "metadata" ? JSON.stringify({ operationId: metadata.operationId, owner: null }) : value);
  }
  return { metadata, file: parseFileUploadFormData(shared).file };
}
var agentDeliverableFileBodySchema = z11.custom((value) => Object.prototype.toString.call(value) === "[object FormData]", "Expected multipart FormData").superRefine((value, ctx) => {
  try {
    parseAgentDeliverableFileUpload(value);
  } catch (error) {
    ctx.addIssue({ code: "custom", message: error instanceof ContractError ? error.code : "INVALID_FILE_UPLOAD" });
  }
});
function createAgentDeliverableFileUpload(metadata, file) {
  const parsed = agentDeliverableFileMetadataSchema.parse(metadata);
  const form = createFileUploadFormData({ operationId: parsed.operationId, owner: null }, file);
  form.set("metadata", JSON.stringify(parsed));
  return form;
}
var claimErrors = errorSpecs("stale_version", "run_invalidated");

// packages/contract/src/agent-findings.ts
var FINDING_TITLE_MAX_LENGTH = 512;
var FINDING_BODY_MAX_LENGTH = 20000;
var FINDINGS_MAX_BATCH = 50;
var FINDINGS_MAX_LIST = 500;
var bodyErrors2 = errorSpecs("unsupported_media_type", "unsupported_content_encoding", "body_too_large", "invalid_json", "validation_failed", "internal");
var claimErrors2 = errorSpecs("stale_version", "run_invalidated");
var operationConflict = errorSpecs("deliverable_operation_conflict");
var agentFindingInputSchema = z12.strictObject({
  title: z12.string().trim().min(1).max(FINDING_TITLE_MAX_LENGTH),
  body: z12.string().trim().min(1).max(FINDING_BODY_MAX_LENGTH)
});
var agentFindingsManifestSchema = z12.strictObject({
  operationId: uuidSchema.describe("One UUID per logical batch. Persist it and the exact input; retry unchanged after a lost response. Changed input requires a new UUID."),
  findings: z12.array(agentFindingInputSchema).min(1).max(FINDINGS_MAX_BATCH)
});
var agentFindingsPublishSchema = agentFindingsManifestSchema.extend(agentDeliverableClaimSchema.shape);
var agentFindingsPublishResultSchema = z12.strictObject({
  runId: uuidSchema,
  workspaceId: uuidSchema,
  operationId: uuidSchema,
  outcome: z12.literal("committed"),
  committedAt: timestampSchema,
  replayed: z12.boolean(),
  count: int32Schema.min(1).max(FINDINGS_MAX_BATCH)
});
var agentFindingSchema = z12.strictObject({
  findingId: uuidSchema,
  runId: uuidSchema,
  title: z12.string().min(1).max(FINDING_TITLE_MAX_LENGTH),
  body: z12.string().min(1).max(FINDING_BODY_MAX_LENGTH),
  position: int32Schema.min(0),
  issueId: uuidSchema.nullable(),
  createdAt: timestampSchema
});
var agentFindingsSchema = z12.strictObject({
  findings: z12.array(agentFindingSchema).max(FINDINGS_MAX_LIST)
});
var agentFindingConvertSchema = z12.strictObject({
  issueId: uuidSchema
});
var agentFindingsRunParamsSchema = z12.strictObject({ runId: uuidSchema });
// packages/contract/src/agent-runtime.ts
import { z as z13 } from "zod";
var bodyErrors3 = errorSpecs("unsupported_media_type", "unsupported_content_encoding", "body_too_large", "invalid_json", "validation_failed", "internal");
var agentWriteErrors = { ...bodyErrors3, ...errorSpecs("unauthenticated", "forbidden", "not_found", "origin_forbidden") };
var herdrContextSchema = z13.strictObject({
  version: z13.string().min(1).max(40),
  protocolVersion: int32Schema.min(1),
  sessionId: z13.string().min(1).max(256),
  workspaceId: z13.string().min(1).max(256),
  tabId: z13.string().min(1).max(256),
  paneId: z13.string().min(1).max(256)
});
var sessionOnlineSchema = z13.strictObject({
  bindingId: uuidSchema,
  protocolVersion: int32Schema.min(1),
  cliVersion: z13.string().trim().min(1).max(40),
  herdr: herdrContextSchema,
  agentKinds: z13.array(z13.enum(["codex"])).min(1).max(4)
});
var sessionOpenedSchema = z13.strictObject({
  sessionId: uuidSchema,
  epoch: int32Schema.min(1),
  heartbeatIntervalSeconds: int32Schema.min(5).max(120),
  leaseExpiresAt: timestampSchema,
  connectionState: z13.enum(["online", "degraded"])
});
var sessionHeartbeatSchema = z13.strictObject({
  s2Connected: z13.boolean()
});
var sessionHeartbeatAckSchema = z13.strictObject({
  leaseExpiresAt: timestampSchema
});
var sessionOfflineSchema = z13.strictObject({ offline: z13.literal(true) });
var reconcilePhaseSchema = z13.enum([
  "prepared",
  "pane_created",
  "agent_started",
  "prompt_dispatching",
  "prompt_acknowledged",
  "unknown"
]);
var sessionReconcileSchema = z13.strictObject({
  activeRuns: z13.array(z13.strictObject({
    runId: uuidSchema,
    paneId: z13.string().min(1).max(256),
    agentName: z13.string().min(1).max(256),
    phase: reconcilePhaseSchema
  })).max(50)
});
var sessionReconciledSchema = z13.strictObject({
  decisions: z13.array(z13.strictObject({
    runId: uuidSchema,
    action: z13.enum(["resume", "stop", "needs_reconciliation"]),
    runVersion: int32Schema.min(1)
  }))
});
var agentRunSchema = z13.strictObject({
  runId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  bindingId: uuidSchema,
  issueId: uuidSchema.nullable(),
  projectDocumentId: uuidSchema.nullable().optional(),
  projectDocumentVersion: int32Schema.positive().nullable().optional(),
  trigger: z13.enum(["manual", "automation"]),
  status: agentRunStatusSchema,
  runVersion: int32Schema.min(1),
  claimEpoch: int32Schema.min(1).nullable(),
  captureEpoch: z13.string().min(8).max(128).nullable(),
  paneId: z13.string().min(1).max(256).nullable(),
  agentName: z13.string().min(1).max(256).nullable(),
  prompt: z13.string().min(1).max(65536),
  cancelRequested: z13.boolean(),
  cancelReason: z13.string().max(2000).nullable(),
  failureReason: z13.string().max(2000).nullable(),
  queuedAt: timestampSchema,
  startedAt: timestampSchema.nullable(),
  endedAt: timestampSchema.nullable(),
  retryOfRunId: uuidSchema.nullable()
});
var agentRunsSchema = z13.strictObject({ runs: z13.array(agentRunSchema).max(500) });
var runCreateSchema = z13.strictObject({
  bindingId: uuidSchema,
  issueId: uuidSchema.nullable().optional(),
  projectDocumentId: uuidSchema.nullable().optional(),
  prompt: z13.string().trim().min(1).max(65536),
  operationId: uuidSchema
});
var runClaimSchema = z13.strictObject({ sessionId: uuidSchema });
var runClaimedSchema = z13.strictObject({
  runId: uuidSchema,
  claimEpoch: int32Schema.min(1),
  runVersion: int32Schema.min(1),
  captureEpoch: z13.string().min(8).max(128)
});
var runStatusReceiptSchema = z13.strictObject({
  sessionId: uuidSchema,
  claimEpoch: int32Schema.min(1),
  expectedRunVersion: int32Schema.min(1),
  status: agentRunStatusSchema,
  reason: z13.string().max(2000).optional()
});
var runStatusReceiptAckSchema = z13.strictObject({
  runId: uuidSchema,
  runVersion: int32Schema.min(1),
  status: agentRunStatusSchema
});
var runConfirmSchema = z13.strictObject({ expectedRunVersion: int32Schema.min(1) });
var runRetrySchema = z13.strictObject({ operationId: uuidSchema });
var projectDocumentResultManifestSchema = z13.strictObject({
  expectedVersion: int32Schema.min(1),
  format: z13.enum(["markdown", "html"]),
  source: projectDocumentSourceSchema.min(1),
  operationId: uuidSchema
});
var projectDocumentResultSchema = projectDocumentResultManifestSchema.extend({
  sessionId: uuidSchema,
  claimEpoch: int32Schema.min(1)
});
var projectDocumentResultAckSchema = z13.strictObject({
  operationId: uuidSchema,
  documentId: uuidSchema,
  version: int32Schema.positive(),
  format: z13.enum(["markdown", "html"])
});
var runContextSchema = z13.strictObject({
  runId: uuidSchema,
  prompt: z13.string().min(1),
  project: z13.strictObject({ id: uuidSchema, workspaceId: uuidSchema, name: z13.string().min(1) }),
  issue: z13.strictObject({
    id: uuidSchema,
    identifier: z13.string().min(1),
    title: z13.string().min(1),
    descriptionText: z13.string(),
    comments: z13.array(z13.strictObject({
      id: uuidSchema,
      authorName: z13.string().min(1),
      body: z13.string(),
      createdAt: timestampSchema
    })).max(20)
  }).nullable(),
  projectDocument: z13.strictObject({
    id: uuidSchema,
    title: z13.string().min(1),
    version: int32Schema.positive(),
    format: z13.enum(["json", "markdown", "html"]),
    source: z13.string(),
    content: z13.unknown(),
    annotations: z13.array(z13.strictObject({
      id: uuidSchema,
      authorId: uuidSchema,
      createdAt: timestampSchema,
      start: z13.number().int().nonnegative(),
      end: z13.number().int().positive(),
      selectedText: z13.string().min(1),
      prefix: z13.string(),
      suffix: z13.string(),
      body: z13.string().min(1)
    })).max(1000)
  }).nullable().optional()
});
var commandCreateSchema = z13.strictObject({
  operationId: uuidSchema,
  kind: z13.enum(["continue", "cancel"]),
  prompt: z13.string().trim().min(1).max(65536).optional(),
  expectedRunVersion: int32Schema.min(1).optional()
}).refine((value) => value.kind === "cancel" || value.prompt !== undefined && value.expectedRunVersion !== undefined, {
  message: "A 'continue' command requires prompt and expectedRunVersion; 'cancel' is a durable intent without deadline",
  path: ["kind"]
});
var commandClaimSchema = z13.strictObject({ sessionId: uuidSchema });
var commandAckSchema = z13.strictObject({
  sessionId: uuidSchema,
  claimEpoch: int32Schema.min(1),
  outcome: z13.enum(["accepted", "failed", "rejected", "stalled"]),
  phase: reconcilePhaseSchema.optional(),
  detail: z13.string().max(2000).optional()
});
var commandAckedSchema = z13.strictObject({
  commandId: uuidSchema,
  accepted: z13.literal(true)
});
var agentCommandsSchema = z13.strictObject({ commands: z13.array(agentCommandSchema).max(500) });
var subscriptionScopeSchema = z13.discriminatedUnion("kind", [
  z13.strictObject({ kind: z13.literal("project-events"), projectId: uuidSchema }),
  z13.strictObject({ kind: z13.literal("binding-commands"), bindingId: uuidSchema }),
  z13.strictObject({ kind: z13.literal("run-events"), runId: uuidSchema }),
  z13.strictObject({ kind: z13.literal("run-screens"), runId: uuidSchema })
]);
var subscriptionRequestSchema = z13.strictObject({
  protocolVersion: int32Schema.min(1),
  sessionId: uuidSchema.optional(),
  scopes: z13.array(subscriptionScopeSchema).min(1).max(10)
});
var screenStateSchema = z13.enum(["live", "awaiting-frame", "expired"]);
var agentSubscriptionSchema = z13.discriminatedUnion("status", [
  z13.strictObject({
    status: z13.literal("active"),
    kind: z13.enum(["project-events", "binding-commands", "run-events", "run-screens"]),
    stream: z13.string().min(1).max(256),
    basin: z13.string().min(1).max(128),
    token: z13.string().min(1),
    tokenExpiresAt: timestampSchema,
    operations: z13.array(z13.enum(["read", "append", "check-tail"])).min(1).max(3),
    nextSeqNum: s2NextReadPositionSchema,
    onGap: z13.literal("refetch-authority"),
    captureEpoch: captureEpochSchema.nullable(),
    screenState: screenStateSchema.nullable()
  }),
  z13.strictObject({
    status: z13.literal("screens-pending"),
    kind: z13.literal("run-screens"),
    runId: uuidSchema,
    captureEpoch: z13.null(),
    screenState: screenStateSchema
  })
]);
var agentSubscriptionsSchema = z13.strictObject({
  subscriptions: z13.array(agentSubscriptionSchema).min(1).max(10)
});
export {
  AGENT_PROTOCOL_VERSION,
  AGENT_RUN_NON_TERMINAL_STATUSES,
  AGENT_RUN_TERMINAL_STATUSES,
  DELIVERABLE_BODY_MAX_BYTES,
  DELIVERABLE_TEXT_MAX_LENGTH,
  FILE_MAX_BYTES,
  MCP_FILE_MAX_BYTES,
  SCREEN_FRAME_MAX_BYTES,
  agentBindingCommandsStream,
  agentBindingRevokedSchema,
  agentBindingsSchema,
  agentCommandSchema,
  agentCommandsSchema,
  agentDeliverableClaimSchema,
  agentFindingsManifestSchema,
  agentFindingsPublishResultSchema,
  agentFindingsPublishSchema,
  agentFinishIssueStageBodySchema,
  agentPublishIssueStageBodySchema,
  agentRunSchema,
  agentRunScreensStream,
  agentRunStatusSchema,
  agentRunsSchema,
  agentSubscriptionsSchema,
  commandAckSchema,
  commandAckedSchema,
  commandCreateSchema,
  createAgentDeliverableFileUpload,
  deliverableDocumentInputSchema,
  fileByteSizeSchema,
  fileMimeTypeSchema,
  fileNameSchema,
  fileUploadResultSchema,
  finishIssueStageResultSchema,
  finishIssueStageSubmissionSchema,
  healthSchema,
  isUnsupportedAgentProtocolVersion,
  issueDeliverablesSummarySchema,
  linkClaimedSchema,
  linkRequestCreateSchema,
  linkRequestCreatedSchema,
  normalizeFileMimeType,
  parseApiOutput,
  parseIssueDeliverablesSummary,
  problemCode,
  problemSchema,
  projectDocumentResultAckSchema,
  projectDocumentResultManifestSchema,
  projectDocumentResultSchema,
  publishIssueStageResultSchema,
  publishIssueStageSubmissionSchema,
  runClaimedSchema,
  runContextSchema,
  runStatusReceiptAckSchema,
  runStatusReceiptSchema,
  screenFrameSchema,
  sessionHeartbeatAckSchema,
  sessionOfflineSchema,
  sessionOnlineSchema,
  sessionOpenedSchema,
  sessionReconcileSchema,
  sessionReconciledSchema,
  subscriptionRequestSchema,
  uuidSchema
};
