// Generated from @vikan/contract. Do not edit.
// packages/contract/src/sdk-runtime.ts
import { z as z22 } from "zod";

// packages/contract/src/mcp-auth.ts
import { z as z2 } from "zod";

// node_modules/@zebra-web/source/packages/contract/src/builder.ts
class ContractProcedureImpl {
  def;
  constructor(def) {
    this.def = def;
    Object.freeze(this.def);
    Object.freeze(this);
  }
  static create(method, path) {
    return new ContractProcedureImpl({
      version: 1,
      method,
      path,
      params: undefined,
      query: undefined,
      body: undefined,
      output: undefined,
      status: 200,
      errors: {},
      meta: undefined,
      mcp: undefined
    });
  }
  static fromDef(def) {
    return new ContractProcedureImpl(def);
  }
  params(schema) {
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: schema,
      query: this.def.query,
      body: this.def.body,
      output: this.def.output,
      status: this.def.status,
      errors: this.def.errors,
      meta: this.def.meta,
      mcp: this.def.mcp
    };
    return new ContractProcedureImpl(next);
  }
  query(schema) {
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: this.def.params,
      query: schema,
      body: this.def.body,
      output: this.def.output,
      status: this.def.status,
      errors: this.def.errors,
      meta: this.def.meta,
      mcp: this.def.mcp
    };
    return new ContractProcedureImpl(next);
  }
  body(schema) {
    if (this.def.method === "GET" || this.def.method === "HEAD") {
      throw new Error("Contract .body() is not allowed on GET/HEAD procedures");
    }
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: this.def.params,
      query: this.def.query,
      body: schema,
      output: this.def.output,
      status: this.def.status,
      errors: this.def.errors,
      meta: this.def.meta,
      mcp: this.def.mcp
    };
    return new ContractProcedureImpl(next);
  }
  output(schema) {
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: this.def.params,
      query: this.def.query,
      body: this.def.body,
      output: schema,
      status: this.def.status,
      errors: this.def.errors,
      meta: this.def.meta,
      mcp: this.def.mcp
    };
    return new ContractProcedureImpl(next);
  }
  status(status) {
    if (!Number.isInteger(status) || status < 100 || status > 599) {
      throw new Error(`contract: status must be an integer between 100 and 599, got ${status}`);
    }
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: this.def.params,
      query: this.def.query,
      body: this.def.body,
      output: this.def.output,
      status,
      errors: this.def.errors,
      meta: this.def.meta,
      mcp: this.def.mcp
    };
    return new ContractProcedureImpl(next);
  }
  errors(es) {
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: this.def.params,
      query: this.def.query,
      body: this.def.body,
      output: this.def.output,
      status: this.def.status,
      errors: { ...this.def.errors, ...es },
      meta: this.def.meta,
      mcp: this.def.mcp
    };
    return new ContractProcedureImpl(next);
  }
  meta(meta) {
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: this.def.params,
      query: this.def.query,
      body: this.def.body,
      output: this.def.output,
      status: this.def.status,
      errors: this.def.errors,
      meta,
      mcp: this.def.mcp
    };
    return new ContractProcedureImpl(next);
  }
  mcp(nameOrDecl, description, options) {
    let decl;
    if (typeof nameOrDecl === "string") {
      if (typeof description !== "string") {
        throw new Error("contract: .mcp() requires a name and a description string");
      }
      decl = { name: nameOrDecl, description, ...options ?? {} };
    } else {
      decl = nameOrDecl;
    }
    if (typeof decl.name !== "string" || decl.name.trim() === "") {
      throw new Error("contract: .mcp() name must be a non-empty string");
    }
    if (typeof decl.description !== "string" || decl.description.trim() === "") {
      throw new Error("contract: .mcp() description must be a non-empty string");
    }
    const next = {
      version: 1,
      method: this.def.method,
      path: this.def.path,
      params: this.def.params,
      query: this.def.query,
      body: this.def.body,
      output: this.def.output,
      status: this.def.status,
      errors: this.def.errors,
      meta: this.def.meta,
      mcp: decl
    };
    return new ContractProcedureImpl(next);
  }
}
var zc = {
  get: (path) => ContractProcedureImpl.create("GET", path),
  post: (path) => ContractProcedureImpl.create("POST", path),
  put: (path) => ContractProcedureImpl.create("PUT", path),
  patch: (path) => ContractProcedureImpl.create("PATCH", path),
  delete: (path) => ContractProcedureImpl.create("DELETE", path),
  head: (path) => ContractProcedureImpl.create("HEAD", path),
  options: (path) => ContractProcedureImpl.create("OPTIONS", path)
};
// packages/contract/src/http-values.ts
import { z } from "zod";
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
var jsonObjectSchema = z.custom((value) => {
  try {
    assertJsonSize(value, LIMITS.jsonBytes);
    return value !== null && typeof value === "object" && !Array.isArray(value);
  } catch {
    return false;
  }
}, "Expected bounded JSON object");
var uuidSchema = z.uuid();
var timestampSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/).refine((value) => Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value, "Expected canonical UTC milliseconds");
var dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Expected calendar date");
var int32Schema = z.number().int().min(-2147483648).max(2147483647);
var documentVersionSchema = int32Schema.nonnegative();

// packages/contract/src/mcp-auth.ts
var mcpScopeSchema = z2.enum(["vikan:read", "vikan:write"]);
var oauthRequestSchema = z2.object({
  response_type: z2.literal("code"),
  client_id: uuidSchema,
  redirect_uri: z2.url().max(2048),
  code_challenge: z2.string().regex(/^[A-Za-z0-9_-]{43}$/),
  code_challenge_method: z2.literal("S256"),
  resource: z2.url().max(2048),
  scope: z2.string().max(100).default("vikan:read"),
  state: z2.string().max(2048).optional()
});
var registerClientSchema = z2.object({
  client_name: z2.string().trim().min(1).max(120).default("MCP client"),
  redirect_uris: z2.array(z2.url().max(2048)).min(1).max(10),
  token_endpoint_auth_method: z2.literal("none").default("none"),
  grant_types: z2.array(z2.literal("authorization_code")).default(["authorization_code"]),
  response_types: z2.array(z2.literal("code")).default(["code"])
});
var registeredClientSchema = registerClientSchema.extend({ client_id: uuidSchema });
var tokenRequestSchema = z2.object({
  grant_type: z2.literal("authorization_code"),
  code: z2.string().min(20).max(200),
  client_id: uuidSchema,
  redirect_uri: z2.url().max(2048),
  resource: z2.url().max(2048),
  code_verifier: z2.string().regex(/^[A-Za-z0-9._~-]{43,128}$/)
});
var tokenOutputSchema = z2.object({ access_token: z2.string(), token_type: z2.literal("Bearer"), expires_in: z2.number().int(), scope: z2.string() });
var mcpWorkspaceSchema = z2.object({ id: uuidSchema, name: z2.string(), role: z2.string(), archived: z2.boolean() });
var consentContextSchema = z2.object({
  client: z2.object({ id: uuidSchema, name: z2.string(), redirectUri: z2.string() }),
  workspaces: z2.array(mcpWorkspaceSchema),
  canRequestWrite: z2.boolean()
});
var approveSchema = oauthRequestSchema.extend({ workspaceId: uuidSchema.optional(), access: mcpScopeSchema, approve: z2.boolean() });
var redirectSchema = z2.object({ redirectUrl: z2.url() });
var grantSchema = z2.object({ id: uuidSchema, clientName: z2.string(), workspaceId: uuidSchema, scope: mcpScopeSchema, createdAt: z2.string(), expiresAt: z2.string(), revokedAt: z2.string().nullable() });
var grantsSchema = z2.object({ grants: z2.array(grantSchema), endpoint: z2.url() });
var revokedSchema = z2.object({ revoked: z2.literal(true) });
var mcpIdentitySchema = z2.object({ user: z2.object({ id: uuidSchema, name: z2.string() }), workspace: z2.object({ id: uuidSchema, name: z2.string(), role: z2.string(), archived: z2.boolean() }), scope: mcpScopeSchema });
var oauthMetadataSchema = z2.object({ issuer: z2.url(), authorization_endpoint: z2.url(), token_endpoint: z2.url(), registration_endpoint: z2.url(), scopes_supported: z2.array(z2.string()), response_types_supported: z2.array(z2.string()), grant_types_supported: z2.array(z2.string()), token_endpoint_auth_methods_supported: z2.array(z2.string()), code_challenge_methods_supported: z2.array(z2.string()), authorization_response_iss_parameter_supported: z2.boolean() });
var resourceMetadataSchema = z2.object({ resource: z2.url(), authorization_servers: z2.array(z2.url()), scopes_supported: z2.array(z2.string()), bearer_methods_supported: z2.array(z2.string()) });
var mcpAuthContract = {
  register: zc.post("/mcp/oauth/register").body(registerClientSchema).output(registeredClientSchema).status(201),
  token: zc.post("/mcp/oauth/token").body(tokenRequestSchema).output(tokenOutputSchema),
  context: zc.get("/mcp/oauth/context").query(oauthRequestSchema).output(consentContextSchema),
  approve: zc.post("/mcp/oauth/approve").body(approveSchema).output(redirectSchema),
  grants: zc.get("/mcp/grants").output(grantsSchema),
  revoke: zc.post("/mcp/grants/:grantId/revoke").params(z2.object({ grantId: uuidSchema })).body(z2.object({})).output(revokedSchema),
  identity: zc.get("/mcp/tools/identity").output(mcpIdentitySchema).mcp("vikan_identity", "Read the authenticated user and the single workspace granted to this connection. Only server-saved data is available.", { readOnly: true })
};
var mcpMetadataContract = {
  resource: zc.get("/.well-known/oauth-protected-resource/api/mcp").output(resourceMetadataSchema),
  authorization: zc.get("/.well-known/oauth-authorization-server").output(oauthMetadataSchema)
};
var mcpTransportContract = {
  post: zc.post("/api/mcp").output(z2.unknown()),
  get: zc.get("/api/mcp").output(z2.unknown()),
  delete: zc.delete("/api/mcp").output(z2.unknown())
};

// packages/contract/src/mcp-read.ts
import { z as z8 } from "zod";

