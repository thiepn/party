# Hosted room architecture — implementation draft

- Frontend: existing Vercel-hosted `party.thiepn.dev`; draft `/room/` client is **not linked** from frozen home HTML.
- Room gateway: Cloudflare Worker (not deployed). `POST /rooms` returns unpredictable 8-character code and a one-use 256-bit creation token. `GET /ws?code=...` upgrades to TLS WebSocket. `/health` returns a non-sensitive status.
- Room state: one SQLite-backed Durable Object per code. Never trust client votes, score, player role, source truth, host rights, or current round number. Message actions are authorized against server-held identity.
- Private facts: public repo includes questions and opaque fact IDs. Correct answers and provenance stay in private R2; Worker merges them server-side before starting sessions. Before votes, player views exclude truth index, author mappings and sources.
- Seats: random reconnect token, rotated on successful resume; old socket invalidated by per-seat nonce. No account required. Host transfers after 15 seconds offline if another seat is connected. Deleted after 2 hours inactive and no connected players; absolute 12-hour cap.
- QR: generated entirely in the player's browser from the public room URL; no third-party QR API or new CDN dependencies.
- Data at rest: transient room state including guesses and reconnect credentials in Durable Object storage. Do not add analytics or log message bodies. Treat tokens as secrets and never place them in URLs.
- Supported multiplayer: Social Radar, Comedy Battle and Bluff Club, all current modes. Other games remain offline/shared-phone.
- Critical gap: live Worker `wrangler dev`, cross-origin WSS, real Cloudflare SQL-backed DO hibernation, private-R2 provisioning, billing and network abuse controls have NOT been tested or deployed; production remains NO-GO.
