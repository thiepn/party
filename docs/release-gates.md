# Separate production release decision — NO-GO

**Code is staged for review only. Do not merge or deploy this branch, modify DNS, or publish a room service.**

## Verified locally

- Offline `source/build.py` recreates frozen HTML SHA-256 exactly.
- Rules port: 117 session combinations and 1,077 complete rounds for 4, 5 and 6 seats.
- Adapter: 4–6 independent simulated WebSocket clients, room creation, join, authoritative scoring, origin checks, rejected unauthorized actions, reconnect token rotation, host transfer and private Fact Trap answer projection.
- Self-contained QR encoding can be decoded from the generated bitmap.

## Must pass before separately authorized release

1. **Runtime:** install and pin a reviewed Cloudflare CLI, validate the Worker build and SQLite Durable Object migration in an isolated preview environment; test cold restart, hibernation, alarm expiry and reconnection with real TLS WebSockets.
2. **Privacy:** provision R2 private content without public exposure, verify private public prompt split, ensure logs and analytics never contain answers/reconnect tokens, test invalid origins, malformed messages, input/room abuse and impersonation.
3. **Abuse:** Cloudflare WAF rate limits for room creations, room-code guesses and connection attempts, resource limits/billing alerts and a capacity cap.
4. **Client:** mobile Android Chrome/iPhone Safari, 4–6 devices on different networks, QR/share link, temporary offline/reconnect, duplicate submission, transfer and timed host failover.
5. **Gameplay:** full sessions in EN/DE for every mode, exact scoring parity with the legacy Python server, 4–6-player playtest, readability and accessibility checks.
6. **Release:** review the exact draft commit, lock dependencies, complete security audit, stage a build, confirm current `public/index.html` bytes unchanged until explicit go-live, establish rollback.

**Release recommendation: NO-GO** until these human and runtime requirements are met. Preview CI and local tests are evidence only.
