# vikan SDK

- Use Bun to install dependencies, run scripts and execute tests (`bun test`).
- Package scope is `@vikan/*`; keep the brand lowercase.
- `src/generated/` is generated from the main vikan repository's public contract. Never hand-edit routes, wire types or validation schemas there. Use `bun run sync:contract /path/to/eztodo`.
- SDK runtime code must work in Node.js 22+ and Bun. Do not read environment variables in `src/`; callers pass configuration explicitly.
- API keys authorize the public API. Webhook management requires a write key owned by a workspace administrator.
- Webhook signing and payload validation come from the same source contract used by the server. Verify original body bytes, timestamp and delivery ID before parsing the event.
- Public S2 subscriptions use API keys and exact project streams. Preserve cursor strings, enforce runtime event validation, detect retention gaps and close readers when aborted.
- Run `bun run check` and inspect `bun pm pack --dry-run` before committing. Test core behavior; avoid exhaustive implementation-mirroring tests.
- Keep screenshots, recordings and raw verification logs local.
- Commit and push completed, verified changes. npm publication requires the maintainer's registry access.