// packages/contract/src/api-errors.ts
import { z as z3 } from "zod";
var API_PROBLEM_TYPE_BASE = "https://errors.zebra.dev/";
var API_ERROR_STATUS = {
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
var apiErrorCodeSchema = z3.enum(API_ERROR_CODES);
function problemCode(type) {
  if (!type.startsWith(API_PROBLEM_TYPE_BASE))
    return null;
  const code = type.slice(API_PROBLEM_TYPE_BASE.length);
  return code in API_ERROR_STATUS ? code : null;
}
function errorSpecs(...codes) {
  return Object.fromEntries(codes.map((code) => [code, { status: API_ERROR_STATUS[code] }]));
}
var problemValidationIssueSchema = z3.strictObject({
  path: z3.string(),
  message: z3.string()
});
var problemSchema = z3.strictObject({
  type: z3.string().min(1),
  status: z3.number().int().min(400).max(599),
  title: z3.string(),
  detail: z3.unknown().optional(),
  instance: z3.string().min(1),
  errors: z3.array(problemValidationIssueSchema).optional()
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

// packages/contract/src/mutation-args/issues.ts
import { z as z7 } from "zod";

// packages/contract/src/http-document.ts
import { z as z6 } from "zod";

// packages/contract/src/issue-references.ts
import { z as z4 } from "zod";
var issueReferenceIdentifierSchema = z4.string().regex(/^[A-Z0-9]{1,10}-[1-9][0-9]{0,9}$/, "Expected workspace prefix and number, such as VIK-123").refine((value) => Number(value.slice(value.indexOf("-") + 1)) <= 2147483647, "Issue number out of range");
var issueReferenceAttrsSchema = z4.strictObject({
  issueId: uuidSchema,
  identifier: issueReferenceIdentifierSchema
});

// packages/contract/src/files.ts
import { z as z5 } from "zod";
var FILE_MAX_BYTES = 50 * 1024 * 1024;
var FILE_MULTIPART_MAX_BYTES = 51 * 1024 * 1024;
var MCP_FILE_MAX_BYTES = 5 * 1024 * 1024;
var MCP_FILE_BODY_MAX_BYTES = 8 * 1024 * 1024;
var FILE_NAME_MAX_LENGTH = 255;
var FILE_LIST_DEFAULT_LIMIT = 25;
var FILE_LIST_MAX_LIMIT = 50;
var FILE_FALLBACK_MIME_TYPE = "application/octet-stream";
var filePreviewKindSchema = z5.enum(["image", "video"]).nullable();
var fileOwnerTypeSchema = z5.enum(["issue", "project_document"]);
var fileOwnerSchema = z5.strictObject({ type: fileOwnerTypeSchema, externalId: uuidSchema });
var fileNameSchema = z5.string().min(1).max(FILE_NAME_MAX_LENGTH).refine((name) => name.trim().length > 0 && name !== "." && name !== ".." && !/[\\/:\u0000-\u001f\u007f-\u009f]/u.test(name), "Expected a filename without paths or control characters");
var fileByteSizeSchema = z5.number().int().nonnegative().max(FILE_MAX_BYTES);
var fileMimeTypeSchema = z5.string().max(255).regex(/^[a-z0-9!#$%&'*+.^_`|~-]+\/[a-z0-9!#$%&'*+.^_`|~-]+$/);
var fileMetadataSchema = z5.strictObject({
  fileId: uuidSchema,
  workspaceId: uuidSchema,
  uploaderId: uuidSchema,
  owner: fileOwnerSchema.nullable(),
  filename: fileNameSchema,
  mimeType: fileMimeTypeSchema,
  previewKind: filePreviewKindSchema,
  byteSize: fileByteSizeSchema,
  status: z5.literal("ready"),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  readyAt: timestampSchema
}).refine((file) => file.previewKind === null || (file.previewKind === "image" ? ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.mimeType) : ["video/mp4", "video/webm"].includes(file.mimeType)), "Inconsistent preview capability");
var fileUploadMetadataSchema = z5.strictObject({
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
var fileUploadBodySchema = z5.custom(isFormData, "Expected multipart FormData").superRefine((value, ctx) => {
  try {
    parseFileUploadFormData(value);
  } catch (error) {
    ctx.addIssue({ code: "custom", message: error instanceof ContractError ? error.code : "INVALID_FILE_UPLOAD" });
  }
});
var fileUploadResultSchema = z5.strictObject({
  operationId: uuidSchema,
  replayed: z5.boolean(),
  file: fileMetadataSchema
});
var fileListQuerySchema = fileOwnerSchema.extend({
  limit: z5.coerce.number().int().min(1).max(FILE_LIST_MAX_LIMIT).default(FILE_LIST_DEFAULT_LIMIT),
  cursor: uuidSchema.optional().describe("Last fileId from the previous page with the same owner; ascending UUID order.")
});
var fileListResultSchema = z5.strictObject({
  files: z5.array(fileMetadataSchema).max(FILE_LIST_MAX_LIMIT),
  nextCursor: uuidSchema.nullable()
});
var fileDispositionSchema = z5.enum(["inline", "attachment"]);
var fileContentQuerySchema = z5.strictObject({ disposition: fileDispositionSchema.default("attachment") });
var fileContentResultSchema = z5.strictObject({
  fileId: uuidSchema,
  url: z5.url({ protocol: /^https?$/ }),
  expiresAt: timestampSchema,
  disposition: fileDispositionSchema
});
var fileNodeAttrsSchema = z5.strictObject({
  fileId: uuidSchema,
  display: z5.enum(["auto", "attachment"]).optional(),
  alt: z5.string().max(2048).nullable().optional()
});

// packages/contract/src/http-document.ts
var DOCUMENT_PROTOCOL_VERSION = 1;
var DOCUMENT_NODES = ["doc", "paragraph", "text", "heading", "blockquote", "bulletList", "orderedList", "listItem", "taskList", "taskItem", "codeBlock", "hardBreak", "horizontalRule", "issueReference", "file"];
var DOCUMENT_MARKS = ["bold", "italic", "strike", "underline", "code", "link"];
var linkAttrs = z6.strictObject({
  href: z6.string().max(8192).refine((value) => {
    const clean = value.replace(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g, "");
    return !clean || /^(?:(?:https?|ftps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z0-9+.\-]+(?:[^a-z+.\-:]|$))/i.test(clean);
  }, "Unsafe link"),
  target: z6.string().nullable().optional(),
  rel: z6.string().nullable().optional(),
  class: z6.string().nullable().optional(),
  title: z6.string().nullable().optional()
});
var markSchema = z6.union([
  z6.strictObject({ type: z6.enum(["bold", "italic", "strike", "underline", "code"]), attrs: z6.strictObject({}).optional() }),
  z6.strictObject({ type: z6.literal("link"), attrs: linkAttrs })
]);
var EMPTY_DOCUMENT = { type: "doc", content: [{ type: "paragraph" }] };
var nodeSchema = z6.lazy(() => z6.strictObject({
  type: z6.enum(DOCUMENT_NODES),
  text: z6.string().min(1).optional(),
  attrs: z6.record(z6.string(), z6.union([z6.string(), z6.number(), z6.boolean(), z6.null()])).optional(),
  marks: z6.array(markSchema).max(DOCUMENT_MARKS.length).optional(),
  content: z6.array(nodeSchema).optional()
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
var documentContentSchema = z6.unknown().transform((raw, ctx) => {
  try {
    return parseDocumentContent(raw);
  } catch {
    ctx.addIssue({ code: "custom", message: "Invalid document JSON" });
    return z6.NEVER;
  }
});
var documentSchema = z6.strictObject({
  protocolVersion: z6.literal(DOCUMENT_PROTOCOL_VERSION),
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
var updateIssueDescriptionArgsSchema = z6.strictObject({
  id: uuidSchema,
  content: documentContentSchema,
  expectedVersion: documentVersionSchema.max(2147483646)
});
var documentDraftSchema = z6.strictObject({
  formatVersion: z6.literal(1),
  userId: uuidSchema,
  issueId: uuidSchema,
  content: documentContentSchema,
  baseVersion: documentVersionSchema.nullable(),
  localRevision: z6.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  updatedAt: timestampSchema,
  recovery: z6.enum(["none", "unbased", "conflict"])
}).refine((value) => value.baseVersion !== null || value.recovery === "unbased", "Unknown base requires explicit recovery");
var PROJECT_DOCUMENT_PROTOCOL_VERSION = 1;
var PROJECT_DOCUMENT_TITLE_MAX_LENGTH = 512;
var projectDocumentTitleSchema = z6.string().trim().min(1).max(PROJECT_DOCUMENT_TITLE_MAX_LENGTH);
var projectDocumentSchema = z6.strictObject({
  protocolVersion: z6.literal(PROJECT_DOCUMENT_PROTOCOL_VERSION),
  userId: uuidSchema,
  documentId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  title: projectDocumentTitleSchema,
  content: documentContentSchema,
  version: documentVersionSchema.positive(),
  updatedAt: timestampSchema
});

// packages/contract/src/mutation-args/issues.ts
var activityId = uuidSchema.optional();
function isRealCalendarDay(value) {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (year < 1)
    return false;
  const probe = new Date(Date.UTC(year, month - 1, day));
  return probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day;
}
var calendarDaySchema = z7.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a calendar day, YYYY-MM-DD").refine(isRealCalendarDay, "must name a real calendar day");
var ISSUE_TITLE_MAX_LENGTH = 512;
var issueTitleSchema = z7.string().trim().min(1, "A title is required.").max(ISSUE_TITLE_MAX_LENGTH, "Title must be 512 characters or fewer (after trimming).");
var createIssueArgsSchema = z7.object({
  id: uuidSchema,
  teamId: uuidSchema,
  title: issueTitleSchema,
  stateId: uuidSchema,
  priority: z7.number().int().min(0).max(4).optional(),
  assigneeId: uuidSchema.optional(),
  cycleId: uuidSchema.optional(),
  projectId: uuidSchema,
  milestoneId: uuidSchema.optional(),
  dueDate: calendarDaySchema.optional(),
  parentId: uuidSchema.optional(),
  labelIds: z7.array(uuidSchema).max(50).optional(),
  sortOrder: z7.string().min(1).max(128),
  activityId
});
var updateIssueStateArgsSchema = z7.object({
  expectedMutationId: uuidSchema.optional(),
  id: uuidSchema,
  stateId: uuidSchema,
  activityId
});
var updateIssueTitleArgsSchema = z7.object({
  id: uuidSchema,
  title: issueTitleSchema,
  activityId
});
var updateIssuePriorityArgsSchema = z7.object({
  expectedMutationId: uuidSchema.optional(),
  id: uuidSchema,
  priority: z7.number().int().min(0).max(4),
  activityId
});
var updateIssueAssigneeArgsSchema = z7.object({
  expectedMutationId: uuidSchema.optional(),
  id: uuidSchema,
  assigneeId: uuidSchema.nullable(),
  activityId
});
var updateIssueDueDateArgsSchema = z7.object({
  id: uuidSchema,
  dueDate: calendarDaySchema.nullable(),
  activityId
});
var updateIssueCycleArgsSchema = z7.object({ id: uuidSchema, cycleId: uuidSchema.nullable(), activityId });
var updateIssueEstimateArgsSchema = z7.object({
  id: uuidSchema,
  estimate: z7.number().int().min(0).max(32767).nullable(),
  activityId
});
var updateIssueParentArgsSchema = z7.object({
  id: uuidSchema,
  parentId: uuidSchema.nullable(),
  activityId
});
var reorderIssueArgsSchema = z7.object({
  id: uuidSchema,
  sortOrder: z7.string().min(1).max(128),
  prevId: uuidSchema.optional(),
  nextId: uuidSchema.optional(),
  activityId
});
var restoreIssueArgsSchema = z7.object({
  id: uuidSchema,
  activityId,
  reattachments: z7.array(z7.object({ issueId: uuidSchema, activityId: uuidSchema })).optional()
});
var deleteIssueArgsSchema = z7.object({
  id: uuidSchema,
  activityId,
  detachments: z7.array(z7.object({ issueId: uuidSchema, activityId: uuidSchema })).optional()
});
var updateIssueProjectArgsSchema = z7.object({
  id: uuidSchema,
  projectId: uuidSchema,
  milestoneId: uuidSchema.nullable(),
  expectedProjectId: uuidSchema.nullable().optional(),
  expectedMilestoneId: uuidSchema.nullable().optional(),
  activityId
});

// packages/contract/src/mcp-read.ts
var mcpIssueReferenceSchema = z8.string().trim().min(1).max(100).describe("Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.");
var page = { limit: z8.coerce.number().int().min(1).max(50).default(25), cursor: uuidSchema.optional().describe("nextCursor from the previous page, with the same filters. Stable UUID ascending order.") };
var source = { dataSource: z8.literal("server-committed"), readAt: timestampSchema };
var nullableId = uuidSchema.nullable();
var mcpIssueSummarySchema = z8.object({
  id: uuidSchema,
  identifier: z8.string(),
  webUrl: z8.url(),
  teamId: uuidSchema,
  teamKey: z8.string(),
  workspaceId: uuidSchema,
  title: z8.string(),
  stateId: uuidSchema,
  priority: z8.number().int(),
  assigneeId: nullableId,
  dueDate: z8.string().nullable(),
  estimate: z8.number().nullable(),
  parentId: nullableId,
  cycleId: nullableId,
  projectId: uuidSchema,
  milestoneId: nullableId,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  archivedAt: timestampSchema.nullable(),
  deletedAt: timestampSchema.nullable()
});
var mcpFindIssuesQuery = z8.strictObject({
  ...page,
  query: z8.string().trim().max(300).optional().describe("Workspace issue number, workspace prefix + number, UUID, or case-insensitive literal title keywords. No body search."),
  assigneeId: z8.union([uuidSchema, z8.literal("me"), z8.literal("unassigned")]).optional(),
  stateId: uuidSchema.optional(),
  stateType: z8.enum(["triage", "backlog", "unstarted", "started", "completed", "canceled"]).optional(),
  projectId: uuidSchema.optional().describe("Exact project ID from workspace_metadata kind=projects. Completed and canceled projects remain readable. Omit to remove only the project filter."),
  milestoneId: uuidSchema.optional().describe("Exact milestone ID from workspace_metadata kind=milestones for the supplied projectId. Requires projectId and must belong to that project. Omit to search all milestones in the selected project."),
  cycleId: z8.union([uuidSchema, z8.literal("unassigned")]).optional().describe('Exact Cycle ID from workspace_metadata kind=cycles, or "unassigned" for issues with no Cycle at all (their cycleId is null). Historical cycles are readable. Omit to remove only the Cycle filter.'),
  labelId: uuidSchema.optional().describe("Exact available label ID from workspace_metadata kind=labels; same-name labels are distinguished by ID and namespace. Omit to remove only the label filter."),
  dueBefore: calendarDaySchema.optional().describe('Match only issues whose dueDate is strictly earlier than this calendar day (YYYY-MM-DD). Pass an explicit day to express overdue; the server never infers a timezone or your today. Cannot be combined with dueDate "none", and dueFrom must be earlier when both are given.'),
  dueFrom: calendarDaySchema.optional().describe("Inclusive first calendar day (YYYY-MM-DD) of a due-date range. Set it with dueTo; use the same day for both to list issues due that day."),
  dueTo: calendarDaySchema.optional().describe("Inclusive last calendar day (YYYY-MM-DD) of a due-date range; never earlier than dueFrom."),
  dueDate: z8.literal("none").optional().describe('Pass exactly "none" to match only issues with no due date at all (dueDate null). Cannot be combined with dueBefore, dueFrom or dueTo; omit every date condition to leave due dates unrestricted.'),
  priority: z8.coerce.number().int().min(0).max(4).optional(),
  parentId: uuidSchema.optional().describe("List the children of this issue.")
}).refine((value) => value.milestoneId === undefined || value.projectId !== undefined, { path: ["projectId"], message: "Supply the parent projectId when filtering by milestoneId. Obtain projects and their milestones from workspace_metadata." }).refine((value) => value.dueDate !== "none" || value.dueBefore === undefined && value.dueFrom === undefined && value.dueTo === undefined, { path: ["dueDate"], message: 'dueDate "none" cannot be combined with dueBefore, dueFrom or dueTo; no issue can both have a due date and have none.' }).refine((value) => value.dueFrom === undefined || value.dueTo === undefined || value.dueFrom <= value.dueTo, { path: ["dueTo"], message: "dueTo must not be earlier than dueFrom; no calendar day can be inside an inverted range." }).refine((value) => value.dueFrom === undefined || value.dueBefore === undefined || value.dueFrom < value.dueBefore, { path: ["dueFrom"], message: "dueFrom must be earlier than dueBefore; no due date can be earlier than dueBefore and on or after dueFrom at the same time." });
var mcpReferenceParams = z8.object({ reference: mcpIssueReferenceSchema });
var mcpDocumentQuery = z8.object({
  format: z8.enum(["text", "json"]).default("text"),
  offset: z8.coerce.number().int().min(0).default(0),
  limit: z8.coerce.number().int().min(1).max(12000).default(6000),
  version: z8.coerce.number().int().min(0).optional().describe("Pin the version from the first chunk; a change returns document_changed. Offsets count UTF-16 code units; concatenate chunks before parsing JSON.")
});
var mcpDocumentChunkSchema = z8.object({
  ...source,
  issueId: uuidSchema,
  version: z8.number().int().nonnegative(),
  updatedAt: timestampSchema.nullable(),
  format: z8.enum(["text", "json"]),
  content: z8.string(),
  offset: z8.number().int(),
  totalLength: z8.number().int(),
  complete: z8.boolean(),
  nextOffset: z8.number().int().nullable()
});
var mcpCommentSchema = z8.object({ id: uuidSchema, issueId: uuidSchema, authorId: uuidSchema, authorName: z8.string(), body: z8.string(), parentCommentId: nullableId, createdAt: timestampSchema, updatedAt: timestampSchema });
var metadataKind = z8.enum(["states", "members", "labels", "cycles", "projects", "milestones"]);
var mcpMetadataQuery = z8.object({
  ...page,
  kind: metadataKind,
  query: z8.string().trim().max(300).optional(),
  projectId: uuidSchema.optional().describe("Required for milestones: exact parent project ID from projects metadata. Not used for other kinds.")
}).refine((value) => value.kind !== "milestones" || value.projectId !== undefined, { path: ["projectId"], message: "Choose a project from workspace_metadata kind=projects, then supply its projectId to list milestones." });
var mcpMetadataItemSchema = z8.object({
  id: uuidSchema,
  name: z8.string(),
  kind: metadataKind,
  workspaceId: uuidSchema,
  teamId: nullableId,
  teamKey: z8.string().nullable(),
  projectId: nullableId,
  stateType: z8.string().nullable(),
  email: z8.string().nullable(),
  role: z8.string().nullable(),
  color: z8.string().nullable(),
  startsAt: timestampSchema.nullable(),
  endsAt: timestampSchema.nullable(),
  updatedAt: timestampSchema.nullable()
});
var errors = errorSpecs("unauthenticated", "not_found", "validation_failed", "internal");
var saved = "Reads only server-committed data; browser drafts and queued offline changes are excluded. ";
var mcpReadContract = {
  findIssues: zc.get("/mcp/tools/issues").query(mcpFindIssuesQuery).output(z8.object({ ...source, items: z8.array(mcpIssueSummarySchema), nextCursor: nullableId })).errors(errors).mcp("vikan_find_issues", saved + 'Find issues in the granted workspace by UUID, workspace prefix + number, or title keywords and combined filters. projectId, milestoneId, cycleId and labelId use exact IDs from workspace_metadata; cycleId also accepts "unassigned" to list only issues with no Cycle, which needs no cycles to exist. Due dates filter on explicit YYYY-MM-DD calendar days, never a server-guessed today: dueBefore matches strictly earlier days, dueFrom/dueTo an inclusive range (the same day for both lists that day), and dueDate "none" only issues with no due date. All intersect with assigneeId=me, state and every other supplied filter. milestoneId requires its parent projectId; discover milestones with kind=milestones and that projectId. Historical cycles and completed/canceled projects are readable. Unavailable, mismatched or out-of-workspace filter IDs return no matches, never an unfiltered list. Follow nextCursor with the same filters until null; lists omit descriptions/comments. Use parentId to page children.', { readOnly: true }),
  getIssue: zc.get("/mcp/tools/issues/:reference").params(mcpReferenceParams).output(z8.object({ ...source, issue: mcpIssueSummarySchema, parent: mcpIssueSummarySchema.nullable(), labelIds: z8.array(uuidSchema), description: mcpDocumentChunkSchema })).errors(errors).mcp("vikan_get_issue", saved + "Read current attributes, parent, labels and a bounded saved description preview with its version. Follow description.nextOffset with get_issue_document; list children using find_issues parentId; comments and directed relations have separate tools.", { readOnly: true }),
  getDocument: zc.get("/mcp/tools/issues/:reference/document").params(mcpReferenceParams).query(mcpDocumentQuery).output(mcpDocumentChunkSchema).errors({ ...errors, ...errorSpecs("document_changed") }).mcp("vikan_get_issue_document", saved + "Read a complete saved description as paginated plain text or serialized rich-text JSON. Follow nextOffset until null and supply the first version on every continuation. Missing documents explicitly have version 0; failures are errors.", { readOnly: true }),
  listComments: zc.get("/mcp/tools/issues/:reference/comments").params(mcpReferenceParams).query(z8.object(page)).output(z8.object({ ...source, items: z8.array(mcpCommentSchema), nextCursor: nullableId })).errors(errors).mcp("vikan_list_issue_comments", saved + "Page saved discussion, including authors, full comment text and reply parent IDs. Follow nextCursor until null; UUID order is stable, not a promise of chronological order.", { readOnly: true }),
  listRelations: zc.get("/mcp/tools/issues/:reference/relations").params(mcpReferenceParams).query(z8.object(page)).output(z8.object({ ...source, items: z8.array(z8.object({ id: uuidSchema, type: z8.string(), direction: z8.enum(["outgoing", "incoming"]), fromIssueId: uuidSchema, toIssueId: uuidSchema, otherIssue: mcpIssueSummarySchema, createdAt: timestampSchema })), nextCursor: nullableId })).errors(errors).mcp("vikan_list_issue_relations", saved + "Page incoming and outgoing relations. fromIssueId blocks toIssueId for a blocks relation; direction is relative to the requested issue. Only endpoints inside the granted workspace are returned.", { readOnly: true }),
  metadata: zc.get("/mcp/tools/metadata").query(mcpMetadataQuery).output(z8.object({ ...source, items: z8.array(mcpMetadataItemSchema), nextCursor: nullableId })).errors(errors).mcp("vikan_workspace_metadata", saved + "Page available states, members, labels, cycles, projects or milestones for the granted workspace. For milestones, supply a projectId obtained from projects metadata; each milestone includes its parent projectId. IDs and parent/namespace fields distinguish same-name objects; never choose an ambiguous name automatically. Follow nextCursor with the same filters until null; items=[] explicitly means no matches.", { readOnly: true })
};

// packages/contract/src/mcp-write.ts
import { z as z10 } from "zod";

// packages/contract/src/mcp-operations.ts
import { z as z9 } from "zod";
var MCP_BODY_MAX_BYTES = 2 * 1024 * 1024;
var mcpOperationIdSchema = uuidSchema.describe("A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.");
var mcpOperationOutputSchema = (result) => z9.object({
  operationId: uuidSchema,
  outcome: z9.literal("committed"),
  committedAt: timestampSchema,
  replayed: z9.boolean(),
  result
});
var mcpOperationFailureSchema = z9.object({
  operationId: uuidSchema,
  outcome: z9.enum(["rejected", "unconfirmed"]),
  code: z9.string(),
  retriable: z9.boolean(),
  guidance: z9.string(),
  details: z9.unknown().optional(),
  originalInput: z9.unknown().optional()
});
var mcpWriteErrors = errorSpecs("unauthenticated", "insufficient_scope", "forbidden", "not_found", "validation_failed", "mcp_rejected", "mcp_result_unconfirmed");

// packages/contract/src/mcp-write.ts
var mcpTextDescriptionSchema = z10.strictObject({
  format: z10.literal("text").describe("Only plain text is supported. Markdown syntax is stored literally, without formatting."),
  text: z10.string().max(1e5).describe("Empty string clears the saved description. Newlines are retained.")
});
var fields = {
  title: issueTitleSchema.optional(),
  stateId: uuidSchema.optional().describe("Exact state ID from workspace_metadata; names are not accepted."),
  priority: z10.number().int().min(0).max(4).optional(),
  assigneeId: uuidSchema.nullable().optional(),
  dueDate: calendarDaySchema.nullable().optional(),
  cycleId: uuidSchema.nullable().optional(),
  estimate: z10.number().int().min(0).max(32767).nullable().optional(),
  projectId: uuidSchema.optional().describe("Exact project ID from workspace_metadata kind=projects. Omit to retain the project; null is forbidden. Changing project clears an omitted milestone."),
  milestoneId: uuidSchema.nullable().optional().describe("Exact milestone ID belonging to the selected project; null clears the milestone while retaining the project. Omit to retain it unless changing project."),
  labelIds: z10.array(uuidSchema).max(50).optional().describe("Replace the complete label set; [] clears it. Omit to retain current labels.")
};
var mcpCreateIssueBodySchema = z10.strictObject({
  operationId: mcpOperationIdSchema,
  ...fields,
  title: issueTitleSchema,
  projectId: z10.uuid({ error: "Choose a project from workspace_metadata kind=projects and supply its projectId; every task requires a project." }).describe("Required exact project ID from workspace_metadata kind=projects. Always explicitly choose a project, including for a child task."),
  teamId: uuidSchema.optional().describe("Historical namespace ID. May be omitted only when the workspace has one namespace; ambiguity returns choices."),
  description: mcpTextDescriptionSchema.optional()
});
var mcpUpdateIssueBodySchema = z10.strictObject({
  operationId: mcpOperationIdSchema,
  ...fields,
  description: mcpTextDescriptionSchema.extend({ expectedVersion: z10.number().int().min(0).max(2147483646).describe("Version read from get_issue or get_issue_document. A conflict never overwrites saved content.") }).optional()
}).refine((value) => Object.keys(value).some((key) => key !== "operationId"), "Submit at least one field to change.");
var mcpSavedIssueSchema = z10.object({ issue: mcpIssueSummarySchema, labelIds: z10.array(uuidSchema), descriptionVersion: z10.number().int().nonnegative() });
var mcpWriteContract = {
  createIssue: zc.post("/mcp/tools/issues/create").body(mcpCreateIssueBodySchema).output(mcpOperationOutputSchema(mcpSavedIssueSchema)).errors(mcpWriteErrors).mcp("vikan_create_issue", "Create one complete task atomically in the granted workspace, using stable candidate IDs from workspace_metadata. A projectId is required; discover projects and their optional milestones first. The server assigns identity, number and ordering. Supports plain text descriptions only. Persist operationId and retry identical input to confirm a lost response. Output records the original committed result.", { readOnly: false }),
  updateIssue: zc.post("/mcp/tools/issues/:reference/update").params(mcpReferenceParams).body(mcpUpdateIssueBodySchema).output(mcpOperationOutputSchema(mcpSavedIssueSchema)).errors(mcpWriteErrors).mcp("vikan_update_issue", "Atomically update only submitted task fields. Omitted fields stay unchanged; null clears nullable fields and [] clears labels. projectId cannot be null. Changing project clears an omitted milestone; an explicit milestone must belong to the new project. milestoneId=null retains the project. Use exact metadata IDs, never guess ambiguous names. Description edits require the saved version and plain text format. Keep unsaved content on conflict, reread, and submit a new operationId after resolving. Retry unchanged input with its original operationId after a lost response.", { readOnly: false })
};

// packages/contract/src/mcp-planning.ts
import { z as z11 } from "zod";
var mcpCreateSubissuesBodySchema = z11.strictObject({
  items: z11.array(mcpCreateIssueBodySchema).min(1).max(20).describe("Each child has its own operationId and required explicit projectId; project and milestone are not inherited. Omitted teamId inherits the parent namespace; supply a sibling namespace ID to choose another. Each child commits independently.")
}).superRefine((value, ctx) => {
  const seen = new Set;
  value.items.forEach((item, index) => {
    const id = item.operationId.toLowerCase();
    if (seen.has(id))
      ctx.addIssue({ code: "custom", path: ["items", index, "operationId"], message: "Use a distinct operationId for each child." });
    seen.add(id);
  });
});
var mcpSubissueReceiptSchema = z11.union([
  mcpOperationOutputSchema(mcpSavedIssueSchema),
  mcpOperationFailureSchema,
  z11.object({ operationId: uuidSchema, outcome: z11.literal("not_started"), guidance: z11.string(), originalInput: z11.unknown() })
]);
var mcpCreateSubissuesOutputSchema = z11.object({
  parent: mcpIssueSummarySchema,
  outcome: z11.enum(["committed", "partial", "rejected", "unconfirmed"]),
  items: z11.array(z11.object({ index: z11.number().int().nonnegative(), title: z11.string(), receipt: mcpSubissueReceiptSchema }))
});
var mcpSetParentBodySchema = z11.strictObject({ operationId: mcpOperationIdSchema, parentReference: mcpIssueReferenceSchema.nullable().describe("Parent workspace issue number, workspace prefix + number, or UUID; null to detach. Existing issue identities and numbers are preserved.") });
var mcpParentResultSchema = z11.object({ issue: mcpIssueSummarySchema, parent: mcpIssueSummarySchema.nullable() });
var mcpSetBlockingBodySchema = z11.strictObject({
  operationId: mcpOperationIdSchema,
  blockedReference: mcpIssueReferenceSchema.describe("The task blocked BY params.reference. Never reverse this direction."),
  enabled: z11.boolean().describe("true explicitly adds the hard dependency; false removes that directed blocks edge.")
});
var mcpBlockingResultSchema = z11.object({
  blocker: mcpIssueSummarySchema,
  blocked: mcpIssueSummarySchema,
  relation: z11.object({ id: uuidSchema, type: z11.literal("blocks"), fromIssueId: uuidSchema, toIssueId: uuidSchema, createdAt: timestampSchema }).nullable()
});
var mcpPlanningContract = {
  createSubissues: zc.post("/mcp/tools/issues/:reference/subissues").params(mcpReferenceParams).body(mcpCreateSubissuesBodySchema).output(mcpCreateSubissuesOutputSchema).errors(mcpWriteErrors).mcp("vikan_create_subissues", "Create up to 20 children under the existing parent in params.reference. Each item is an independent atomic action with its own operationId and receipt. Inspect EVERY item: a later rejection does not undo earlier children, and unconfirmed results stop subsequent items. Entirely rejected or unconfirmed batches are tool errors whose Problem detail contains the full item results. Retry the identical items with their original operationIds to reconcile lost responses without duplicate tasks. Omitted teamId inherits the parent namespace. Creating children does not add any blocking dependencies.", { readOnly: false }),
  setParent: zc.post("/mcp/tools/issues/:reference/parent").params(mcpReferenceParams).body(mcpSetParentBodySchema).output(mcpOperationOutputSchema(mcpParentResultSchema)).errors(mcpWriteErrors).mcp("vikan_set_issue_parent", "Attach an existing issue to parentReference, or detach with null. Both tasks must belong to the granted workspace; sibling historical namespaces are supported. Preserve original IDs and numbers. Existing self-parent, cycle and maximum-depth rules are enforced. Retry unchanged input with the same operationId.", { readOnly: false }),
  setBlocking: zc.post("/mcp/tools/issues/:reference/blocking").params(mcpReferenceParams).body(mcpSetBlockingBodySchema).output(mcpOperationOutputSchema(mcpBlockingResultSchema)).errors(mcpWriteErrors).mcp("vikan_set_issue_blocking", "Explicitly set or remove A blocks B: params.reference is A, body.blockedReference is B, enabled chooses add/remove. The same edge reads as A blocks B and B blocked by A. Do NOT infer a hard dependency from a suggested order. Only same-workspace live tasks, including sibling namespaces, are allowed. Retry unchanged input with the same operationId.", { readOnly: false })
};

// packages/contract/src/mcp-comments.ts
import { z as z13 } from "zod";

// packages/contract/src/mutation-args/comments.ts
import { z as z12 } from "zod";

// packages/contract/src/comment-mentions.ts
var COMMENT_MENTION_LIMIT = 50;
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var WORD_CHAR_RE = /[A-Za-z0-9_]/;
var HINT_MAX_LENGTH = 64;
var URL_RE = /^https?:\/\/[^\s<>"'`]+/i;
var URL_TAIL_PUNCTUATION = new Set([".", ",", ";", ":", "!", "?", "…"]);
var URL_TAIL_PAIRS = { ")": "(", "]": "[", "}": "{" };
function countChar(text, char) {
  let count = 0;
  for (const candidate of text)
    if (candidate === char)
      count += 1;
  return count;
}
function trimUrlTail(raw) {
  let url = raw;
  for (;; ) {
    const last = url.at(-1);
    if (last === undefined)
      return url;
    if (URL_TAIL_PUNCTUATION.has(last)) {
      url = url.slice(0, -1);
      continue;
    }
    const opener = URL_TAIL_PAIRS[last];
    if (opener !== undefined && countChar(url, last) > countChar(url, opener)) {
      url = url.slice(0, -1);
      continue;
    }
    return url;
  }
}
function httpUrlHref(raw) {
  const trimmed = trimUrlTail(raw);
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}
function sanitizeHint(raw) {
  const hint = raw.replace(/[\r\n\]]/g, "").trim().slice(0, HINT_MAX_LENGTH).trim();
  return hint === "" ? null : hint;
}
function parseCommentBody(body) {
  const segments = [];
  let text = "";
  const flush = () => {
    if (text) {
      segments.push({ type: "text", text });
      text = "";
    }
  };
  let i = 0;
  while (i < body.length) {
    const char = body[i];
    if (char === "\\" && body[i + 1] === "@" && body[i + 2] === "[") {
      text += "@[";
      i += 3;
      continue;
    }
    if (char === "@" && body[i + 1] === "[" && (i === 0 || !WORD_CHAR_RE.test(body[i - 1]))) {
      const close = body.indexOf("]", i + 2);
      const lineEnd = body.indexOf(`
`, i + 2);
      if (close !== -1 && (lineEnd === -1 || close < lineEnd)) {
        const inner = body.slice(i + 2, close);
        const bar = inner.indexOf("|");
        const idPart = bar === -1 ? inner : inner.slice(0, bar);
        if (UUID_RE.test(idPart)) {
          flush();
          segments.push({
            type: "mention",
            userId: idPart.toLowerCase(),
            hint: bar === -1 ? null : sanitizeHint(inner.slice(bar + 1))
          });
          i = close + 1;
          continue;
        }
      }
    }
    if ((char === "h" || char === "H") && (i === 0 || !WORD_CHAR_RE.test(body[i - 1]))) {
      const match = URL_RE.exec(body.slice(i));
      const href = match === null ? null : httpUrlHref(match[0]);
      if (href !== null) {
        flush();
        segments.push({ type: "link", href, text: href });
        i += href.length;
        continue;
      }
    }
    text += char;
    i += 1;
  }
  flush();
  return segments;
}
function parseCommentMentionIds(body) {
  const ids = [];
  const seen = new Set;
  for (const segment of parseCommentBody(body)) {
    if (segment.type !== "mention" || seen.has(segment.userId))
      continue;
    seen.add(segment.userId);
    ids.push(segment.userId);
  }
  return ids;
}
function countCommentMentions(body) {
  return parseCommentMentionIds(body).length;
}

// packages/contract/src/mutation-args/comments.ts
var commentBodySchema = z12.string().trim().min(1).max(1e4).refine((body) => countCommentMentions(body) <= COMMENT_MENTION_LIMIT, {
  message: `A comment may mention at most ${COMMENT_MENTION_LIMIT} people.`
});
var createCommentArgsSchema = z12.object({
  id: uuidSchema,
  issueId: uuidSchema,
  parentCommentId: uuidSchema.optional(),
  body: commentBodySchema
});
var updateCommentArgsSchema = z12.object({
  id: uuidSchema,
  body: commentBodySchema
});
var deleteCommentArgsSchema = z12.object({ id: uuidSchema });
var COMMENT_UNDO_MS = 5 * 60 * 1000;
var restoreCommentArgsSchema = z12.object({ id: uuidSchema, deletionId: uuidSchema });

// packages/contract/src/mcp-comments.ts
var mcpCommentInputSchema = z13.strictObject({ operationId: mcpOperationIdSchema, body: commentBodySchema.describe("Saved Markdown text, up to 10,000 characters. Mention accessible members with @[UUID] using IDs from workspace metadata.") });
var mcpCreateCommentInputSchema = mcpCommentInputSchema.extend({
  parentCommentId: uuidSchema.optional().describe("Optional exact ID of a live original comment on this task, obtained from vikan_list_issue_comments. Replies are one level only; a reply cannot be the parent. Omit to post an ordinary comment.")
});
var mcpCommentResultSchema = z13.object({ issue: mcpIssueSummarySchema.pick({ id: true, identifier: true, webUrl: true }), comment: mcpCommentSchema });
var mcpCommentsContract = {
  createComment: zc.post("/mcp/tools/issues/:reference/comments").params(mcpReferenceParams).body(mcpCreateCommentInputSchema).output(mcpOperationOutputSchema(mcpCommentResultSchema)).errors(mcpWriteErrors).mcp("vikan_create_comment", "Post a saved comment as the authorized user on one existing task. To reply, read vikan_list_issue_comments and supply the exact parentCommentId of a live original comment on the same task; replies are one level only. Omit parentCommentId for an ordinary comment. Valid member mentions use @[UUID] and retain the normal subscription/notification rules. Reuse the same operationId and identical parameters, including parentCommentId, to safely retry; committed output returns the actual saved author, text and parentCommentId."),
  updateComment: zc.patch("/mcp/tools/issues/:reference/comments/:commentId").params(mcpReferenceParams.extend({ commentId: uuidSchema })).body(mcpCommentInputSchema).output(mcpOperationOutputSchema(mcpCommentResultSchema)).errors(mcpWriteErrors).mcp("vikan_update_comment", "Edit your own saved comment on the specified task. Administrators cannot edit another author’s words. Only newly added readable member mentions notify. Reuse the same operationId and identical parameters on retry.")
};

// packages/contract/src/mcp-trash.ts
import { z as z14 } from "zod";
var mcpTrashQuerySchema = z14.strictObject({ query: mcpFindIssuesQuery.shape.query, cursor: mcpFindIssuesQuery.shape.cursor, limit: mcpFindIssuesQuery.shape.limit });
var mcpTrashInputSchema = z14.strictObject({ operationId: mcpOperationIdSchema });
var mcpTrashResultSchema = z14.object({
  action: z14.enum(["deleted", "restored"]),
  issue: mcpIssueSummarySchema,
  fieldChanges: z14.array(z14.object({ field: z14.enum(["stateId", "assigneeId", "parentId"]), from: uuidSchema.nullable(), to: uuidSchema.nullable() })),
  childChanges: z14.object({ count: z14.number().int().nonnegative(), issueIds: z14.array(uuidSchema).max(50), truncated: z14.boolean() }),
  restore: z14.object({ tool: z14.literal("vikan_restore_issue"), reference: z14.string() }).nullable()
});
var mcpTrashContract = {
  findTrash: zc.get("/mcp/tools/trash").query(mcpTrashQuerySchema).output(z14.object({ dataSource: z14.literal("server-committed"), readAt: timestampSchema, items: z14.array(mcpIssueSummarySchema), nextCursor: uuidSchema.nullable(), emptyReason: z14.enum(["empty_trash", "no_matches", "end_of_results"]).nullable() })).errors(mcpWriteErrors).mcp("vikan_find_trash", "Find deleted tasks in the granted workspace by literal title words, UUID or full reference. Follow nextCursor with the same filters. Empty trash, no matches and end of pagination have explicit emptyReason values. Read-only; nothing is permanently deleted.", { readOnly: true }),
  deleteIssue: zc.post("/mcp/tools/issues/:reference/delete").params(mcpReferenceParams).body(mcpTrashInputSchema).output(mcpOperationOutputSchema(mcpTrashResultSchema)).errors(mcpWriteErrors).mcp("vikan_delete_issue", "Delete one explicitly identified task by UUID or full reference. Deletion is recoverable: content and identity are retained in Trash, and live children are detached as roots. Returns actual deletion state, child effects and the restore tool/reference. Reuse operationId and identical arguments on retry; no bulk or permanent deletion."),
  restoreIssue: zc.post("/mcp/tools/issues/:reference/restore").params(mcpReferenceParams).body(mcpTrashInputSchema).output(mcpOperationOutputSchema(mcpTrashResultSchema)).errors(mcpWriteErrors).mcp("vikan_restore_issue", "Restore the same deleted task UUID/reference and retained content. Unavailable state, assignee or parent links may be replaced or omitted: returned issue and fieldChanges report actual values, childChanges reports links reattached by this operation. Unavailable parent references are redacted to null, including previous values. Reuse operationId and identical arguments on retry.")
};

// packages/contract/src/mcp-files.ts
import { z as z16 } from "zod";

// packages/contract/src/files-contract.ts
import { z as z15 } from "zod";
var fileWorkspaceParamsSchema = z15.strictObject({ workspaceId: uuidSchema });
var fileParamsSchema = z15.strictObject({ fileId: uuidSchema });
var readErrors = errorSpecs("unauthenticated", "forbidden", "insufficient_scope", "not_found", "file_not_ready", "file_owner_mismatch", "validation_failed", "output_validation_failed", "internal");
var filesContract = {
  upload: zc.post("/workspaces/:workspaceId/files").params(fileWorkspaceParamsSchema).body(fileUploadBodySchema).output(fileUploadResultSchema).errors({ ...readErrors, ...errorSpecs("workspace_archived", "origin_forbidden", "invalid_content_length", "body_read_failed", "body_too_large", "unsupported_media_type", "unsupported_content_encoding", "invalid_file_upload", "file_too_large", "file_upload_conflict", "file_upload_in_progress", "storage_unavailable", "rate_limited", "request_cancelled") }),
  get: zc.get("/files/:fileId").params(fileParamsSchema).output(fileMetadataSchema).errors(readErrors),
  list: zc.get("/workspaces/:workspaceId/files").params(fileWorkspaceParamsSchema).query(fileListQuerySchema).output(fileListResultSchema).errors(readErrors),
  content: zc.get("/files/:fileId/content").params(fileParamsSchema).query(fileContentQuerySchema).output(fileContentResultSchema).errors({ ...readErrors, ...errorSpecs("file_inline_unsupported", "storage_unavailable") })
};

// packages/contract/src/mcp-files.ts
var MCP_UPLOAD_FILE_TOOL = "vikan_upload_file";
var maxEncodedLength = 4 * Math.ceil(MCP_FILE_MAX_BYTES / 3);
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var mcpFileBase64Schema = z16.string().max(maxEncodedLength).refine((value) => {
  if (value.length > maxEncodedLength || value.length % 4 !== 0)
    return false;
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  if (/[^A-Za-z0-9+/]/.test(value.slice(0, value.length - padding)))
    return false;
  if (value.length / 4 * 3 - padding > MCP_FILE_MAX_BYTES)
    return false;
  return padding === 0 || alphabet.indexOf(value[value.length - padding - 1]) % (padding === 2 ? 16 : 4) === 0;
}, "Use canonical padded bare base64 of at most 5 MiB decoded bytes; larger files use authenticated files.upload multipart HTTP.");
var mcpUploadFileBodySchema = z16.strictObject({
  operationId: mcpOperationIdSchema,
  owner: fileOwnerSchema.nullable().describe("Use null to stage for a later body save; otherwise the exact issue or project document UUID."),
  filename: fileNameSchema,
  mimeType: fileMimeTypeSchema.default(FILE_FALLBACK_MIME_TYPE).describe("Declared MIME only; the server verifies image bytes before allowing inline display."),
  base64: mcpFileBase64Schema
});
var mcpGetFileResultSchema = z16.strictObject({ file: fileMetadataSchema, content: fileContentResultSchema });
var mcpAttachFileBodySchema = fileNodeAttrsSchema.extend({
  operationId: mcpOperationIdSchema,
  owner: fileOwnerSchema,
  expectedVersion: z16.number().int().min(0).max(2147483646).describe("Current saved body version. A conflict never claims the file or changes the body.")
});
var mcpAttachedFileSchema = z16.strictObject({
  owner: fileOwnerSchema,
  fileId: fileNodeAttrsSchema.shape.fileId,
  version: z16.number().int().positive().max(2147483647)
});
var readErrors2 = errorSpecs("unauthenticated", "insufficient_scope", "forbidden", "not_found", "file_not_ready", "file_owner_mismatch", "validation_failed", "output_validation_failed", "internal");
var policyErrors = errorSpecs("origin_forbidden", "unsupported_media_type", "unsupported_content_encoding", "invalid_content_length", "body_read_failed", "body_too_large", "invalid_json");
var mcpFilesContract = {
  upload: zc.post("/mcp/tools/files/upload").body(mcpUploadFileBodySchema).output(fileUploadResultSchema).errors({ ...readErrors2, ...policyErrors, ...errorSpecs("workspace_archived", "invalid_file_upload", "file_too_large", "file_upload_conflict", "file_upload_in_progress", "storage_unavailable") }).mcp(MCP_UPLOAD_FILE_TOOL, "Upload any file to the granted workspace: at most 5 MiB decoded bare base64 and 8 MiB JSON envelope. Reuse operationId and identical bytes/metadata after a lost response. Returns ready metadata, without persisting bytes in MCP receipts. Files up to 50 MiB use apiContract.files.upload with Authorization: Bearer and multipart FormData. Upload alone does not insert a body node; use attach_file with the current body version.", { readOnly: false }),
  list: zc.get("/mcp/tools/files").query(fileListQuerySchema).output(fileListResultSchema).errors(readErrors2).mcp("vikan_list_files", "List ready files owned by an issue or project document in the granted workspace. Follow nextCursor; ownership survives removing a body node. Returns metadata, never file bytes.", { readOnly: true }),
  get: zc.get("/mcp/tools/files/:fileId").params(fileParamsSchema).query(fileContentQuerySchema).output(mcpGetFileResultSchema).errors({ ...readErrors2, ...errorSpecs("file_inline_unsupported", "storage_unavailable") }).mcp("vikan_get_file", "Read current file metadata and a newly authorized short-lived download URL. Default attachment; inline requires server-verified raster bytes. Call again after URL expiry. Never store URLs in document bodies.", { readOnly: true }),
  attach: zc.post("/mcp/tools/files/attach").body(mcpAttachFileBodySchema).output(mcpOperationOutputSchema(mcpAttachedFileSchema)).errors({ ...readErrors2, ...policyErrors, ...mcpWriteErrors, ...errorSpecs("workspace_archived") }).mcp("vikan_attach_file", "Append a file block to an issue description or project document, preserving all existing rich text. Requires owner UUID, fileId and expectedVersion. Claims a staged file only with a successful CAS save. Retry identical input/operationId after a lost response; resolve conflicts against the current body with a new operationId. Returns the original committed version, never a durable download URL.", { readOnly: false })
};

// packages/contract/src/issue-deliverables-contract.ts
import { z as z19 } from "zod";

// packages/contract/src/issue-deliverables.ts
import { z as z18 } from "zod";

// packages/contract/src/agent-events.ts
import { z as z17 } from "zod";
var AGENT_PROTOCOL_VERSION = 1;
var AGENT_SUPPORTED_PROTOCOL_VERSIONS = [AGENT_PROTOCOL_VERSION];
var S2_SEQ_NUM_MAX = "18446744073709551615";
var s2SeqNumSchema = z17.string().regex(/^(?:0|[1-9][0-9]{0,19})$/, "Expected a decimal u64 sequence string").refine((value) => {
  try {
    return BigInt(value) <= BigInt(S2_SEQ_NUM_MAX);
  } catch {
    return false;
  }
}, "Sequence number exceeds u64");
var captureEpochSchema = z17.string().min(8).max(128);
var frameIdSchema = z17.string().min(8).max(160);
var herdrIdSchema = z17.string().min(1).max(256);
var agentRunStatusSchema = z17.enum([
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
var AGENT_RUN_SLOT_STATUSES = ["starting", "running", "awaiting_review", "blocked", "stopping", "needs_reconciliation"];
var AGENT_RUN_NON_TERMINAL_STATUSES = ["queued", ...AGENT_RUN_SLOT_STATUSES];
var agentConnectionStateSchema = z17.enum(["online", "degraded", "offline"]);
var agentCommandKindSchema = z17.enum(["start", "continue", "cancel"]);
var agentCommandStatusSchema = z17.enum([
  "pending",
  "dispatched",
  "claimed",
  "acked",
  "expired",
  "rejected"
]);
var agentCommandClaimSchema = z17.strictObject({
  sessionId: uuidSchema,
  claimEpoch: int32Schema.min(1)
});
var protocolVersionField = z17.number().int().nonnegative();
var occurredAtField = timestampSchema;
var agentIssueChangedEventSchema = z17.strictObject({
  protocolVersion: protocolVersionField,
  type: z17.literal("issue.changed"),
  eventId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  issueId: uuidSchema,
  change: z17.enum(["assignee", "state", "project", "deleted", "archived", "other"]),
  mutationIds: z17.array(uuidSchema).min(1).max(50).optional(),
  actorId: uuidSchema.optional(),
  assigneeFrom: uuidSchema.nullable().optional(),
  assigneeTo: uuidSchema.nullable().optional(),
  stateFrom: uuidSchema.optional(),
  stateTo: uuidSchema.optional(),
  occurredAt: occurredAtField
});
var agentRunStatusEventSchema = z17.strictObject({
  protocolVersion: protocolVersionField,
  type: z17.literal("run.status"),
  eventId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  bindingId: uuidSchema,
  runId: uuidSchema,
  runVersion: int32Schema.min(1),
  status: agentRunStatusSchema,
  reason: z17.string().max(2000).nullable(),
  occurredAt: occurredAtField
});
var agentCommandSchema = z17.strictObject({
  protocolVersion: protocolVersionField,
  type: z17.literal("run.command"),
  commandId: uuidSchema,
  operationId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  bindingId: uuidSchema,
  runId: uuidSchema,
  commandSeq: int32Schema.min(1),
  kind: agentCommandKindSchema,
  status: agentCommandStatusSchema,
  prompt: z17.string().max(65536).nullable(),
  expectedRunVersion: int32Schema.min(1).nullable(),
  issuedBy: uuidSchema,
  issuedAt: occurredAtField,
  expiresAt: timestampSchema.nullable(),
  claim: agentCommandClaimSchema.nullable()
});
var SCREEN_FRAME_MAX_BYTES = 256 * 1024;
var screenFrameSchema = z17.strictObject({
  protocolVersion: protocolVersionField,
  type: z17.literal("screen.frame"),
  runId: uuidSchema,
  captureEpoch: captureEpochSchema,
  frameId: frameIdSchema,
  paneId: herdrIdSchema,
  revision: int32Schema.min(0),
  rows: int32Schema.min(1).max(1000),
  cols: int32Schema.min(1).max(1000),
  capturedAt: occurredAtField,
  format: z17.literal("ansi"),
  truncated: z17.boolean(),
  content: z17.string().max(SCREEN_FRAME_MAX_BYTES)
});
var agentEventSchema = z17.discriminatedUnion("type", [
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
var titleSchema = z18.string().trim().min(1).max(DELIVERABLE_TITLE_MAX_LENGTH);
var summarySchema = z18.string().max(DELIVERABLE_SUMMARY_MAX_LENGTH);
var positiveVersion = int32Schema.positive();
var checkIdSchema = z18.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
var failureReasonSchema = z18.string().trim().min(1).max(4000).nullable();
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
var deliverableDocumentInputSchema = z18.discriminatedUnion("format", [
  z18.strictObject({ format: z18.literal("json"), content: documentContentSchema }),
  z18.strictObject({
    format: z18.literal("text"),
    text: z18.string().max(DELIVERABLE_TEXT_MAX_LENGTH).describe("Plain text, including literal Markdown syntax. Newlines become paragraphs.")
  }).superRefine((value, ctx) => {
    try {
      textDocument(value.text);
    } catch {
      ctx.addIssue({ code: "custom", path: ["text"], message: "Text exceeds document size or complexity limits" });
    }
  })
]);
var deliverableRunSchema = z18.strictObject({
  runId: uuidSchema,
  workspaceId: uuidSchema,
  projectId: uuidSchema,
  issueId: uuidSchema,
  status: agentRunStatusSchema,
  createdAt: timestampSchema,
  startedAt: timestampSchema.nullable(),
  endedAt: timestampSchema.nullable()
});
var deliverableSourceSchema = z18.strictObject({
  author: z18.strictObject({ userId: uuidSchema, name: z18.string().min(1).max(512) }),
  run: deliverableRunSchema.nullable().describe("Explicit null for external submissions without a vikan run; never invent a run number.")
});
var stageCheckStatusSchema = z18.enum(["pending", "running", "passed", "failed", "skipped"]);
var stageCheckSchema = z18.strictObject({
  id: checkIdSchema,
  title: titleSchema,
  status: stageCheckStatusSchema,
  command: z18.string().max(2000).nullable(),
  detail: z18.string().max(4000).nullable()
});
var stageChecksSchema = z18.array(stageCheckSchema).max(STAGE_MAX_CHECKS).refine((checks) => new Set(checks.map((check) => check.id)).size === checks.length, "Check IDs must be unique within a batch");
var stageFileInputSchema = z18.strictObject({
  fileId: uuidSchema,
  posterFileId: uuidSchema.nullable(),
  caption: z18.string().max(2048),
  checkIds: z18.array(checkIdSchema).max(STAGE_MAX_CHECKS).refine((ids) => new Set(ids).size === ids.length, "Check references must be unique")
}).refine((file) => file.posterFileId?.toLowerCase() !== file.fileId.toLowerCase(), "A file cannot be its own poster");
var stageFileInputsSchema = z18.array(stageFileInputSchema).max(STAGE_MAX_FILES).refine((files) => new Set(files.map((file) => file.fileId.toLowerCase())).size === files.length, "Evidence file IDs must be unique");
var stageFileSchema = stageFileInputSchema.safeExtend({
  position: int32Schema.min(0).max(STAGE_MAX_FILES - 1),
  previewKind: filePreviewKindSchema
}).refine((file) => file.posterFileId === null || file.previewKind === "video", "Only a verified video may have a poster");
var stageStatusSchema = z18.enum(["running", "completed", "failed"]);
var stageCheckOutcomeSchema = z18.enum(["not_submitted", "pending", "passed", "failed", "incomplete"]);
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
var stageCheckSummarySchema = z18.strictObject({
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
var stageFileCountsSchema = z18.strictObject({
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
var issueStageKeySchema = z18.string().regex(/^[a-z][a-z0-9_-]{0,63}$/).describe("Artifact stage, for example plan, design, validation or review. No configuration is required.");
var scopeShape = { workspaceId: uuidSchema, issueId: uuidSchema };
var sourceInScope = (value) => value.source.run === null || sameId(value.source.run.workspaceId, value.workspaceId) && sameId(value.source.run.issueId, value.issueId);
var issueStageReferenceSchema = z18.strictObject({ stageId: uuidSchema, stage: issueStageKeySchema, revision: positiveVersion });
var issueStageSummarySchema = z18.strictObject({
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
  previewFiles: z18.array(stageFileSchema).max(DELIVERABLE_PREVIEW_LIMIT),
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
  files: z18.array(stageFileSchema).max(STAGE_MAX_FILES)
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
var publishIssueStageSubmissionSchema = z18.strictObject({
  operationId: deliverableOperationIdSchema,
  stage: issueStageKeySchema,
  expectedLatestStageId: uuidSchema.nullable().describe("Latest version of this stage, or explicit null for its first publication."),
  basedOnStageId: uuidSchema.nullable().default(null).describe("Optional explicit reference to a plan, design or other stage version in this issue."),
  title: titleSchema,
  summary: summarySchema,
  document: deliverableDocumentInputSchema,
  status: z18.enum(["running", "completed"]).default("completed"),
  checks: stageChecksSchema.default([]),
  files: stageFileInputsSchema.default([])
}).superRefine(checkFileReferences).superRefine(boundedSubmission).superRefine(completedChecks);
var publishIssueStageBodySchema = publishIssueStageSubmissionSchema.safeExtend({ sourceRunId: uuidSchema.nullable() });
var finishIssueStageSubmissionSchema = z18.strictObject({
  operationId: deliverableOperationIdSchema,
  expectedVersion: positiveVersion.max(2147483646),
  status: z18.enum(["completed", "failed"]),
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
var finishIssueStageBodySchema = finishIssueStageSubmissionSchema;
var deliverableOperationResultSchema = issueStageReferenceSchema.extend({
  ...scopeShape,
  version: positiveVersion.max(2),
  status: stageStatusSchema
}).refine((value) => value.status === "running" ? value.version === 1 : value.status !== "failed" || value.version === 2, "Receipt records the committed stage version");
var deliverableOperationOutputSchema = (result) => z18.strictObject({
  operationId: uuidSchema,
  outcome: z18.literal("committed"),
  committedAt: timestampSchema,
  replayed: z18.boolean(),
  result
});
var publishIssueStageResultSchema = deliverableOperationOutputSchema(deliverableOperationResultSchema.safeExtend({
  status: z18.enum(["running", "completed"]),
  version: z18.literal(1)
}));
var finishIssueStageResultSchema = deliverableOperationOutputSchema(deliverableOperationResultSchema.safeExtend({
  status: z18.enum(["completed", "failed"]),
  version: z18.literal(2)
}));
var readShape = { protocolVersion: z18.literal(ISSUE_DELIVERABLES_PROTOCOL_VERSION), userId: uuidSchema, ...scopeShape };
function sameId(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}
function inScope(a, b) {
  return sameId(a.workspaceId, b.workspaceId) && sameId(a.issueId, b.issueId);
}
var issueStageEntrySchema = z18.strictObject({
  stage: issueStageKeySchema,
  latest: issueStageSummarySchema,
  currentRun: issueStageSummarySchema.nullable()
});
var issueDeliverablesSummarySchema = z18.strictObject({
  ...readShape,
  latestRun: deliverableRunSchema.nullable(),
  stages: z18.array(issueStageEntrySchema)
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
var deliverablePageQuerySchema = z18.strictObject({
  limit: z18.coerce.number().int().min(1).max(DELIVERABLE_PAGE_MAX_LIMIT).default(DELIVERABLE_PAGE_DEFAULT_LIMIT),
  before: z18.coerce.number().int().positive().max(2147483647).optional().describe("Exclusive server-assigned revision from nextBefore, descending within this issue and stage.")
});
var issueStageVersionsSchema = z18.strictObject({
  ...readShape,
  stage: issueStageKeySchema,
  versions: z18.array(issueStageSummarySchema).max(DELIVERABLE_PAGE_MAX_LIMIT),
  nextBefore: positiveVersion.nullable()
}).refine((value) => value.versions.every((item, i) => inScope(item, value) && item.stage === value.stage && (i === 0 || item.revision < value.versions[i - 1].revision)) && (value.nextBefore === null || value.nextBefore === value.versions.at(-1)?.revision), "Stage page must have descending revisions and a matching cursor");
var issueStageDocumentSchema = z18.strictObject({ ...readShape, stage: issueStageSchema }).refine((value) => inScope(value.stage, value), "Stage document must belong to the requested scope");

// packages/contract/src/issue-deliverables-contract.ts
var issueDeliverableParamsSchema = z19.strictObject({ issueId: uuidSchema });
var issueStageParamsSchema = issueDeliverableParamsSchema.extend({ stage: issueStageKeySchema });
var issueStageVersionParamsSchema = issueStageParamsSchema.extend({ stageId: uuidSchema });
var deliverableReadErrors = errorSpecs("unauthenticated", "forbidden", "insufficient_scope", "not_found", "validation_failed", "output_validation_failed", "database_unavailable", "internal");
var deliverableWriteErrors = {
  ...deliverableReadErrors,
  ...errorSpecs("workspace_archived", "origin_forbidden", "invalid_content_length", "body_read_failed", "body_too_large", "unsupported_media_type", "unsupported_content_encoding", "invalid_json", "issue_stage_changed", "deliverable_reference_mismatch", "deliverable_operation_conflict", "deliverable_result_unconfirmed", "file_not_ready", "file_owner_mismatch", "stale_version", "run_invalidated")
};
var issueDeliverablesContract = {
  summary: zc.get("/issues/:issueId/stages").params(issueDeliverableParamsSchema).output(issueDeliverablesSummarySchema).errors(deliverableReadErrors),
  versions: zc.get("/issues/:issueId/stages/:stage/versions").params(issueStageParamsSchema).query(deliverablePageQuerySchema).output(issueStageVersionsSchema).errors(deliverableReadErrors),
  stage: zc.get("/issues/:issueId/stages/:stage/versions/:stageId").params(issueStageVersionParamsSchema).output(issueStageDocumentSchema).errors(deliverableReadErrors)
};

// packages/contract/src/mcp-deliverables.ts
var mcpDeliverablesContract = {
  get: zc.get("/mcp/tools/issues/:reference/stages").params(mcpReferenceParams).output(issueDeliverablesSummarySchema).errors(deliverableReadErrors).mcp("vikan_get_issue_stages", "Read existing stages (plan, design, validation, etc.), latest versions and run provenance. Each currentRun is null when this execution has no submission. Zero checks never mean passed. Reading does not approve or change issue/run status.", { readOnly: true }),
  versions: zc.get("/mcp/tools/issues/:reference/stages/:stage/versions").params(mcpReferenceParams.extend({ stage: issueStageKeySchema })).query(deliverablePageQuerySchema).output(issueStageVersionsSchema).errors(deliverableReadErrors).mcp("vikan_list_issue_stage_versions", "List versions of one stage, newest first. Follow nextBefore within this issue and stage; summaries omit document content.", { readOnly: true }),
  stage: zc.get("/mcp/tools/issues/:reference/stages/:stage/versions/:stageId").params(mcpReferenceParams.extend({ stage: issueStageKeySchema, stageId: uuidSchema })).output(issueStageDocumentSchema).errors(deliverableReadErrors).mcp("vikan_get_issue_stage", "Read a stage version, its document, checks, files and author/run provenance. Use existing file tools for fresh authorized URLs.", { readOnly: true }),
  publishStage: zc.post("/mcp/tools/issues/:reference/stages").params(mcpReferenceParams).body(publishIssueStageBodySchema).output(publishIssueStageResultSchema).errors(deliverableWriteErrors).mcp("vikan_publish_issue_stage", "Publish plan, design, validation or another stage. expectedLatestStageId is the latest version of that stage (explicit null for its first submission). status defaults to completed; use running to finish later. Document accepts JSON or plain text. Optional files/checks and basedOnStageId work for every stage. sourceRunId is null or your authorized issue run. Requires vikan:write; retry identical operationId/input after a lost response. Finished versions are immutable.", { readOnly: false }),
  finishStage: zc.post("/mcp/tools/issues/:reference/stages/:stageId/finish").params(mcpReferenceParams.extend({ stageId: uuidSchema })).body(finishIssueStageBodySchema).output(finishIssueStageResultSchema).errors(deliverableWriteErrors).mcp("vikan_finish_issue_stage", "Finish a running stage once using expectedVersion and the full document/checks/files set. completed means execution ended, not all checks passed; failed requires failureReason. Requires vikan:write. Retain operationId for retries; reruns publish a new revision. Never approves or changes issue/run status.", { readOnly: false })
};

// packages/contract/src/webhooks.ts
import { z as z20 } from "zod";
var WEBHOOK_VERSION = 1;
var webhookEventTypeSchema = z20.enum([
  "issue.created",
  "issue.updated",
  "issue.deleted",
  "comment.created",
  "comment.updated",
  "comment.deleted"
]);
var webhookUrlSchema = z20.url().max(2048).refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password && !url.hash && (!url.port || url.port === "443");
}, "Use a public HTTPS URL on port 443 without credentials or a fragment.");
var webhookCreateSchema = z20.strictObject({
  id: uuidSchema.describe("Client-generated subscription UUID. Reuse it with identical input after a lost response."),
  projectId: uuidSchema,
  url: webhookUrlSchema,
  events: z20.array(webhookEventTypeSchema).min(1).max(6).refine((v) => new Set(v).size === v.length, "Duplicate event types")
});
var webhookSchema = webhookCreateSchema.extend({
  workspaceId: uuidSchema,
  enabled: z20.boolean(),
  createdAt: timestampSchema
});
var webhookCreatedSchema = webhookSchema.extend({ secret: z20.string().regex(/^vwhsec_[A-Za-z0-9_-]{43}$/) });
var webhookEventSchema = z20.strictObject({
  id: uuidSchema,
  version: z20.literal(WEBHOOK_VERSION),
  type: webhookEventTypeSchema,
  createdAt: timestampSchema,
  workspaceId: uuidSchema,
  data: z20.strictObject({ issueId: uuidSchema, projectId: uuidSchema, commentId: uuidSchema.optional() })
});
var webhookDeliverySchema = z20.strictObject({
  id: uuidSchema,
  eventId: uuidSchema,
  type: webhookEventTypeSchema,
  status: z20.enum(["pending", "sending", "delivered", "failed", "cancelled"]),
  attempts: z20.number().int().nonnegative(),
  httpStatus: z20.number().int().nullable(),
  lastError: z20.string().nullable(),
  createdAt: timestampSchema,
  nextAttemptAt: timestampSchema,
  deliveredAt: timestampSchema.nullable()
});
var params = z20.strictObject({ webhookId: uuidSchema });
var readErrors3 = errorSpecs("unauthenticated", "insufficient_scope", "forbidden", "not_found", "validation_failed", "internal");
var writeErrors = { ...readErrors3, ...errorSpecs("origin_forbidden", "body_too_large", "unsupported_media_type", "unsupported_content_encoding", "invalid_json") };
var webhooksContract = {
  list: zc.get("/webhooks").output(z20.object({ items: z20.array(webhookSchema) })).errors(readErrors3),
  create: zc.post("/webhooks").body(webhookCreateSchema).output(webhookCreatedSchema).status(201).errors(writeErrors),
  disable: zc.post("/webhooks/:webhookId/disable").params(params).body(z20.strictObject({})).output(z20.object({ disabled: z20.literal(true) })).errors(writeErrors),
  deliveries: zc.get("/webhooks/:webhookId/deliveries").params(params).query(z20.strictObject({ cursor: uuidSchema.optional(), limit: z20.coerce.number().int().min(1).max(100).default(25) })).output(z20.object({ items: z20.array(webhookDeliverySchema), nextCursor: uuidSchema.nullable() })).errors(readErrors3)
};

// packages/contract/src/public-events.ts
import { z as z21 } from "zod";
var PUBLIC_EVENT_RETENTION_SECONDS = 7 * 86400;
var PUBLIC_EVENT_GRANT_TTL_MS = 5 * 60000;
var eventSubscriptionInputSchema = z21.strictObject({ projectId: uuidSchema });
var eventSubscriptionSchema = z21.strictObject({
  id: uuidSchema,
  projectId: uuidSchema,
  workspaceId: uuidSchema,
  basin: z21.string().min(1),
  stream: z21.string().min(1),
  token: z21.string().min(1),
  tokenExpiresAt: timestampSchema,
  nextSeqNum: s2SeqNumSchema,
  retentionSeconds: z21.literal(PUBLIC_EVENT_RETENTION_SECONDS)
});
var publicEventsContract = {
  subscribe: zc.post("/events/subscriptions").body(eventSubscriptionInputSchema).output(eventSubscriptionSchema).errors(errorSpecs("unauthenticated", "forbidden", "not_found", "validation_failed", "events_unconfigured", "rate_limited", "origin_forbidden", "body_too_large", "unsupported_media_type", "unsupported_content_encoding", "invalid_json", "internal"))
};

// packages/contract/src/sdk-public.ts
var sdkApiContract = {
  "identity.get": mcpAuthContract.identity,
  "issues.list": mcpReadContract.findIssues,
  "issues.get": mcpReadContract.getIssue,
  "issues.document": mcpReadContract.getDocument,
  "issues.relations": mcpReadContract.listRelations,
  "issues.create": mcpWriteContract.createIssue,
  "issues.update": mcpWriteContract.updateIssue,
  "issues.createSubissues": mcpPlanningContract.createSubissues,
  "issues.setParent": mcpPlanningContract.setParent,
  "issues.setBlocking": mcpPlanningContract.setBlocking,
  "issues.delete": mcpTrashContract.deleteIssue,
  "issues.restore": mcpTrashContract.restoreIssue,
  "trash.list": mcpTrashContract.findTrash,
  "comments.list": mcpReadContract.listComments,
  "comments.create": mcpCommentsContract.createComment,
  "comments.update": mcpCommentsContract.updateComment,
  "metadata.list": mcpReadContract.metadata,
  "files.upload": mcpFilesContract.upload,
  "files.list": mcpFilesContract.list,
  "files.get": mcpFilesContract.get,
  "files.attach": mcpFilesContract.attach,
  "stages.get": mcpDeliverablesContract.get,
  "stages.versions": mcpDeliverablesContract.versions,
  "stages.getVersion": mcpDeliverablesContract.stage,
  "stages.publish": mcpDeliverablesContract.publishStage,
  "stages.finish": mcpDeliverablesContract.finishStage,
  "webhooks.list": webhooksContract.list,
  "webhooks.create": webhooksContract.create,
  "webhooks.disable": webhooksContract.disable,
  "webhooks.deliveries": webhooksContract.deliveries,
  "events.createSubscription": publicEventsContract.subscribe
};

// packages/contract/src/webhook-signing.ts
var WEBHOOK_HEADERS = {
  id: "vikan-webhook-id",
  timestamp: "vikan-webhook-timestamp",
  signature: "vikan-webhook-signature"
};
var encoder = new TextEncoder;
function message(id, timestamp, body) {
  const prefix = encoder.encode(`${id}.${timestamp}.`);
  const bytes = typeof body === "string" ? encoder.encode(body) : body;
  const result = new Uint8Array(prefix.length + bytes.length);
  result.set(prefix);
  result.set(bytes, prefix.length);
  return result;
}
async function key(secret, usage) {
  if (!/^vwhsec_[A-Za-z0-9_-]{43}$/.test(secret))
    throw new Error("Invalid vikan webhook secret");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}
async function signWebhook(input) {
  const digest = await crypto.subtle.sign("HMAC", await key(input.secret, "sign"), message(input.id, input.timestamp, input.body));
  return `v1=${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}
async function verifyWebhookSignature(input) {
  const tolerance = input.toleranceSeconds ?? 300;
  const now = input.now ?? Date.now();
  if (!Number.isFinite(now) || !Number.isFinite(tolerance) || tolerance <= 0)
    throw new Error("Invalid webhook clock or tolerance");
  if (!/^[0-9]{1,12}$/.test(input.timestamp) || !/^[0-9a-f-]{36}$/i.test(input.id) || Math.abs(now / 1000 - Number(input.timestamp)) > tolerance)
    throw new Error("Expired or invalid webhook timestamp or ID");
  const hex = /^v1=([0-9a-f]{64})$/.exec(input.signature)?.[1];
  if (!hex)
    throw new Error("Invalid webhook signature");
  const bytes = Uint8Array.from(hex.match(/../g), (byte) => parseInt(byte, 16));
  if (!await crypto.subtle.verify("HMAC", await key(input.secret, "verify"), bytes, message(input.id, input.timestamp, input.body))) {
    throw new Error("Invalid webhook signature");
  }
}

// packages/contract/src/sdk-runtime.ts
var sdkContract = sdkApiContract;
function sdkInputSchema(procedure) {
  const fields = {};
  for (const part of ["params", "query", "body"]) {
    const schema = procedure.def[part];
    if (schema)
      fields[part] = schema.safeParse({}).success ? schema.optional() : schema;
  }
  return z22.strictObject(fields);
}
var inputs = Object.fromEntries(Object.entries(sdkContract).map(([name, procedure]) => [name, sdkInputSchema(procedure)]));
var operations = Object.fromEntries(Object.entries(sdkContract).map(([name, { def }]) => [name, {
  method: def.method,
  path: def.path,
  status: def.status,
  description: def.mcp?.description ?? ""
}]));
function parseInput(name, value) {
  const schema = inputs[name];
  if (!schema)
    throw new Error(`Unknown SDK operation: ${name}`);
  return schema.parse(value);
}
function parseOutput(name, value) {
  const procedure = sdkContract[name];
  if (!procedure)
    throw new Error(`Unknown SDK operation: ${name}`);
  return procedure.def.output.parse(value);
}
var parseEvent = (value) => webhookEventSchema.parse(value);
var parseProblem = (value) => problemSchema.parse(value);
export {
  WEBHOOK_HEADERS,
  operations,
  parseEvent,
  parseInput,
  parseOutput,
  parseProblem,
  sdkContract,
  sdkInputSchema,
  signWebhook,
  verifyWebhookSignature
};
