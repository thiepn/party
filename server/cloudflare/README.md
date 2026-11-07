# Cloudflare Worker + Durable Object — un-deployed draft

The Worker has no public route and no private content provisioned. `wrangler.jsonc` is a proposed configuration, **not evidence of a successful Cloudflare deployment**.

To test rules locally with built-in Node 22+ (no installed dependencies):

```sh
node --test test/*.test.mjs
node --check src/worker.mjs
```

The simulated room gateway tests are not an actual Workers WebSocket runtime. A review must verify the `fetch()` upgrade path, `blockConcurrencyWhile`, `ctx.acceptWebSocket`, `serializeAttachment`, `storage.put`, `storage.setAlarm`, R2 binding and SQLite migration against the current Worker runtime before deployment.

The private R2 object must be created manually as an authorized production release step; it is intentionally omitted from public Git history. See `docs/release-gates.md`.
