# vikan SDK

TypeScript SDK for the [vikan](https://vikan.dev) API, paired devices, signed HTTP webhooks and S2 event subscriptions.
ES modules for Node.js 22+ and Bun, with generated types and runtime validation.

## Install

The first npm release is being prepared. Bun applications can install directly
from Git; replace `FULL_COMMIT_SHA` with the full revision you reviewed:

```sh
bun add '@vikan/sdk@github:vikan-dev/vikan-sdk#FULL_COMMIT_SHA'
```

Git consumers use the `bun` source export and included TypeScript types, so
installation does not require lifecycle scripts or access to the main vikan
repository. For Node.js, build and install a tarball:

```sh
git clone https://github.com/vikan-dev/vikan-sdk.git
cd vikan-sdk
bun install
bun run build
bun pm pack
```

Install the resulting tarball in your application with `bun add /path/to/vikan-sdk-0.1.0.tgz`.
After the npm release, use `bun add @vikan/sdk`.

## Paired devices and CLI runners

`@vikan/sdk/agent` is the protocol client used by the open-source
[vikan CLI](https://github.com/vikan-dev/vikan-cli). Its authentication is a
paired **device credential**, separate from the public API's workspace keys.
The entry covers pairing request creation/claiming, bindings, runner sessions,
run claims and context, commands, short-lived S2 grants, and deliverable uploads.
Browser approval remains in vikan.

```ts
import { createVikanApiClient, apiFailure, AGENT_PROTOCOL_VERSION } from '@vikan/sdk/agent'

const agent = createVikanApiClient({
  apiOrigin: 'https://app.vikan.dev', // origin without /api
  credential: savedDeviceCredential,
})
try {
  const { runs } = await agent.listRuns({ bindingId })
  console.log(AGENT_PROTOCOL_VERSION, runs)
} catch (error) {
  console.error(apiFailure(error))
}
```

Omit `credential` while creating and claiming a pairing request. The caller
creates and securely stores pairing/device secrets; only the hashes belong in
`createLinkRequest`. This SDK does not execute commands or manage local state.
The CLI supplies the Herdr/Codex integration and durable task recovery.

Device calls accept injected `fetch` and `timeoutMs` (15 seconds by default),
validate successful responses, and **never retry automatically**. `ApiCallError`
classifies failures as `network`, `timeout`, `invalid-output`, or a validated
`problem` with `code`, `status`, and `title`. A network failure or timeout leaves
the result of a write unknown; reconcile state or repeat the same persisted
operation rather than creating a new one. Multipart uploads use
`uploadDeliverableFile(runId, metadata, file)`.

The entry also exports the CLI's generated Zod schemas, protocol constants,
stream-name helpers, and contextual deliverable parser. These preserve the
server's refinements and recursive document validation. S2 transport, local
configuration and process execution are caller responsibilities.

## API

Create a workspace API key in **Account → My profile → API keys**. Pass it
explicitly; the SDK never reads environment variables. Keep keys on the server.

```ts
import { createVikanClient } from '@vikan/sdk'

const vikan = createVikanClient({ apiKey: process.env.VIKAN_API_KEY! })
const identity = await vikan.identity.get()

const projects = await vikan.metadata.list({ query: { kind: 'projects' } })
const projectId = projects.items[0]!.id
const operationId = crypto.randomUUID()
const created = await vikan.issues.create({
  body: { operationId, projectId, title: 'Ship the integration' },
})
console.log(created.result.issue.identifier)

for await (const issue of vikan.paginate('issues.list', {
  query: { projectId, stateType: 'started', limit: 25 },
})) {
  console.log(issue.title)
}
```

| Resource | Methods |
| --- | --- |
| `identity` | `get` |
| `issues` | `list`, `get`, `document`, `relations`, `create`, `update`, `createSubissues`, `setParent`, `setBlocking`, `delete`, `restore` |
| `comments` | `list`, `create`, `update` |
| `metadata` | `list` (projects, milestones, members, labels, states, cycles) |
| `trash` | `list` |
| `files` | `upload`, `list`, `get`, `attach` |
| `stages` | `get`, `versions`, `getVersion`, `publish`, `finish` |
| `webhooks` | `create`, `list`, `disable`, `deliveries` |
| `events` | `createSubscription` (read-only, short-lived S2 grant) |

Methods accept the generated `{ params, query, body }` contract input and an
optional second argument `{ signal, timeoutMs }`. Types are also available as
`Input<'issues.create'>` and `Output<'issues.create'>`. `request(name, input)`
provides typed dynamic dispatch. File upload uses the base64 tool endpoint and
its server size limit; multipart upload is not exposed in this version.

The default base URL is `https://app.vikan.dev/api`. For a local or self-hosted
server, pass `baseUrl` including `/api`. Requests time out after 15 seconds.
Transient GET failures are retried twice; `maxRetries: 0` disables retries.
Writes are **never automatically retried**. Persist `operationId` and retry the
identical input with that same ID after an ambiguous failure. Generate a new
ID for a different logical action. Creation of webhook subscriptions uses `id`
for this purpose. Do not treat a network error as proof that a write failed.

Failures are `VikanApiError` (`status`, validated `code` and `problem`),
`VikanValidationError` (`direction`) or `VikanConnectionError` (`kind`). A proxy
error or unfamiliar server error still exposes its HTTP status, without an
invented business error code.

## HTTP webhooks

Webhook endpoints require a server with the public-webhooks migrations. An
administrator's **Read and write** API key can create up to 20 enabled
subscriptions per project. Subscriptions belong to the creating key; revoking
or expiring its grant, losing administrator access, or archiving its workspace
or project prevents further deliveries. Management only returns that key's
subscriptions.

```ts
const subscription = await vikan.webhooks.create({ body: {
  id: crypto.randomUUID(),
  projectId,
  url: 'https://your-app.example/hooks/vikan',
  events: ['issue.created', 'issue.updated', 'comment.created'],
} })
// Store subscription.secret in your receiver's secret store.
// Lists never reveal it. An identical creation retry returns the same secret.
```

Supported events: `issue.created`, `issue.updated`, `issue.deleted`,
`comment.created`, `comment.updated`, `comment.deleted`. Issue updates include
description and label changes. Restores are update events. Events carry IDs
for fetching current data, with the versioned shape:

```ts
{
  id: 'event-uuid', version: 1, type: 'issue.updated',
  createdAt: '2026-09-30T12:00:00.000Z', workspaceId: 'workspace-uuid',
  data: { issueId: 'issue-uuid', projectId: 'subscribed-project-uuid' }
}
```

Comment events also include `data.commentId`. A move emits an update to both
affected projects; `data.projectId` identifies the subscribed project, and each
project payload has its own event ID. A single operation may cause multiple
events. Delivery order is not guaranteed.

Verify the **original request body**, before parsing JSON:

```ts
import { verifyWebhook } from '@vikan/sdk/webhooks'

const event = await verifyWebhook({
  body: new Uint8Array(await request.arrayBuffer()),
  headers: request.headers,
  secret: storedWebhookSecret,
})
// Persist event.id with your queued work in one transaction to deduplicate.
// Return a 2xx after that durable acceptance; process the work asynchronously.
```

The sender signs HMAC-SHA256 over `deliveryId.timestamp.rawBody`, using the
UTF-8 bytes of the full `vwhsec_...` secret. Headers are `vikan-webhook-id`,
`vikan-webhook-timestamp` (Unix seconds), and `vikan-webhook-signature`
(`v1=` followed by the lowercase hex digest). Verification checks all three,
the exact body bytes, the event schema, and a five-minute clock tolerance.
`VikanWebhookError` means verification failed. Timestamp tolerance is not a
deduplication store: receivers must retain processed event IDs.

The server retries network failures, HTTP 408/429 and 5xx up to eight attempts,
with exponential backoff starting at 30 seconds. Other non-2xx responses are
terminal failures. Redirects are not followed. Each retry keeps its delivery ID
and body and gets a fresh signature timestamp. Delivery history is retained
for seven days; failures are visible via `webhooks.deliveries`. Delivery is
at least once. Disabling a webhook stops future work; an HTTP request already
in flight may finish.

## S2 event subscriptions

Use S2 when your integration can keep an outbound connection and save a cursor.
Use HTTP webhooks when you want events delivered to an existing public endpoint.
Both public transports carry the **same event IDs and payloads**; deduplicate by
`event.id` if you consume both.

```ts
import { createEventClient } from '@vikan/sdk/events'

const events = createEventClient(vikan)
const controller = new AbortController()

// Obtain the cursor BEFORE reading initial API data to avoid a sync window.
const subscription = await vikan.events.createSubscription({ body: { projectId } })
// Read your initial API data here.

for await (const { event, cursor } of events.subscribe({
  projectId, subscription, signal: controller.signal,
  // On reconnect, pass cursor: previouslySavedCursor instead.
})) {
  // Persist event.id, your queued work and cursor atomically.
  console.log(event.type, event.data, cursor)
}
```

The server must have S2 configured. Either a read or write API key may subscribe
to an active project in its granted workspace; no CLI pairing is needed. S2
tokens authorize only `read` and `check-tail` for one exact project stream.
They last at most five minutes and are renewed automatically. Revocation is
checked on renewal and accelerated by the server's revoker; S2 caching means an
already issued token is not revoked instantly. A key/project may have at most
ten concurrent unexpired grants. Reuse subscriptions across reconnects.

The SDK reconnects after network errors at the next unprocessed sequence. Keep
`cursor` as a decimal **string** and save it only after accepting the event.
The current S2 dependency uses JavaScript numbers internally: cursors beyond
`Number.MAX_SAFE_INTEGER` are rejected instead of rounded. An unexpected
sequence jump or expired retention raises `VikanEventError` with `kind: 'gap'`;
obtain a new subscription, refetch current API data, then resume from its tail.
Invalid events and permanent transport failures also stop the iterator.

Streams retain seven days of records. Capture starts with the first subscription
and stays enabled for seven days after the latest subscription/renewal. A consumer
offline longer than seven days must refetch current data even if its old numeric
cursor still exists. Stream retries may duplicate event IDs and do not imply
business ordering. Existing agent/CLI command and screen streams remain separate.

## Development and contract updates

```sh
bun install
bun run check
bun run sync:contract ../eztodo
bun run check:contract ../eztodo
bun run sync:agent ../eztodo
bun run check:agent ../eztodo
```

`src/generated/` contains an exported public subset of the main application's
contract, with source revisions and content hashes in `manifest.json` and
`agent-manifest.json`. The
SDK builds without access to the application repository. Maintainers regenerate
the snapshot when the API changes; CI runs against the committed snapshot.
Routes, request/response types, custom validation and webhook signing come from
that source. Update the source contract before regenerating; don't edit generated
code. Changesets should update the SDK version and this documentation together.

The agent export has an explicit allowlist in
`packages/contract/src/sdk-agent-runtime.ts` and `sdk-agent-public.ts` in the
application repository. The export removes router construction before bundling;
the SDK receives selected HTTP metadata, public validator exports and their
bundled protocol dependencies. Native
Zod declarations are bundled from that same source with the TypeScript 5.9
compiler API used by `dts-bundle-generator`.

See [PUBLISHING.md](PUBLISHING.md) for npm organization setup and the first release.

MIT licensed. Contributions via issues and pull requests are welcome.
